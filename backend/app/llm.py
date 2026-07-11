import os
import json
import logging
import sys
import traceback
import httpx
import openai
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

# Configure logger for this module
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
if not logger.handlers:
    ch = logging.StreamHandler(sys.stdout)
    ch.setLevel(logging.DEBUG)
    formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    ch.setFormatter(formatter)
    logger.addHandler(ch)

_openai_client = None

def get_openai_client() -> OpenAI:
    """
    Lazy initialization of the OpenAI client to ensure environment variables
    are loaded, and to configure proper timeouts and HTTP settings for environments like Railway.
    """
    global _openai_client
    if _openai_client is not None:
        return _openai_client

    api_key = os.getenv("OPENAI_API_KEY")
    base_url = os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1")
    http_proxy = os.getenv("HTTP_PROXY") or os.getenv("http_proxy")
    https_proxy = os.getenv("HTTPS_PROXY") or os.getenv("https_proxy")

    logger.debug("--- OpenAI Client Initialization Audit ---")
    logger.debug(f"OpenAI SDK Version: {getattr(openai, '__version__', 'unknown')}")
    logger.debug(f"Python Version: {sys.version}")
    logger.debug(f"API Key Detected: {bool(api_key)}")
    logger.debug(f"Base URL: {base_url}")
    logger.debug(f"HTTP Proxy: {http_proxy}, HTTPS Proxy: {https_proxy}")

    # Configure custom HTTP client with extended timeouts
    # Railway sometimes drops idle connections or has slow DNS/IPv6 routing.
    custom_http_client = httpx.Client(
        proxy=https_proxy or http_proxy,
        timeout=httpx.Timeout(60.0, connect=15.0, read=60.0, write=15.0, pool=60.0),
        limits=httpx.Limits(max_keepalive_connections=20, max_connections=100)
    )

    _openai_client = OpenAI(
        api_key=api_key,
        base_url=base_url,
        http_client=custom_http_client,
        max_retries=3
    )
    
    logger.debug("OpenAI client initialized successfully.")
    return _openai_client

def get_intent_and_entities(user_input: str, conversation_stage: str) -> dict:
    """
    Calls ChatGPT API to classify the user's intent into one of the specialized agents:
    - book_property
    - search_property
    - customer_info
    - site_visit
    - follow_up
    - dashboard
    - greeting
    - cancel
    - confirm
    
    It also extracts relevant entities for the specific intent.
    We instruct it to strictly return JSON.
    """
    system_prompt = f"""You are the Supervisor Agent for a Real Estate AI workspace.
Your job is to understand the user's intent and route it to the correct specialized agent.
The user is a Sales Manager. 
Current Conversation Stage: {conversation_stage}

Available Intents:
- book_property: The user wants to book or reserve a unit.
- search_property: The user is looking for properties based on location, budget, bhk, etc.
- customer_info: The user wants to lookup or update customer history or find a customer.
- site_visit: The user wants to schedule, view, reschedule, or cancel a site visit.
- follow_up: The user wants to view pending follow-ups, add notes, or update lead status.
- dashboard: The user wants to see today's bookings, sales summary, dashboard, or performance stats.
- database_qa: General questions about the database, bookings statistics, who booked what, property details, customer summaries, site visits, property availability, status of properties, or any real-estate related question based on the database records.
- greeting: Simple greetings like "hi", "hello", "hey", or "good morning". Do NOT classify real estate queries, status inquiries (like "which is now ready"), or property status checks as greeting.
- cancel: Canceling the current action, saying no, resetting.
- confirm: Confirming an action (like a booking review).

Extract the following entities if present in the text:
- property_unit (e.g. A-1203)
- project_name (e.g. Amanora)
- location (e.g. Hinjewadi, Pune)
- bhk (e.g. 2)
- budget (e.g. 1.2 Cr, 75 Lakhs)
- customer_name
- phone
- email
- booking_amount (e.g. 500000, 2 Lakhs)
- date_time (for site visits, e.g. June 28 at 10:00 AM)
- notes (for follow ups or customer notes)
- visit_id (e.g. SV-101)
- follow_up_id (e.g. FU-201)
- action (e.g. schedule, reschedule, cancel, check, search)

IMPORTANT: You must return ONLY valid JSON with keys "intent" and "entities".
Do NOT return markdown blocks, just raw JSON.
Example format:
{{
  "intent": "search_property",
  "entities": {{
    "location": "Hinjewadi",
    "bhk": "2",
    "budget": "75 Lakhs"
  }}
}}
"""
    try:
        client = get_openai_client()
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_input}
            ],
            temperature=0,
            response_format={ "type": "json_object" }
        )
        content = response.choices[0].message.content
        return json.loads(content)
    except Exception as e:
        logger.error("=" * 80)
        logger.error(f"OpenAI API Connection Error in get_intent_and_entities")
        logger.error(f"Exception Type: {type(e).__name__}")
        logger.error(f"Exception Message: {str(e)}")
        logger.error("FULL TRACEBACK:")
        logger.error(traceback.format_exc())
        logger.error("=" * 80)
        raise

