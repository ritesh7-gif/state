import sys

file_path = r"c:\Users\MY LAPPY HOUSE\Downloads\agnet\backend\app\graph.py"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add marketing regex intent
old_regex = """        elif "amenities" in msg_lower or "builder" in msg_lower or "project details" in msg_lower or "project info" in msg_lower or "tell me about the project" in msg_lower:
            intent = "project_information"

    # Call LLM only if intent is still unknown"""

new_regex = """        elif "amenities" in msg_lower or "builder" in msg_lower or "project details" in msg_lower or "project info" in msg_lower or "tell me about the project" in msg_lower:
            intent = "project_information"

    if not intent:
        if "marketing" in msg_lower or "social media" in msg_lower or "campaign" in msg_lower or "seo" in msg_lower or "hashtag" in msg_lower or "brochure" in msg_lower or "advertisement" in msg_lower or "caption" in msg_lower or "description" in msg_lower or "whatsapp" in msg_lower or "email" in msg_lower:
            intent = "marketing"

    # Call LLM only if intent is still unknown"""

content = content.replace(old_regex, new_regex)

# 2. Update stage continuation logic
old_stage1 = """    if stage in ["CUSTOMER_INFORMATION", "PROPERTY_SELECTION"] and intent not in ["cancel", "confirm", "dashboard", "site_visit", "follow_up", "database_qa", "search_property", "greeting", "financial", "project_information"]:"""
new_stage1 = """    if stage in ["CUSTOMER_INFORMATION", "PROPERTY_SELECTION"] and intent not in ["cancel", "confirm", "dashboard", "site_visit", "follow_up", "database_qa", "search_property", "greeting", "financial", "project_information", "marketing"]:"""

old_stage2 = """    elif stage == "SITE_VISIT" and intent not in ["cancel", "confirm", "dashboard", "site_visit", "follow_up", "greeting", "database_qa", "search_property", "financial", "project_information"]:"""
new_stage2 = """    elif stage == "SITE_VISIT" and intent not in ["cancel", "confirm", "dashboard", "site_visit", "follow_up", "greeting", "database_qa", "search_property", "financial", "project_information", "marketing"]:"""

content = content.replace(old_stage1, new_stage1)
content = content.replace(old_stage2, new_stage2)

# 3. Add routing logic for marketing
old_routing = """    elif intent == "project_information":
        return {
            "conversation_stage": "PROJECT_INFORMATION",
            "next_agent": "project_information_agent",
            "steps": steps
        }
        
    # Default is booking"""

new_routing = """    elif intent == "project_information":
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
        
    # Default is booking"""

content = content.replace(old_routing, new_routing)


# 4. Add the marketing agent node
old_node_def = """# =====================================================================
# SPECIALIZED AGENTS
# =====================================================================

def financial_agent_node"""

new_node_def = """# =====================================================================
# SPECIALIZED AGENTS
# =====================================================================

def marketing_agent_node(state: AgentState) -> Dict[str, Any]:
    print("[Marketing Agent] Executing...")
    steps = state.get("steps", [])
    steps.extend(["🤖 Marketing Agent activated", "📝 Generating marketing content", "✅ Ready"])
    
    current_msg = state.get("current_message", "")
    prop_ctx = state.get("property_context") or {}
    
    all_props = get_properties()
    
    db_context = f"All Properties/Projects Data: {all_props}\\nCurrently Discussed Property: {prop_ctx.get('unit', 'None')} | Project: {prop_ctx.get('project', 'None')}"
    
    prompt = f"You are an expert Real Estate Marketing Agent.\\nThe user asked for marketing content: '{current_msg}'\\nContext: {db_context}\\nGenerate high-quality, engaging, and professional marketing content (such as property descriptions, social media captions, ad copy, email campaigns, WhatsApp messages, SEO listings, or hashtags) based on the user's request and provided context. Use markdown bolding, emojis, and bullet points to make it look premium. Do not include salutations."
    
    response_text = generate_nlu_response(prompt)
    
    return {
        "conversation_stage": "MARKETING",
        "response_text": response_text,
        "response_type": "text",
        "response_payload": None,
        "response_actions": [],
        "response_agent_name": "Marketing Agent",
        "next_agent": END,
        "steps": steps
    }

def financial_agent_node"""

content = content.replace(old_node_def, new_node_def)

# 5. Add node to workflow
old_add_node = """workflow.add_node("project_information_agent", project_information_agent_node)

workflow.add_node("property_validation_agent"""

new_add_node = """workflow.add_node("project_information_agent", project_information_agent_node)
workflow.add_node("marketing_agent", marketing_agent_node)

workflow.add_node("property_validation_agent"""

content = content.replace(old_add_node, new_add_node)

# 6. Add to conditional edges
old_edges = """        "financial_agent": "financial_agent",
        "project_information_agent": "project_information_agent",
        "property_validation_agent": "property_validation_agent","""

new_edges = """        "financial_agent": "financial_agent",
        "project_information_agent": "project_information_agent",
        "marketing_agent": "marketing_agent",
        "property_validation_agent": "property_validation_agent","""

content = content.replace(old_edges, new_edges)

# 7. Add direct edge
old_final_edge = """workflow.add_edge("project_information_agent", END)
workflow.add_edge("booking_review_agent", END)"""

new_final_edge = """workflow.add_edge("project_information_agent", END)
workflow.add_edge("marketing_agent", END)
workflow.add_edge("booking_review_agent", END)"""

content = content.replace(old_final_edge, new_final_edge)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Patch applied to graph.py successfully!")
