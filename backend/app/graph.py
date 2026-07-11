import re
import random
from typing import Dict, Any, List, Optional
from datetime import datetime

from langgraph.graph import StateGraph, END
from .state import AgentState
from .database import (
    search_properties,
    find_property_by_unit,
    is_property_reserved,
    find_customer_by_name,
    find_customer_by_phone,
    add_booking,
    add_customer,
    add_site_visit,
    update_site_visit,
    update_follow_up,
    get_properties,
    get_customers,
    get_site_visits,
    get_follow_ups,
    get_bookings,
    get_dashboard_stats
)
from .llm import get_intent_and_entities, generate_nlu_response, generate_image_pollinations, generate_marketing_response

workflow = StateGraph(AgentState)

# =====================================================================
# SUPERVISOR AGENT
# =====================================================================

def supervisor_node(state: AgentState) -> Dict[str, Any]:
    print("[Supervisor Agent] Executing...")
    
    current_msg = state.get("current_message", "")
    stage = state.get("conversation_stage", "GREETING")
    action = state.get("action")
    action_payload = state.get("action_payload")
    
    # Initialize execution steps
    steps = ["🧠 Analyzing your request..."]
    
    # Handle explicit frontend actions
    if action in ["cancel_booking", "reset_booking"]:
        return {
            "next_agent": "booking_creation_agent", 
            "action": action, 
            "steps": steps
        }
    elif action == "confirm_booking":
        return {
            "next_agent": "booking_creation_agent", 
            "action": action, 
            "steps": steps
        }
    elif action == "select_property":
        prop = action_payload
        prop_ctx = {"unit": prop["unit"], "project": prop["project"], "price": prop["price"]}
        return {
            "property_context": prop_ctx,
            "conversation_stage": "PROPERTY_SELECTION",
            "next_agent": "property_validation_agent",
            "steps": steps
        }

    msg_lower = current_msg.lower().strip()
    
    intent = None
    entities = {}
    
    # Simple manual regex overrides to avoid LLM token usage for direct commands
    if msg_lower in ['hi', 'hello', 'hey', 'good morning']:
        intent = "greeting"
    elif msg_lower in ['cancel', 'cancel booking', 'stop']:
        intent = "cancel"
    elif msg_lower in ['confirm', 'confirm booking']:
        intent = "confirm"
    elif len(msg_lower.split()) <= 4:
        if "dashboard" in msg_lower or "stats" in msg_lower or "performance" in msg_lower:
            intent = "dashboard"
        elif "booked today" in msg_lower or "bookings today" in msg_lower or "how many booked" in msg_lower or "how many bookings" in msg_lower or "today's bookings" in msg_lower:
            intent = "database_qa"
        elif "booking history" in msg_lower or "all bookings" in msg_lower or "history" in msg_lower:
            intent = "database_qa"
        elif "ready" in msg_lower or "which is" in msg_lower or "what is" in msg_lower:
            intent = "database_qa"
        elif "site visit" in msg_lower or "visit" in msg_lower:
            intent = "site_visit"
        elif "follow" in msg_lower or "remind" in msg_lower:
            intent = "follow_up"
        elif re.search(r"\b(book|reserve)\b", msg_lower) and not re.search(r"\b(bookings|history)\b", msg_lower):
            intent = "book_property"
        elif "search" in msg_lower or "available" in msg_lower or "inventory" in msg_lower:
            intent = "search_property"
        elif "finance" in msg_lower or "loan" in msg_lower or "emi" in msg_lower or "interest" in msg_lower or "mortgage" in msg_lower or "financial" in msg_lower:
            intent = "financial"
        elif "amenities" in msg_lower or "builder" in msg_lower or "project details" in msg_lower or "project info" in msg_lower or "tell me about the project" in msg_lower:
            intent = "project_information"

    if not intent:
        if "marketing" in msg_lower or "social media" in msg_lower or "campaign" in msg_lower or "seo" in msg_lower or "hashtag" in msg_lower or "brochure" in msg_lower or "advertisement" in msg_lower or "caption" in msg_lower or "email marketing" in msg_lower or "instagram" in msg_lower or "facebook" in msg_lower or "linkedin" in msg_lower or "promotional" in msg_lower or "creative" in msg_lower:
            intent = "marketing"

    # Call LLM only if intent is still unknown
    if not intent:
        if current_msg:
            result = get_intent_and_entities(current_msg, stage)
            intent = result.get("intent", "greeting")
            entities = result.get("entities", {})
        else:
            intent = "greeting"

    # Guide continuation of the booking process
    if stage in ["CUSTOMER_INFORMATION", "PROPERTY_SELECTION"] and intent not in ["cancel", "confirm", "dashboard", "site_visit", "follow_up", "database_qa", "search_property", "greeting", "financial", "project_information", "marketing"]:
        intent = "book_property"
    elif stage == "SITE_VISIT" and intent not in ["cancel", "confirm", "dashboard", "site_visit", "follow_up", "greeting", "database_qa", "search_property", "financial", "project_information", "marketing"]:
        intent = "site_visit"

    print(f"[Supervisor Agent] Intent: {intent}, Entities: {entities}")
    
    # Get contexts
    prop_ctx = state.get("property_context") or {}
    cust_ctx = state.get("customer_context") or {}
    book_ctx = state.get("booking_context") or {}
    visit_ctx = state.get("site_visit_context") or {}
    follow_ctx = state.get("follow_up_context") or {}
    
    # Entity Extraction: automatically update context and never ask again
    if entities.get("property_unit"): prop_ctx["unit"] = entities.get("property_unit")
    if entities.get("project_name"): prop_ctx["project"] = entities.get("project_name")
    if entities.get("location"): prop_ctx["location"] = entities.get("location")
    if entities.get("bhk"): prop_ctx["type"] = str(entities.get("bhk"))
    if entities.get("budget"): prop_ctx["budget"] = entities.get("budget")
    if entities.get("builder"): prop_ctx["builder"] = entities.get("builder")
    if entities.get("amenities"): prop_ctx["amenities"] = entities.get("amenities")
    
    if entities.get("customer_name"): cust_ctx["name"] = entities.get("customer_name")
    if entities.get("phone"): cust_ctx["phone"] = entities.get("phone")
    if entities.get("email"): cust_ctx["email"] = entities.get("email")
    if entities.get("notes"): cust_ctx["notes"] = entities.get("notes")
    
    if entities.get("booking_amount"): book_ctx["amount"] = entities.get("booking_amount")
    
    if entities.get("visit_id"): visit_ctx["id"] = entities.get("visit_id")
    if entities.get("date_time"): visit_ctx["date_time"] = entities.get("date_time")
    if entities.get("action"): visit_ctx["action"] = entities.get("action")
    
    if entities.get("follow_up_id"): follow_ctx["id"] = entities.get("follow_up_id")

    # Routing execution
    if intent == "greeting":
        return {
            "conversation_stage": "GREETING",
            "next_agent": "greeting_agent",
            "steps": steps
        }
    elif intent == "cancel" or intent == "confirm":
        return {
            "next_agent": "booking_creation_agent",
            "steps": steps
        }
    elif intent == "search_property":
        return {
            "property_context": prop_ctx,
            "conversation_stage": "PROPERTY_SEARCH",
            "next_agent": "property_search_agent",
            "steps": steps
        }
    elif intent == "customer_info":
        return {
            "customer_context": cust_ctx,
            "conversation_stage": "CUSTOMER_SEARCH",
            "next_agent": "customer_agent",
            "steps": steps
        }
    elif intent == "site_visit":
        return {
            "customer_context": cust_ctx,
            "property_context": prop_ctx,
            "site_visit_context": visit_ctx,
            "conversation_stage": "SITE_VISIT",
            "next_agent": "site_visit_agent",
            "steps": steps
        }
    elif intent == "follow_up":
        return {
            "customer_context": cust_ctx,
            "follow_up_context": follow_ctx,
            "conversation_stage": "FOLLOW_UP",
            "next_agent": "follow_up_agent",
            "steps": steps
        }
    elif intent == "dashboard":
        return {
            "conversation_stage": "DASHBOARD",
            "next_agent": "dashboard_agent",
            "steps": steps
        }
    elif intent == "database_qa":
        return {
            "conversation_stage": "GREETING",
            "next_agent": "database_qa_agent",
            "steps": steps
        }
    elif intent == "financial":
        return {
            "conversation_stage": "FINANCIAL_ADVICE",
            "next_agent": "financial_agent",
            "steps": steps
        }
    elif intent == "project_information":
        return {
            "conversation_stage": "PROJECT_INFORMATION",
            "next_agent": "project_information_agent",
            "steps": steps
        }
    elif intent == "marketing":
        return {
            "conversation_stage": "MARKETING",
            "next_agent": "marketing_agent",
            "steps": steps
        }
        
    # Default is booking
    return {
        "property_context": prop_ctx,
        "customer_context": cust_ctx,
        "booking_context": book_ctx,
        "next_agent": "property_validation_agent",
        "steps": steps
    }

