import os
import json
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

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
        print(f"[LLM Error] {e}")
        # Fallback to greeting if something fails
        return {"intent": "greeting", "entities": {}}

def generate_nlu_response(prompt: str) -> str:
    """
    Use ChatGPT API to generate concise, professional responses.
    Strictly constrained to < 80 words as per Token Optimization rules.
    """
    try:
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
        print(f"[LLM Error] {e}")
        return "I am experiencing temporary technical difficulties. Please try again."
