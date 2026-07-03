import copy
from typing import List, Dict, Any, Optional
from datetime import datetime

INITIAL_PROPERTIES = [
    { "unit": "A-1203", "type": "2", "city": "Pune", "project": "Blue Ridge Hinjewadi", "price": "₹75,00,000", "price_val": 7500000, "builder": "Paranjape Schemes", "area": "1100 sqft", "amenities": ["Gym", "Pool", "Parking", "Security"] },
    { "unit": "B-804", "type": "3", "city": "Pune", "project": "Amanora Park Town", "price": "₹1,20,00,000", "price_val": 12000000, "builder": "Amanora Group", "area": "1600 sqft", "amenities": ["Gym", "Pool", "Clubhouse", "Golf Course", "Security"] },
    { "unit": "C-502", "type": "1", "city": "Pune", "project": "Godrej Infinity Keshavnagar", "price": "₹45,00,000", "price_val": 4500000, "builder": "Godrej Properties", "area": "750 sqft", "amenities": ["Pool", "Gym", "Security"] },
    { "unit": "D-101", "type": "2", "city": "Mumbai", "project": "Lodha Crown Majiwada", "price": "₹95,00,000", "price_val": 9500000, "builder": "Lodha Group", "area": "900 sqft", "amenities": ["Gym", "Security", "Clubhouse"] },
    { "unit": "E-204", "type": "3", "city": "Mumbai", "project": "Hiranandani Gardens Powai", "price": "₹2,40,00,000", "price_val": 24000000, "builder": "Hiranandani Group", "area": "2100 sqft", "amenities": ["Gym", "Pool", "Clubhouse", "Tennis Court", "Parking", "Security"] },
    { "unit": "B-805", "type": "2", "city": "Pune", "project": "Fake Hinjewadi Project", "price": "₹60,00,000", "price_val": 6000000, "builder": "Fake Builder", "area": "1000 sqft", "amenities": ["Parking", "Security"] }
]

INITIAL_CUSTOMERS = [
    { "name": "Priya Sharma", "email": "priya.sharma@example.com", "phone": "9823456789", "status": "Active", "assignedAgent": "Booking Agent", "dateAdded": "Jun 18, 2026" },
    { "name": "Amit Patel", "email": "amit.patel@example.com", "phone": "9123456780", "status": "Contacted", "assignedAgent": "Lead Agent", "dateAdded": "Jun 19, 2026" },
    { "name": "Sanjay Mehta", "email": "sanjay.mehta@example.com", "phone": "9567890123", "status": "Active", "assignedAgent": "Booking Agent", "dateAdded": "Jun 20, 2026" },
    { "name": "Ritesh Yadav", "email": "ritesh.yadav@example.com", "phone": "9876543210", "status": "Active", "assignedAgent": "Rahul Mehta", "dateAdded": "Jun 21, 2026" }
]

INITIAL_BOOKINGS = [
    { "id": "BK-7892", "customerName": "Priya Sharma", "unit": "B-804", "amount": "₹5,00,000", "status": "Confirmed", "timestamp": "Jun 19, 2026" },
    { "id": "BK-5612", "customerName": "Sanjay Mehta", "unit": "C-502", "amount": "₹3,00,000", "status": "Pending", "timestamp": "Jun 21, 2026" }
]

INITIAL_SITE_VISITS = [
    { "id": "SV-101", "customerName": "Amit Patel", "project": "Godrej Infinity Keshavnagar", "date": "Jun 27, 2026", "time": "10:00 AM", "executive": "Rahul Mehta", "status": "Scheduled" },
    { "id": "SV-102", "customerName": "Ritesh Yadav", "project": "Blue Ridge Hinjewadi", "date": "Jun 28, 2026", "time": "02:00 PM", "executive": "Rahul Mehta", "status": "Scheduled" }
]

INITIAL_FOLLOW_UPS = [
    { "id": "FU-201", "customerName": "Amit Patel", "notes": "Interested in 1 BHK, call back to confirm budget.", "status": "Pending", "dueDate": "Jun 26, 2026" },
    { "id": "FU-202", "customerName": "Ritesh Yadav", "notes": "Wants to see 2 BHK options in Hinjewadi.", "status": "Pending", "dueDate": "Jun 26, 2026" }
]