# =====================================================================
# SPECIALIZED AGENTS
# =====================================================================

def marketing_agent_node(state: AgentState) -> Dict[str, Any]:
    print("[Marketing Agent] Executing...")
    steps = state.get("steps", [])
    steps.extend(["🤖 Marketing Agent activated", "📝 Generating marketing content"])
    
    current_msg = state.get("current_message", "")
    prop_ctx = state.get("property_context") or {}
    
    all_props = get_properties()
    
    db_context = f"All Properties/Projects Data: {all_props}\nCurrently Discussed Property: {prop_ctx.get('unit', 'None')} | Project: {prop_ctx.get('project', 'None')}"
    
    msg_lower = current_msg.lower()
    import re
    
    # Detect intents based on rules
    needs_image = bool(re.search(r'\b(image|poster|creative|banner|flyer|instagram post image|social media creative|generate image|marketing creative)\b', msg_lower))
    is_caption_only = bool(re.search(r'\b(caption|hashtags|text only|just text)\b', msg_lower)) and not needs_image
    
    if is_caption_only:
        intent_instructions = """IF THE USER REQUESTS ONLY A CAPTION OR TEXT:
DO NOT generate any image or image descriptions.
Generate ONLY the following sections in your JSON:
1. "Instagram Caption"
2. "Hashtags"
Return the minimum required content. Do NOT generate unnecessary sections."""
    elif needs_image:
        intent_instructions = """IF THE USER REQUESTS AN IMAGE OR CREATIVE:
Generate ONLY the following sections in your JSON:
1. "Instagram Caption"
2. "Hashtags"
Return the minimum required content. Do NOT generate unnecessary sections."""
    else:
        intent_instructions = """IF THE USER REQUESTS A MARKETING CAMPAIGN:
Generate a complete marketing campaign.
Generate ONLY the following sections in your JSON:
1. "Campaign Strategy"
2. "Target Audience"
3. "Content Plan"
4. "KPI"
5. "Execution Timeline"
Return the minimum required content. DO NOT generate an image unless explicitly requested."""

    # 1. Generate the marketing campaign
    prompt = f"""You are an elite, all-knowing Real Estate Marketing Manager.
Your expertise covers ALL aspects of marketing, specifically tailored to residential and commercial real estate. You know everything about marketing strategy, social media, SEO, campaigns, branding, and copywriting.
The user's marketing request/question: '{current_msg}'
Database Context: {db_context}

CRITICAL INSTRUCTIONS:
1. Act as a seasoned, highly professional Marketing Manager. Do NOT make up unprofessional things.
2. Answer EXACTLY what the user asks.
3. {intent_instructions}
4. Format your response cleanly and logically. The response should always be concise, task-specific, and highly professional.
5. Focus exclusively on real estate.
6. If the user mentions a specific project, integrate its details. IF THE PROJECT IS NOT IN THE DATABASE CONTEXT, simply generate realistic mock data (amenities, location, price, etc.) for it. DO NOT refuse to generate content because a property is missing from the database.
7. Do not use generic AI filler ("As an AI", "Here is your content"). Deliver the work directly and authoritatively.
8. CRITICAL: NEVER use asterisks (*). DO NOT USE **bold** or *italic* markdown. Output plain text only."""
    
    try:
        import json
        response_json_str = generate_marketing_response(prompt)
        payload = json.loads(response_json_str)
        response_text = "Here is your requested marketing content:"
        response_type = "marketing_campaign"
        
        if needs_image:
            steps.append("🖼️ Generating Pollinations AI image")
            campaign_summary = payload.get("title", "") + " " + " ".join([s.get("heading", "") for s in payload.get("sections", [])])
            img_prompt = generate_nlu_response(f"Create a highly detailed prompt for an AI image generator to generate a premium REAL ESTATE marketing image for this campaign: {campaign_summary}. CRITICAL REQUIREMENT: The image MUST be of real estate (e.g., luxury apartment towers, modern architecture, premium interiors, landscaped gardens). DO NOT generate images of people, logos, random objects, or anything unrelated to real estate property. Requirements: Ultra-realistic, golden hour lighting, cinematic perspective, 4K quality, no text, no watermark. Provide ONLY the prompt text, no intro, no conversational filler.")
            
            # 3. Send prompt to Pollinations API
            try:
                url = generate_image_pollinations(img_prompt)
                payload["image_url"] = url
            except Exception as img_err:
                print(f"[Marketing Agent] Image generation failed: {img_err}")
                response_text += "\n\n*Image generation is currently unavailable.*"
            
    except Exception as e:
        print(f"[Marketing Agent Error] {e}")
        import traceback
        traceback.print_exc()
        response_text = f"An error occurred: {str(e)}"
        response_type = "text"
        payload = None
        
    steps.append("✅ Ready")
    
    return {
        "conversation_stage": "MARKETING",
        "response_text": response_text,
        "response_type": response_type,
        "response_payload": payload,
        "response_actions": [],
        "response_agent_name": "Marketing Agent",
        "next_agent": END,
        "steps": steps
    }