def generate_nlu_response(prompt: str) -> str:
    """
    Use ChatGPT API to generate concise, professional responses.
    Strictly constrained to < 80 words as per Token Optimization rules.
    """
    try:
        client = get_openai_client()
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a professional, senior Real Estate Portfolio Manager. Your responses must be direct, crisp, and highly professional. "
                        "Keep your response concise and under 80 words. "
                        "IMPORTANT: Do NOT use email formatting, subjects, salutations (e.g. 'Dear', 'Hello [Name]'), or signatures (e.g. 'Best regards', 'Sincerely'). "
                        "When asking questions or requesting details, do NOT say 'Thank you', 'Thanks', 'Please', 'Kindly', or use conversational filler. "
                        "State the requirements directly and professionally (e.g. 'Provide the customer's name and mobile number to proceed.' or 'Specify the new date and time to reschedule.'). "
                        "Avoid any greeting, pleasantries, or thank-you phrasing in all questions."
                    )
                },
                {"role": "user", "content": prompt}
            ],
            temperature=0.3
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        logger.error("=" * 80)
        logger.error(f"OpenAI API Connection Error in generate_nlu_response")
        logger.error(f"Exception Type: {type(e).__name__}")
        logger.error(f"Exception Message: {str(e)}")
        logger.error("FULL TRACEBACK:")
        logger.error(traceback.format_exc())
        logger.error("=" * 80)
        raise

def generate_marketing_response(prompt: str) -> str:
    """
    Dedicated function for generating long-form marketing content.
    Outputs a strict JSON string to be parsed into a MarketingCard.
    """
    system_instructions = (
        "You are an elite Real Estate Marketing Manager, an expert in both residential and commercial property marketing. "
        "You have complete knowledge of all marketing strategies, SEO, branding, social media, and campaign management. "
        "You deliver high-impact, professional marketing copy, campaign strategies, and expert answers to any marketing questions. "
        "You never sound like an AI chatbot. You do not use conversational filler, introductions, or generic AI phrases. "
        "Keep the tone sophisticated, authoritative, persuasive, and strictly professional. Do not provide stupid or unprofessional advice. "
        "You MUST output your response strictly as a JSON object, without any markdown formatting blocks like ```json. "
        "CRITICAL: ABSOLUTELY NO ASTERISKS (*) ALLOWED. DO NOT use **bold** or *italic* formatting anywhere in your output. Use plain text formatting or ALL CAPS for emphasis if needed.\n"
        "The JSON MUST have the following structure:\n"
        "{\n"
        '  "title": "A short, premium title for the deliverable, strategy, or answer",\n'
        '  "sections": [\n'
        '    {\n'
        '      "heading": "e.g., Campaign Strategy, Target Audience, Expert Answer, etc.",\n'
        '      "content": "The actual marketing content, strategic advice, or proper answer. Keep it highly professional and ready-to-use. Remember, NO ASTERISKS.",\n'
        '      "tags": ["#CommercialRealEstate", "#MarketingStrategy"] // ONLY include tags if explicitly requested or for social media content. Empty array otherwise.\n'
        '    }\n'
        '  ]\n'
        "}"
    )
    
    import traceback
    client_name = "OpenAI"
    model_name = "gpt-4o"
    has_key = bool(os.getenv("OPENAI_API_KEY"))
    print(f"[API Call] Client: {client_name}, Model: {model_name}, API Key Exists: {has_key}")

    try:
        openai_client = get_openai_client()
        response = openai_client.chat.completions.create(
            model=model_name,
            messages=[
                {"role": "system", "content": system_instructions},
                {"role": "user", "content": prompt}
            ],
            temperature=0.5,
            response_format={ "type": "json_object" }
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        logger.error("=" * 80)
        logger.error(f"OpenAI API Connection Error in generate_marketing_response")
        logger.error(f"Exception Type: {type(e).__name__}")
        logger.error(f"Exception Message: {str(e)}")
        logger.error("FULL TRACEBACK:")
        logger.error(traceback.format_exc())
        logger.error("=" * 80)
        raise

def generate_image_pollinations(prompt: str) -> str:
    """
    Generates an image using Pollinations API.
    """
    import traceback
    client_name = "Pollinations AI"
    model_name = "image.pollinations.ai"
    api_key = os.getenv("POLLINATIONS_API_KEY")
    has_key = bool(api_key)
    print(f"[API Call] Client: {client_name}, Model: {model_name}, API Key Exists: {has_key}")

    try:
        import urllib.parse
        encoded_prompt = urllib.parse.quote(prompt)
        url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?nologo=true&width=1080&height=1080"
        if api_key:
            url += f"&api_key={api_key}"
        
        # Test if the URL is accessible to handle failures as requested by requirements
        import urllib.request
        headers = {"User-Agent": "Mozilla/5.0"}
        req = urllib.request.Request(url, headers=headers)
        urllib.request.urlopen(req, timeout=10)
        
        return url
    except Exception as e:
        print("=" * 80)
        print("FULL ERROR")
        traceback.print_exc()
        print("=" * 80)
        raise

