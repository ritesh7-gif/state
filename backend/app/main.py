from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import os

from .graph import booking_graph
from .database import get_properties, get_customers, get_bookings, get_site_visits, get_follow_ups, reset_db

app = FastAPI(title="Real Estate Booking AI Backend")

# Setup CORS
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL, "http://localhost:5173", "http://localhost:3000"],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str
    action: Optional[str] = None
    action_payload: Optional[Any] = None
    conversation_stage: Optional[str] = "GREETING"
    customer_context: Optional[Dict[str, Any]] = None
    property_context: Optional[Dict[str, Any]] = None
    booking_context: Optional[Dict[str, Any]] = None

@app.post("/api/chat")
async def chat_endpoint(req: ChatRequest):
    try:
        # Construct initial state for LangGraph
        initial_state = {
            "messages": [],
            "current_message": req.message,
            "conversation_stage": req.conversation_stage or "GREETING",
            "next_agent": "supervisor_node",
            "customer_context": req.customer_context or {},
            "property_context": req.property_context or {},
            "booking_context": req.booking_context or {},
            "action": req.action,
            "action_payload": req.action_payload,
            "response_text": "",
            "response_type": "text",
            "response_payload": None,
            "response_actions": [],
            "response_agent_name": "System",
            "steps": []
        }
        
        print(f"\n--- [API POST /api/chat] Input ---")
        print(f"Message: {req.message}")
        print(f"Action: {req.action}")
        print(f"Stage: {req.conversation_stage}")
        print(f"Property Context: {req.property_context}")
        print(f"Customer Context: {req.customer_context}")
        
        # Invoke LangGraph Workflow
        final_state = booking_graph.invoke(initial_state)
        
        print(f"--- [API POST /api/chat] Output ---")
        print(f"Stage: {final_state.get('conversation_stage')}")
        print(f"Agent Name: {final_state.get('response_agent_name')}")
        print(f"Response: {final_state.get('response_text')}")
        print(f"Type: {final_state.get('response_type')}")
        print(f"Actions: {final_state.get('response_actions')}")
        print(f"Steps: {final_state.get('steps')}")
        print(f"---------------------------------\n")
        
        # Return response including the current database states
        return {
            "response_text": final_state.get("response_text"),
            "response_type": final_state.get("response_type"),
            "response_payload": final_state.get("response_payload"),
            "response_actions": final_state.get("response_actions"),
            "response_agent_name": final_state.get("response_agent_name"),
            "conversation_stage": final_state.get("conversation_stage"),
            "customer_context": final_state.get("customer_context"),
            "property_context": final_state.get("property_context"),
            "booking_context": final_state.get("booking_context"),
            "steps": final_state.get("steps") or [],
            "properties": get_properties(),
            "customers": get_customers(),
            "bookings": get_bookings(),
            "site_visits": get_site_visits(),
            "follow_ups": get_follow_ups()
        }
        
    except Exception as e:
        import traceback
        print(f"\n--- [API POST /api/chat] ERROR ---")
        traceback.print_exc()
        print(f"----------------------------------\n")
        raise HTTPException(status_code=500, detail="An internal server error occurred.")

@app.get("/api/properties")
async def properties_endpoint():
    return get_properties()

@app.get("/api/customers")
async def customers_endpoint():
    return get_customers()

@app.get("/api/bookings")
async def bookings_endpoint():
    return get_bookings()

@app.get("/api/site_visits")
async def site_visits_endpoint():
    return get_site_visits()

@app.get("/api/follow_ups")
async def follow_ups_endpoint():
    return get_follow_ups()

@app.post("/api/reset")
async def reset_endpoint():
    reset_db()
    return {
        "properties": get_properties(),
        "customers": get_customers(),
        "bookings": get_bookings(),
        "site_visits": get_site_visits(),
        "follow_ups": get_follow_ups()
    }