def financial_agent_node(state: AgentState) -> Dict[str, Any]:
    print("[Financial Agent] Executing...")
    steps = state.get("steps", [])
    steps.extend(["🤖 Financial Agent activated", "📊 Analyzing financial request", "✅ Ready"])
    
    current_msg = state.get("current_message", "")
    prop_ctx = state.get("property_context") or {}
    
    db_context = f"Currently Discussed Property: {prop_ctx.get('unit', 'None')} | Price Context: {prop_ctx.get('price', 'None')}"
    
    prompt = f"You are an expert Financial Real Estate Agent.\nThe user asked a financial question: '{current_msg}'\nContext: {db_context}\nProvide a highly professional, accurate, and detailed financial analysis or advice answering the question. Use markdown bolding, bullet points, and clear formatting to make it look premium and professional. Limit to 150 words. Do not include salutations or signatures."
    
    response_text = generate_nlu_response(prompt)
    
    return {
        "conversation_stage": "FINANCIAL_ADVICE",
        "response_text": response_text,
        "response_type": "text",
        "response_payload": None,
        "response_actions": [],
        "response_agent_name": "Financial Agent",
        "next_agent": END,
        "steps": steps
    }

def project_information_agent_node(state: AgentState) -> Dict[str, Any]:
    print("[Project Information Agent] Executing...")
    steps = state.get("steps", [])
    steps.extend(["🤖 Project Info Agent activated", "🏢 Retrieving project details", "✅ Ready"])
    
    current_msg = state.get("current_message", "")
    prop_ctx = state.get("property_context") or {}
    
    all_props = get_properties()
    
    db_context = f"All Properties/Projects Data: {all_props}\nCurrently Discussed Property: {prop_ctx.get('unit', 'None')} | Project: {prop_ctx.get('project', 'None')}"
    
    prompt = f"You are a Project Information Real Estate Agent.\nThe user asked about a project or amenities: '{current_msg}'\nContext: {db_context}\nProvide a highly professional, accurate description of the project, its amenities, builder, or location answering the user's question based strictly on the provided context. Use markdown bolding and bullet points to make it look premium. Limit to 150 words. Do not include salutations."
    
    response_text = generate_nlu_response(prompt)
    
    return {
        "conversation_stage": "PROJECT_INFORMATION",
        "response_text": response_text,
        "response_type": "text",
        "response_payload": None,
        "response_actions": [],
        "response_agent_name": "Project Info Agent",
        "next_agent": END,
        "steps": steps
    }

def greeting_agent_node(state: AgentState) -> Dict[str, Any]:
    print("[Greeting Agent] Executing...")
    steps = state.get("steps", [])
    steps.append("✅ Ready")
    
    greetings = [
        "Hello! I am RealState AI. How can I assist you with properties, bookings, or site visits today?",
        "Hi there! What can I help you manage today? I can assist with inventory searches, customer follow-ups, and more.",
        "Welcome! I am ready to help you with property bookings, dashboard stats, and scheduling."
    ]
    response_text = random.choice(greetings)
    
    return {
        "conversation_stage": "GREETING",
        "response_text": response_text,
        "response_type": "greeting_actions",
        "response_payload": None,
        "response_actions": ["book_property", "search_property", "site_visit", "follow_up", "dashboard"],
        "response_agent_name": "AI Assistant",
        "next_agent": END,
        "steps": steps
    }

def property_search_agent_node(state: AgentState) -> Dict[str, Any]:
    print("[Property Search Agent] Executing...")
    steps = state.get("steps", [])
    steps.extend(["🤖 Property Search Agent activated", "🔍 Searching property inventory", "✅ Ready"])
    
    prop_ctx = state.get("property_context") or {}
    project = prop_ctx.get("project", "")
    location = prop_ctx.get("location", "")
    bhk = prop_ctx.get("type", "")
    budget_str = prop_ctx.get("budget", "")
    builder = prop_ctx.get("builder", "")
    amenity_query = prop_ctx.get("amenities", "")
    
    all_props = get_properties()
    matched = []
    
    # Budget parsing helper
    budget_val = None
    if budget_str:
        digits = "".join(filter(str.isdigit, budget_str))
        if digits:
            val = float(digits)
            if "cr" in budget_str.lower():
                m = re.search(r"(\d+\.?\d*)", budget_str)
                if m:
                    val = float(m.group(1))
                    budget_val = int(val * 10000000)
            elif "lakh" in budget_str.lower() or "l" in budget_str.lower():
                m = re.search(r"(\d+\.?\d*)", budget_str)
                if m:
                    val = float(m.group(1))
                    budget_val = int(val * 100000)
            else:
                budget_val = int(val)

    for prop in all_props:
        if location and location.lower() not in prop["city"].lower() and location.lower() not in prop["project"].lower():
            continue
        if project and project.lower() not in prop["project"].lower():
            continue
        if bhk and prop["type"] != str(bhk):
            continue
        if builder and builder.lower() not in prop.get("builder", "").lower():
            continue
        if budget_val and prop.get("price_val", 0) > budget_val:
            continue
        if amenity_query:
            prop_amenities = [a.lower() for a in prop.get("amenities", [])]
            if isinstance(amenity_query, list):
                if not any(aq.lower() in prop_amenities for aq in amenity_query):
                    continue
            else:
                if not any(amenity_query.lower() in a for a in prop_amenities):
                    continue
                    
        matched.append({**prop, "reserved": is_property_reserved(prop["unit"])})
        
    response_text = f"We searched the inventory and found **{len(matched)} matching units**. Let me know if you would like to book one of these properties or refine your search." if matched else "I couldn't find any properties matching those criteria. Would you like to adjust your search?"
    return {
        "conversation_stage": "PROPERTY_SEARCH",
        "response_text": response_text,
        "response_type": "properties",
        "response_payload": matched,
        "response_actions": [],
        "response_agent_name": "Property Search Agent",
        "next_agent": END,
        "steps": steps
    }