# In-memory storage copies
_properties = copy.deepcopy(INITIAL_PROPERTIES)
_customers = copy.deepcopy(INITIAL_CUSTOMERS)
_bookings = copy.deepcopy(INITIAL_BOOKINGS)
_site_visits = copy.deepcopy(INITIAL_SITE_VISITS)
_follow_ups = copy.deepcopy(INITIAL_FOLLOW_UPS)

def get_properties() -> List[Dict[str, Any]]: return _properties
def get_customers() -> List[Dict[str, Any]]: return _customers
def get_bookings() -> List[Dict[str, Any]]: return _bookings
def get_site_visits() -> List[Dict[str, Any]]: return _site_visits
def get_follow_ups() -> List[Dict[str, Any]]: return _follow_ups

def find_property_by_unit(unit: str) -> Optional[Dict[str, Any]]:
    unit_clean = unit.upper().replace("-", "").strip()
    for prop in _properties:
        p_unit_clean = prop["unit"].upper().replace("-", "").strip()
        if unit_clean == p_unit_clean:
            return prop
    return None

def search_properties(query: str, bhk: str = None) -> List[Dict[str, Any]]:
    query_lower = query.lower().strip() if query else ""
    matches = []
    
    for prop in _properties:
        # Check Unit exactly
        p_unit_clean = prop["unit"].lower().replace("-", "")
        q_clean = query_lower.replace("-", "")
        
        # Simple match condition
        match_text = (q_clean == p_unit_clean) or (query_lower in prop["unit"].lower()) or \
                     (query_lower in prop["project"].lower()) or (query_lower in prop["city"].lower())
                     
        if not query_lower:
            match_text = True
            
        if match_text:
            if bhk and prop["type"] != str(bhk):
                continue
            matches.append(prop)
            
    return matches

def find_customer_by_name(name: str) -> Optional[Dict[str, Any]]:
    if not name: return None
    name_lower = name.lower().strip()
    for cust in _customers:
        if name_lower in cust["name"].lower():
            return cust
    return None

def find_customer_by_phone(phone: str) -> Optional[Dict[str, Any]]:
    if not phone: return None
    phone_clean = "".join(filter(str.isdigit, phone))
    for cust in _customers:
        cust_phone_clean = "".join(filter(str.isdigit, cust["phone"]))
        if phone_clean and cust_phone_clean and phone_clean in cust_phone_clean:
            return cust
    return None

def is_property_reserved(unit: str) -> bool:
    for booking in _bookings:
        if booking["unit"].upper() == unit.upper() and booking["status"] == "Confirmed":
            return True
    return False

def add_booking(booking: Dict[str, Any]):
    _bookings.insert(0, booking)

def add_customer(customer: Dict[str, Any]):
    existing = find_customer_by_name(customer["name"])
    if not existing:
        _customers.insert(0, customer)
    else:
        if customer.get("phone"): existing["phone"] = customer["phone"]
        if customer.get("email"): existing["email"] = customer["email"]

def add_site_visit(visit: Dict[str, Any]):
    _site_visits.insert(0, visit)

def update_site_visit(visit_id: str, updates: Dict[str, Any]):
    for v in _site_visits:
        if v["id"] == visit_id:
            v.update(updates)
            return v
    return None

def update_follow_up(follow_up_id: str, updates: Dict[str, Any]):
    for f in _follow_ups:
        if f["id"] == follow_up_id:
            f.update(updates)
            return f
    return None

def get_dashboard_stats() -> Dict[str, Any]:
    today_str = datetime.now().strftime("%b %d, %Y")
    today_bookings = len([b for b in _bookings if b["timestamp"] == today_str])
    pending_bookings = len([b for b in _bookings if b["status"] == "Pending"])
    total_visits = len(_site_visits)
    total_revenue = sum([int(b["amount"].replace("₹", "").replace(",", "")) for b in _bookings if b["status"] == "Confirmed"])
    
    return {
        "today_bookings": today_bookings,
        "pending_bookings": pending_bookings,
        "total_visits": total_visits,
        "total_revenue": f"₹{total_revenue:,}"
    }

def reset_db():
    global _properties, _customers, _bookings, _site_visits, _follow_ups
    _properties = copy.deepcopy(INITIAL_PROPERTIES)
    _customers = copy.deepcopy(INITIAL_CUSTOMERS)
    _bookings = copy.deepcopy(INITIAL_BOOKINGS)
    _site_visits = copy.deepcopy(INITIAL_SITE_VISITS)
    _follow_ups = copy.deepcopy(INITIAL_FOLLOW_UPS)
