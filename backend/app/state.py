from typing import List, Dict, Any, Optional
from typing_extensions import TypedDict

class AgentState(TypedDict):
    # Chat history
    messages: List[Dict[str, Any]]
    
    # Current input message
    current_message: str
    
    # Frontend action override (e.g. 'confirm_booking', 'cancel_booking', 'select_property')
    action: Optional[str]
    action_payload: Optional[Any]
    
    # Workflow control
    conversation_stage: str  # GREETING | PROPERTY_SELECTION | CUSTOMER_INFORMATION | BOOKING_REVIEW | BOOKING_CONFIRMATION | BOOKING_COMPLETE | PROPERTY_SEARCH | CUSTOMER_SEARCH | SITE_VISIT | FOLLOW_UP | DASHBOARD
    next_agent: str          # Name of node to execute next
    
    # Context accumulated
    customer_context: Dict[str, Any]  # name, phone, email
    property_context: Dict[str, Any]  # unit, project, price, location, type
    booking_context: Dict[str, Any]   # status, amount, booking_id
    site_visit_context: Dict[str, Any] # date, time, project, status
    follow_up_context: Dict[str, Any]  # notes, status
    
    # Response fields for the current turn
    response_text: str
    response_type: str                # text | properties | booking_summary | greeting_actions | dashboard_stats | customers | site_visits | follow_ups
    response_payload: Optional[Any]
    response_actions: List[str]       # select_property | confirm_booking | edit_booking | cancel_booking | reset_booking | etc
    response_agent_name: str
    steps: List[str]