def customer_agent_node(state: AgentState) -> Dict[str, Any]:
    print("[Customer Agent] Executing...")
    steps = state.get("steps", [])
    steps.extend(["🤖 Customer Agent activated", "👤 Retrieving customer records", "✅ Ready"])
    
    cust_ctx = state.get("customer_context") or {}
    name = cust_ctx.get("name", "")
    
    all_custs = get_customers()
    matched = []
    
    for c in all_custs:
        if name and name.lower() not in c["name"].lower():
            continue
            
        c_bookings = [b for b in get_bookings() if b["customerName"].lower() == c["name"].lower()]
        c_visits = [v for v in get_site_visits() if v["customerName"].lower() == c["name"].lower()]
        c_follow_ups = [f for f in get_follow_ups() if f["customerName"].lower() == c["name"].lower()]
        
        matched.append({
            **c,
            "bookings": c_bookings,
            "site_visits": c_visits,
            "follow_ups": c_follow_ups
        })
        
    if name and matched:
        response_text = f"Found the profile for **{name}**. Status: {matched[0].get('status', 'Active')}."
    elif name and not matched:
        response_text = f"Customer '{name}' was not found in the database."
    else:
        response_text = "Here is the directory of registered customers."
        
    return {
        "conversation_stage": "CUSTOMER_SEARCH",
        "response_text": response_text,
        "response_type": "customers",
        "response_payload": matched,
        "response_actions": [],
        "response_agent_name": "Customer Agent",
        "next_agent": END,
        "steps": steps
    }

def site_visit_agent_node(state: AgentState) -> Dict[str, Any]:
    print("[Site Visit Agent] Executing...")
    steps = state.get("steps", [])
    steps.extend(["🤖 Site Visit Agent activated", "📅 Accessing site visit logs", "✅ Ready"])
    
    current_msg = state.get("current_message", "").lower()
    cust_ctx = state.get("customer_context") or {}
    prop_ctx = state.get("property_context") or {}
    visit_ctx = state.get("site_visit_context") or {}
    
    action = visit_ctx.get("action") or ""
    if "schedule" in current_msg or "book" in current_msg:
        action = "schedule"
    elif "reschedule" in current_msg or "change" in current_msg:
        action = "reschedule"
    elif "cancel" in current_msg or "delete" in current_msg:
        action = "cancel"
        
    if not action:
        action = "schedule"
        
    payload = []
    response_text = ""
    
    if action == "schedule":
        c_name = cust_ctx.get("name")
        project = prop_ctx.get("project") or prop_ctx.get("unit")
        dt_str = visit_ctx.get("date_time")
        
        missing_fields = []
        if not c_name: missing_fields.append("Customer Name")
        if not project: missing_fields.append("Project/Property Name")
        if not dt_str: missing_fields.append("Date & Time of the visit")
        
        if not current_msg.startswith("customer: ") and not current_msg.startswith("confirm"):
            fields_str = ", ".join(missing_fields)
            if missing_fields:
                response_text = f"To schedule a site visit, please provide the following details: **{fields_str}**."
            else:
                response_text = "Please review and confirm the site visit details below."
                
            return {
                "conversation_stage": "SITE_VISIT",
                "site_visit_context": {**visit_ctx, "action": "schedule"},
                "response_text": response_text,
                "response_type": "site_visit_form",
                "response_payload": {"customerName": c_name or "", "project": project or "", "dateTime": dt_str or ""},
                "response_actions": [],
                "response_agent_name": "Site Visit Agent",
                "next_agent": END,
                "steps": steps
            }
            
        parts = dt_str.split(" at ") if dt_str else ["Tomorrow", "11:00 AM"]
        visit_date = parts[0] if len(parts) > 0 else dt_str
        visit_time = parts[1] if len(parts) > 1 else "10:00 AM"
        
        new_id = f"SV-{random.randint(103, 999)}"
        new_visit = {
            "id": new_id,
            "customerName": c_name,
            "project": project,
            "date": visit_date,
            "time": visit_time,
            "executive": "Rahul Mehta",
            "status": "Scheduled"
        }
        add_site_visit(new_visit)
        response_text_raw = f"Site visit scheduled successfully. ID: {new_id}."
        payload = [new_visit]
        
    elif action == "reschedule":
        visit_id = visit_ctx.get("id")
        dt_str = visit_ctx.get("date_time")
        
        missing_fields = []
        if not visit_id: missing_fields.append("Site Visit ID (e.g. SV-101)")
        if not dt_str: missing_fields.append("New Date & Time of the visit")
        
        if missing_fields:
            fields_str = ", ".join(missing_fields)
            fields_str = ", ".join(missing_fields)
            response_text = f"To reschedule the site visit, please provide: **{fields_str}**."
            return {
                "conversation_stage": "SITE_VISIT",
                "site_visit_context": {**visit_ctx, "action": "reschedule"},
                "response_text": response_text,
                "response_type": "text",
                "response_payload": None,
                "response_actions": [],
                "response_agent_name": "Site Visit Agent",
                "next_agent": END,
                "steps": steps
            }
            
        parts = dt_str.split(" at ")
        visit_date = parts[0] if len(parts) > 0 else dt_str
        visit_time = parts[1] if len(parts) > 1 else "03:00 PM"
        
        updated = update_site_visit(visit_id, {"date": visit_date, "time": visit_time})
        if updated:
            response_text_raw = f"Site visit {visit_id} rescheduled to {visit_date} at {visit_time}."
            payload = [updated]
        else:
            response_text_raw = f"Site visit {visit_id} not found."
            payload = get_site_visits()
            
    elif action == "cancel":
        visit_id = visit_ctx.get("id")
        
        if not visit_id:
            response_text = "Please provide the Site Visit ID (e.g., SV-101) you wish to cancel."
            return {
                "conversation_stage": "SITE_VISIT",
                "site_visit_context": {**visit_ctx, "action": "cancel"},
                "response_text": response_text,
                "response_type": "text",
                "response_payload": None,
                "response_actions": [],
                "response_agent_name": "Site Visit Agent",
                "next_agent": END,
                "steps": steps
            }
            
        updated = update_site_visit(visit_id, {"status": "Cancelled"})
        if updated:
            response_text_raw = f"Site visit {visit_id} has been cancelled."
            payload = [updated]
        else:
            response_text_raw = f"Site visit {visit_id} not found."
            payload = get_site_visits()
    else:
        response_text_raw = "Here are the scheduled site visits."
        payload = get_site_visits()
        
    response_text = response_text_raw
    return {
        "conversation_stage": "GREETING",
        "site_visit_context": {},
        "response_text": response_text,
        "response_type": "site_visits",
        "response_payload": payload,
        "response_actions": [],
        "response_agent_name": "Site Visit Agent",
        "next_agent": END,
        "steps": steps
    }

def follow_up_agent_node(state: AgentState) -> Dict[str, Any]:
    print("[Follow-up Agent] Executing...")
    steps = state.get("steps", [])
    steps.extend(["🤖 Follow-up Agent activated", "📝 Fetching lead follow-ups", "✅ Ready"])
    
    current_msg = state.get("current_message", "").lower()
    follow_ctx = state.get("follow_up_context") or {}
    cust_ctx = state.get("customer_context") or {}
    
    follow_up_id = follow_ctx.get("id")
    m = re.search(r"fu-\d+", current_msg)
    if m:
        follow_up_id = m.group(0).upper()
        
    notes = cust_ctx.get("notes")
    if not notes and "notes" in current_msg:
        parts = current_msg.split(":")
        if len(parts) > 1:
            notes = parts[1].strip()
            
    if follow_up_id and notes:
        updated = update_follow_up(follow_up_id, {"notes": notes})
        if updated:
            response_text_raw = f"Follow-up {follow_up_id} updated with notes."
            payload = [updated]
        else:
            response_text_raw = f"Follow-up {follow_up_id} not found."
            payload = get_follow_ups()
    else:
        response_text_raw = "Here are the pending follow-ups."
        payload = get_follow_ups()
        
    response_text = response_text_raw
        
    return {
        "conversation_stage": "FOLLOW_UP",
        "response_text": response_text,
        "response_type": "follow_ups",
        "response_payload": payload,
        "response_actions": [],
        "response_agent_name": "Follow-up Agent",
        "next_agent": END,
        "steps": steps
    }

def dashboard_agent_node(state: AgentState) -> Dict[str, Any]:
    print("[Dashboard Agent] Executing...")
    steps = state.get("steps", [])
    steps.extend(["🤖 Dashboard Agent activated", "📊 Generating sales insights", "✅ Ready"])
    
    stats = get_dashboard_stats()
    response_text = f"Here is the daily performance dashboard. Total Revenue: **{stats.get('total_revenue', '')}**. Today's Bookings: **{stats.get('today_bookings', 0)}**."
    return {
        "conversation_stage": "DASHBOARD",
        "response_text": response_text,
        "response_type": "dashboard_stats",
        "response_payload": stats,
        "response_actions": [],
        "response_agent_name": "Dashboard Agent",
        "next_agent": END,
        "steps": steps
    }

def database_qa_agent_node(state: AgentState) -> Dict[str, Any]:
    print("[Database QA Agent] Executing...")
    steps = state.get("steps", [])
    steps.extend(["🤖 Database Agent activated", "🔍 Querying database records", "✅ Ready"])
    
    current_msg = state.get("current_message", "")
    
    # Retrieve all objects from the database
    properties = get_properties()
    customers = get_customers()
    bookings = get_bookings()
    site_visits = get_site_visits()
    follow_ups = get_follow_ups()
    
    prop_ctx = state.get("property_context") or {}
    cust_ctx = state.get("customer_context") or {}
    
    db_context = f"""
    Available Properties in database: {properties}
    Registered Customers in database: {customers}
    Bookings in database: {bookings}
    Site Visits in database: {site_visits}
    Follow-ups in database: {follow_ups}
    Today's Date: {datetime.now().strftime("%b %d, %Y")}
    Currently Discussed Property: {prop_ctx.get('unit', 'None')}
    Currently Discussed Customer: {cust_ctx.get('name', 'None')}
    """
    
    prompt = f"""
    You are the Database QA & Real Estate Agent.
    The user (Sales Manager) asked: '{current_msg}'
    
    Here is the current database state context:
    {db_context}
    
    Analyze the user's question and decide what information they requested. You MUST reply ONLY with a valid JSON object matching one of the cases below. Do not include any markdown wrappers or quotes around the JSON.
    
    IMPORTANT: You must first formulate step-by-step reasoning on the database values inside the "thinking" key of the JSON to ensure 100% mathematical accuracy.
    
    IMPORTANT: Do NOT confuse property readiness or availability with bookings. If the user asks which properties are ready, available, or ready-to-move-in, you MUST classify it as Case 5.
    
    Case 1: The user is asking about bookings, booking history, who booked today, how many bookings today, booking counts, or booking statistics (even if the query also asks about other metrics like customer counts or site visits):
       Identify the matching or relevant bookings (or all bookings if asking generally). Respond in JSON format:
       {{
         "thinking": "Step-by-step analysis of the database bookings list, counting and filtering matching records.",
         "response_text": "A premium, professional executive-level summary answering all parts of the user's question. Use markdown bolding (e.g. **2 bookings** or unit **A-1203**) for key metrics, units, and dates to make it look polished. Limit to 60 words.",
         "response_type": "bookings",
         "payload": [ List of matching booking objects containing: 'id', 'customerName', 'unit', 'amount', 'status', 'timestamp' ]
       }}
       
    Case 2: The user is asking for a list of customers, customer profiles, directory, or customer details:
       Identify the matching customers. Respond in JSON format:
       {{
         "thinking": "Step-by-step lookup of customers in the database matching the criteria.",
         "response_text": "A premium, professional summary of registered clients. Highlight key metrics (e.g., status, counts) using markdown bolding. Limit to 60 words.",
         "response_type": "customers",
         "payload": [ List of customer objects containing: 'name', 'email', 'phone', 'status', 'assignedAgent', 'dateAdded' ]
       }}
       
    Case 3: The user is asking for site visits or scheduled tours:
       Identify the matching site visits. Respond in JSON format:
       {{
         "thinking": "Step-by-step filtering of site visits from database state.",
         "response_text": "A premium, professional summary of scheduled tours or visits. Highlight dates, times, and status using markdown bolding. Limit to 60 words.",
         "response_type": "site_visits",
         "payload": [ List of site visit objects containing: 'id', 'customerName', 'project', 'date', 'time', 'executive', 'status' ]
       }}
       
    Case 5: The user is asking about property availability, ready units, list of properties, or requesting details/full details of a specific property:
       Identify the specific property or properties requested. If they ask generally, return all available units. If they ask for details of a specific unit (or the Currently Discussed Property), return ONLY that specific property in the payload. Respond in JSON format:
       {{
         "thinking": "Step-by-step inventory count or lookup of the requested unit(s).",
         "response_text": "A professional, direct introductory text without listing the raw details in text, as they are shown on the cards below. Limit to 30 words. Do NOT say thank you.",
         "response_type": "properties",
         "payload": [ List of requested property objects ]
       }}
       
    Case 4: General Q&A / Other requests:
       Respond in JSON format:
       {{
         "thinking": "Step-by-step analysis of the database to construct a direct answer.",
         "response_text": "A highly accurate, professional response answering the question based strictly on the database context. Formatted with markdown bolding to emphasize names, status, or key facts. Limit to 90 words.",
         "response_type": "text",
         "payload": null
       }}
    """
    response_json = generate_nlu_response(prompt)
    
    # Try parsing response_json. If it fails, fall back to default text
    try:
        # Strip potential markdown codeblock wrappers
        cleaned_json = response_json.strip()
        if cleaned_json.startswith("```json"):
            cleaned_json = cleaned_json[7:]
        if cleaned_json.endswith("```"):
            cleaned_json = cleaned_json[:-3]
        cleaned_json = cleaned_json.strip()
        
        import json
        parsed = json.loads(cleaned_json)
        response_text = parsed.get("response_text", "")
        response_type = parsed.get("response_type", "text")
        payload = parsed.get("payload")
    except Exception as e:
        print(f"[Database QA Agent] JSON parsing failed: {e}. Raw response: {response_json}")
        # Fallback to general text response
        prompt_fallback = f"""
        You are the Database QA & Real Estate Agent.
        The user asked: '{current_msg}'
        Context: {db_context}
        Provide a professional, direct text answer. No salutations or signatures.
        """
        response_text = generate_nlu_response(prompt_fallback)
        response_type = "text"
        payload = None
        
    return {
        "conversation_stage": "GREETING",
        "response_text": response_text,
        "response_type": response_type,
        "response_payload": payload,
        "response_actions": [],
        "response_agent_name": "Database Agent",
        "next_agent": END,
        "steps": steps
    }

# =====================================================================
# Booking sub-workflow agents (Part of Booking Agent)
# =====================================================================

def property_validation_agent_node(state: AgentState) -> Dict[str, Any]:
    print("[Property Validation Agent] Executing...")
    
    steps = state.get("steps", [])
    if "🤖 Booking Agent activated" not in steps:
        steps.append("🤖 Booking Agent activated")
    if "🔍 Verifying property availability" not in steps:
        steps.append("🔍 Verifying property availability")
        
    prop_ctx = state.get("property_context") or {}
    unit = str(prop_ctx.get("unit") or "").strip()
    project = str(prop_ctx.get("project") or "").strip()
    location = str(prop_ctx.get("location") or "").strip()
    bhk = str(prop_ctx.get("type") or "").strip()
    budget_str = str(prop_ctx.get("budget") or "").strip()
    
    has_any_criteria = any([unit, project, location, bhk, budget_str])
    
    if not has_any_criteria:
        steps.append("✅ Ready")
        response_text = "To start a booking, please provide the project name, unit number, or your preferred location, budget, and BHK."
        return {
            "conversation_stage": "PROPERTY_SELECTION",
            "response_text": response_text,
            "response_type": "text",
            "response_payload": None,
            "response_actions": [],
            "response_agent_name": "Booking Agent",
            "next_agent": END,
            "steps": steps
        }
        
    # Budget parsing helper
    budget_val = None
    if budget_str:
        digits = "".join(filter(str.isdigit, budget_str))
        if digits:
            val = float(digits)
            if "cr" in budget_str.lower():
                m = re.search(r"(\d+\.?\d*)", budget_str)
                if m:
                    val = float(m.group(1))
                    budget_val = int(val * 10000000)
            elif "lakh" in budget_str.lower() or "l" in budget_str.lower():
                m = re.search(r"(\d+\.?\d*)", budget_str)
                if m:
                    val = float(m.group(1))
                    budget_val = int(val * 100000)
            else:
                budget_val = int(val)

    # Filter all properties based on available search criteria
    all_props = get_properties()
    matched = []
    
    for prop in all_props:
        if unit and unit.lower().replace("-", "") not in prop["unit"].lower().replace("-", ""):
            continue
        if project and project.lower() not in prop["project"].lower():
            continue
        if location and location.lower() not in prop["city"].lower() and location.lower() not in prop["project"].lower():
            continue
        if bhk and prop["type"] != str(bhk):
            continue
        if budget_val and prop.get("price_val", 0) > budget_val:
            continue
            
        matched.append(prop)
        
    # Construct a natural language query summary for error/selection messages
    criteria_list = []
    if unit: criteria_list.append(f"unit '{unit}'")
    if project: criteria_list.append(f"project '{project}'")
    if location: criteria_list.append(f"location '{location}'")
    if bhk: criteria_list.append(f"config '{bhk} BHK'")
    if budget_str: criteria_list.append(f"budget '{budget_str}'")
    criteria_desc = " and ".join(criteria_list) if criteria_list else "your criteria"
    
    if not matched:
        steps.append("✅ Ready")
        response_text = f"We couldn't find any available properties matching {criteria_desc}. Here are some other available options from our inventory."
        return {
            "conversation_stage": "PROPERTY_SELECTION",
            "response_text": response_text,
            "response_type": "properties",
            "response_payload": [p for p in get_properties() if not is_property_reserved(p["unit"])],
            "response_actions": [],
            "response_agent_name": "Booking Agent",
            "next_agent": END,
            "steps": steps
        }
    elif len(matched) > 1:
        steps.append("✅ Ready")
        payload = [{**p, "reserved": is_property_reserved(p["unit"])} for p in matched]
        response_text = f"We found multiple available properties matching {criteria_desc}. Please select the exact unit you wish to book."
        return {
            "conversation_stage": "PROPERTY_SELECTION",
            "response_text": response_text,
            "response_type": "properties",
            "response_payload": payload,
            "response_actions": [],
            "response_agent_name": "Booking Agent",
            "next_agent": END,
            "steps": steps
        }
    else:
        prop = matched[0]
        if is_property_reserved(prop["unit"]):
            steps.append("✅ Ready")
            response_text = f"Unit '{prop['unit']}' is already booked or reserved. Please select another available property."
            return {
                "property_context": {},  # Clear the stuck context
                "conversation_stage": "PROPERTY_SELECTION",
                "response_text": response_text,
                "response_type": "properties",
                "response_payload": [p for p in get_properties() if not is_property_reserved(p["unit"])],
                "response_actions": [],
                "response_agent_name": "Booking Agent",
                "next_agent": END,
                "steps": steps
            }
            
        updated_prop_ctx = {"unit": prop["unit"], "project": prop["project"], "price": prop["price"]}
        return {
            "property_context": updated_prop_ctx,
            "conversation_stage": "CUSTOMER_INFORMATION",
            "next_agent": "missing_info_agent",
            "steps": steps
        }

def missing_info_agent_node(state: AgentState) -> Dict[str, Any]:
    print("[Missing Info Agent] Executing...")
    cust_ctx = state.get("customer_context") or {}
    book_ctx = state.get("booking_context") or {}
    
    missing_fields = []
    if not cust_ctx.get("name"): missing_fields.append("Customer Name")
    if not cust_ctx.get("phone"): missing_fields.append("Contact Phone")
    if not cust_ctx.get("email"): missing_fields.append("Customer Email")
    if not book_ctx.get("amount"): missing_fields.append("Booking Amount")
    
    if missing_fields:
        return {"conversation_stage": "CUSTOMER_INFORMATION", "next_agent": "customer_info_agent"}
    else:
        return {"conversation_stage": "BOOKING_REVIEW", "next_agent": "booking_review_agent"}

def customer_info_agent_node(state: AgentState) -> Dict[str, Any]:
    print("[Customer Information Agent] Executing...")
    steps = state.get("steps", [])
    if "👤 Verifying customer credentials" not in steps:
        steps.append("👤 Verifying customer credentials")
    steps.append("✅ Ready")
    
    cust_ctx = state.get("customer_context") or {}
    prop_ctx = state.get("property_context") or {}
    name = cust_ctx.get("name")
    phone = cust_ctx.get("phone")
    email = cust_ctx.get("email")
    
    if name and (not phone or not email):
        existing = find_customer_by_name(name)
        if existing:
            phone = phone or existing["phone"]
            email = email or existing["email"]
            cust_ctx = {"name": name, "phone": phone, "email": email}
            
    missing_fields = []
    if not cust_ctx.get("name"): missing_fields.append("Customer Name")
    if not cust_ctx.get("phone"): missing_fields.append("Mobile Number")
    
    if not missing_fields:
        return {
            "customer_context": cust_ctx,
            "conversation_stage": "BOOKING_REVIEW",
            "next_agent": "booking_review_agent",
            "steps": state.get("steps", [])
        }
        
    just_validated = prop_ctx.get('unit') and state.get("conversation_stage") != "CUSTOMER_INFORMATION"
    if just_validated:
        prop = find_property_by_unit(prop_ctx.get("unit"))
        payload = [{**prop, "selected": True, "reserved": False}] if prop else None
        resp_type = "properties_with_form"
    else:
        resp_type = "customer_form"
        payload = None
        
    response_text = f"Property '{prop_ctx.get('unit')}' in project '{prop_ctx.get('project')}' has been selected. Please provide the customer details (Name, Phone, Email) and Booking Token Amount to proceed."
    return {
        "customer_context": cust_ctx,
        "conversation_stage": "CUSTOMER_INFORMATION",
        "response_text": response_text,
        "response_type": resp_type,
        "response_payload": payload,
        "response_actions": [],
        "response_agent_name": "Booking Agent",
        "next_agent": END,
        "steps": steps
    }

def booking_review_agent_node(state: AgentState) -> Dict[str, Any]:
    print("[Booking Review Agent] Executing...")
    steps = state.get("steps", [])
    if "👤 Verifying customer credentials" not in steps:
        steps.append("👤 Verifying customer credentials")
    steps.append("✅ Ready")
    
    prop_ctx = state.get("property_context") or {}
    cust_ctx = state.get("customer_context") or {}
    book_ctx = state.get("booking_context") or {}
    
    payload = {
        "customer_name": cust_ctx.get("name"),
        "customerName": cust_ctx.get("name"),
        "property_unit": prop_ctx.get("unit"),
        "unit": prop_ctx.get("unit"),
        "project_name": prop_ctx.get("project"),
        "project": prop_ctx.get("project"),
        "price": prop_ctx.get("price"),
        "token_amount": book_ctx.get("amount") or "₹2,00,000",
        "amount": book_ctx.get("amount") or "₹2,00,000",
        "phone": cust_ctx.get("phone"),
        "email": cust_ctx.get("email"),
        "status": "Ready for Confirmation",
        "confirmed": False
    }
    
    response_text = f"Booking parameters for unit '{prop_ctx.get('unit')}' for customer '{cust_ctx.get('name')}' are ready. Please review the summary below and confirm."
    return {
        "conversation_stage": "BOOKING_CONFIRMATION",
        "response_text": response_text,
        "response_type": "booking_summary",
        "response_payload": payload,
        "response_actions": ["confirm_booking", "cancel_booking"],
        "response_agent_name": "Booking Agent",
        "next_agent": END,
        "steps": steps
    }

def booking_creation_agent_node(state: AgentState) -> Dict[str, Any]:
    print("[Booking Creation Agent] Executing...")
    steps = state.get("steps", [])
    if "🤖 Booking Agent activated" not in steps:
        steps.append("🤖 Booking Agent activated")
    if "👤 Verifying customer credentials" not in steps:
        steps.append("👤 Verifying customer credentials")
    steps.append("✅ Ready")
    
    action = state.get("action")
    current_msg = state.get("current_message", "").lower()
    
    cancel_phrases = ["cancel", "reset", "no thanks"]
    is_cancel = action in ["cancel_booking", "reset_booking"] or any(phrase in current_msg for phrase in cancel_phrases) or current_msg.strip() == "no"
    
    if is_cancel:
        response_text = "The booking process has been canceled. You can start a new search or booking anytime."
        return {
            "conversation_stage": "PROPERTY_SELECTION",
            "property_context": {},
            "customer_context": {},
            "booking_context": {},
            "response_text": response_text,
            "response_type": "text",
            "response_payload": None,
            "response_actions": ["search_property"],
            "response_agent_name": "Booking Agent",
            "next_agent": END,
            "steps": steps
        }
        
    prop_ctx = state.get("property_context") or {}
    cust_ctx = state.get("customer_context") or {}
    book_ctx = state.get("booking_context") or {}
    
    action_payload = state.get("action_payload") or {}
    if action == "confirm_booking" and action_payload:
        cust_ctx["name"] = action_payload.get("customer_name") or action_payload.get("customerName") or cust_ctx.get("name", "Unknown")
        book_ctx["amount"] = action_payload.get("token_amount") or action_payload.get("amount") or book_ctx.get("amount", "₹2,00,000")
        prop_ctx["unit"] = action_payload.get("unit") or action_payload.get("property_unit") or prop_ctx.get("unit", "Unknown")
        prop_ctx["project"] = action_payload.get("project") or action_payload.get("project_name") or prop_ctx.get("project", "Unknown")
    
    booking_id = f"BK-2026-{random.randint(100000, 999999)}"
    
    c_name = cust_ctx.get("name", "Unknown")
    c_email = cust_ctx.get("email") or f"{c_name.lower().replace(' ', '')}@example.com"
    c_phone = cust_ctx.get("phone", "N/A")
    
    add_customer({
        "name": c_name,
        "email": c_email,
        "phone": c_phone,
        "status": "Active",
        "assignedAgent": "Booking Agent",
        "dateAdded": datetime.now().strftime("%b %d, %Y")
    })
    
    add_booking({
        "id": booking_id,
        "customerName": c_name,
        "unit": prop_ctx.get("unit"),
        "amount": book_ctx.get("amount") or "₹2,00,000",
        "status": "Confirmed",
        "timestamp": datetime.now().strftime("%b %d, %Y")
    })
    
    payload = {
        "booking_id": booking_id,
        "id": booking_id,
        "customer_name": cust_ctx.get("name"),
        "customerName": cust_ctx.get("name"),
        "property_unit": prop_ctx.get("unit"),
        "unit": prop_ctx.get("unit"),
        "project_name": prop_ctx.get("project"),
        "project": prop_ctx.get("project"),
        "price": prop_ctx.get("price"),
        "token_amount": book_ctx.get("amount") or "₹2,00,000",
        "amount": book_ctx.get("amount") or "₹2,00,000",
        "status": "confirmed"
    }
    
    response_text = f"Booking '{booking_id}' for customer '{cust_ctx.get('name')}' on unit '{prop_ctx.get('unit')}' has been successfully confirmed."
    
    return {
        "conversation_stage": "BOOKING_COMPLETE",
        "booking_context": {"booking_id": booking_id, "status": "Confirmed", "amount": book_ctx.get("amount") or "₹2,00,000"},
        "response_text": response_text,
        "response_type": "booking_complete",
        "response_payload": payload,
        "response_actions": ["reset_booking"],
        "response_agent_name": "Booking Agent",
        "next_agent": END,
        "steps": steps
    }

# =====================================================================
# GRAPH WORKFLOW ORCHESTRATION
# =====================================================================

def route_agent(state: AgentState) -> str:
    next_node = state.get("next_agent", END)
    print(f"[Graph Router] Routing to: {next_node}")
    return next_node

workflow.set_entry_point("supervisor_node")

workflow.add_node("supervisor_node", supervisor_node)
workflow.add_node("greeting_agent", greeting_agent_node)
workflow.add_node("property_search_agent", property_search_agent_node)
workflow.add_node("customer_agent", customer_agent_node)
workflow.add_node("site_visit_agent", site_visit_agent_node)
workflow.add_node("follow_up_agent", follow_up_agent_node)
workflow.add_node("dashboard_agent", dashboard_agent_node)
workflow.add_node("database_qa_agent", database_qa_agent_node)
workflow.add_node("financial_agent", financial_agent_node)
workflow.add_node("project_information_agent", project_information_agent_node)
workflow.add_node("marketing_agent", marketing_agent_node)

workflow.add_node("property_validation_agent", property_validation_agent_node)
workflow.add_node("missing_info_agent", missing_info_agent_node)
workflow.add_node("customer_info_agent", customer_info_agent_node)
workflow.add_node("booking_review_agent", booking_review_agent_node)
workflow.add_node("booking_creation_agent", booking_creation_agent_node)

workflow.add_conditional_edges(
    "supervisor_node",
    route_agent,
    {
        "greeting_agent": "greeting_agent",
        "property_search_agent": "property_search_agent",
        "customer_agent": "customer_agent",
        "site_visit_agent": "site_visit_agent",
        "follow_up_agent": "follow_up_agent",
        "dashboard_agent": "dashboard_agent",
        "database_qa_agent": "database_qa_agent",
        "financial_agent": "financial_agent",
        "project_information_agent": "project_information_agent",
        "marketing_agent": "marketing_agent",
        "property_validation_agent": "property_validation_agent",
        "booking_creation_agent": "booking_creation_agent",
        END: END
    }
)

workflow.add_conditional_edges("property_validation_agent", route_agent, {"missing_info_agent": "missing_info_agent", END: END})
workflow.add_conditional_edges("missing_info_agent", route_agent, {"customer_info_agent": "customer_info_agent", "booking_review_agent": "booking_review_agent", END: END})
workflow.add_conditional_edges("customer_info_agent", route_agent, {"booking_review_agent": "booking_review_agent", END: END})

workflow.add_edge("greeting_agent", END)
workflow.add_edge("property_search_agent", END)
workflow.add_edge("customer_agent", END)
workflow.add_edge("site_visit_agent", END)
workflow.add_edge("follow_up_agent", END)
workflow.add_edge("dashboard_agent", END)
workflow.add_edge("database_qa_agent", END)
workflow.add_edge("financial_agent", END)
workflow.add_edge("project_information_agent", END)
workflow.add_edge("marketing_agent", END)
workflow.add_edge("booking_review_agent", END)
workflow.add_edge("booking_creation_agent", END)

booking_graph = workflow.compile()
