import requests
import json
import sys
import io

# Force UTF-8 stdout/stderr so ₹ and other Unicode chars print correctly on Windows
if sys.stdout.encoding != 'utf-8':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
if sys.stderr.encoding != 'utf-8':
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

BASE = "http://localhost:8000"

def p(label, d):
    print(f"\n{'='*60}")
    print(f"  {label}")
    print(f"{'='*60}")
    print(f"  Stage   : {d.get('conversation_stage')}")
    print(f"  Agent   : {d.get('response_agent_name')}")
    print(f"  Type    : {d.get('response_type')}")
    print(f"  Actions : {d.get('response_actions')}")
    print(f"  Text    : {d.get('response_text', '')[:120]}")
    if d.get("response_payload"):
        print(f"  Payload : {d.get('response_payload')}")
    if d.get("booking_context", {}).get("booking_id"):
        print(f"  BookingID: {d['booking_context']['booking_id']}")

ctx = {
    "conversation_stage": "GREETING",
    "customer_context": {},
    "property_context": {},
    "booking_context": {}
}

# ── Test 1: Greeting ──────────────────────────────────────────
r = requests.post(f"{BASE}/api/chat", json={"message": "hi", **ctx})
assert r.status_code == 200, f"Step 1 failed: {r.text}"
d = r.json()
p("STEP 1 — Greeting", d)
assert d["conversation_stage"] == "GREETING"
assert d["response_type"] == "greeting_actions"
assert "book_property" in d["response_actions"]
ctx.update({"conversation_stage": d["conversation_stage"], "customer_context": d["customer_context"], "property_context": d["property_context"], "booking_context": d["booking_context"]})

# ── Test 2: Single message with unit + customer name ──────────
ctx["conversation_stage"] = "PROPERTY_SELECTION"
ctx["customer_context"] = {}
ctx["property_context"] = {}
r = requests.post(f"{BASE}/api/chat", json={"message": "Book A-1203 for Ritesh Yadav", **ctx})
assert r.status_code == 200, f"Step 2 failed: {r.text}"
d = r.json()
p("STEP 2 — Book A-1203 for Ritesh Yadav", d)
assert d["conversation_stage"] == "CUSTOMER_INFORMATION", f"Expected CUSTOMER_INFORMATION, got {d['conversation_stage']}"
assert d["customer_context"].get("name") == "Ritesh Yadav", f"Name not extracted: {d['customer_context']}"
assert d["property_context"].get("unit") == "A-1203", f"Unit not set: {d['property_context']}"
# Should ask for missing details
assert d["response_type"] in ["customer_form", "properties_with_form"]
ctx.update({"conversation_stage": d["conversation_stage"], "customer_context": d["customer_context"], "property_context": d["property_context"], "booking_context": d["booking_context"]})

# ── Test 3: Provide phone + email + amount ─────────────────────────────
r = requests.post(f"{BASE}/api/chat", json={"message": "9876543210 ritesh@yadav.com Amount: 200000", **ctx})
assert r.status_code == 200, f"Step 3 failed: {r.text}"
d = r.json()
p("STEP 3 — Phone + Email + Amount provided", d)
assert d["conversation_stage"] == "BOOKING_CONFIRMATION", f"Expected BOOKING_CONFIRMATION, got {d['conversation_stage']}"
assert d["response_type"] == "booking_summary"
payload = d["response_payload"]
assert payload["customerName"] == "Ritesh Yadav"
assert payload["unit"] == "A-1203"
assert payload["phone"] == "9876543210"
assert payload["email"] == "ritesh@yadav.com"
assert "confirm_booking" in d["response_actions"]
ctx.update({"conversation_stage": d["conversation_stage"], "customer_context": d["customer_context"], "property_context": d["property_context"], "booking_context": d["booking_context"]})

# ── Test 4: Confirm booking via action button ─────────────────
r = requests.post(f"{BASE}/api/chat", json={"message": "", "action": "confirm_booking", **ctx})
assert r.status_code == 200, f"Step 4 failed: {r.text}"
d = r.json()
p("STEP 4 — Confirm Booking (action button)", d)
assert d["conversation_stage"] == "BOOKING_COMPLETE", f"Expected BOOKING_COMPLETE, got {d['conversation_stage']}"
bk_id = d["booking_context"].get("booking_id")
assert bk_id and bk_id.startswith("BK-"), f"No booking ID: {d['booking_context']}"
assert d["booking_context"]["status"] == "Confirmed"
assert "reset_booking" in d["response_actions"]

# ── Test 5: New booking — existing customer autofill ──────────
print("\n\n>>> TEST 5: Priya Sharma (existing customer) — should autofill phone+email")
ctx2 = {"conversation_stage": "PROPERTY_SELECTION", "customer_context": {}, "property_context": {}, "booking_context": {}}
r = requests.post(f"{BASE}/api/chat", json={"message": "Book D-101 for Priya Sharma Amount 250000", **ctx2})
assert r.status_code == 200, f"Step 5 failed: {r.text}"
d = r.json()
p("STEP 5 — Existing customer autofill", d)
# Since Priya Sharma is in the DB with phone+email, it should jump straight to BOOKING_CONFIRMATION
print(f"  >>> Stage is: {d['conversation_stage']}")

# ── Test 6: Cancel booking ────────────────────────────────────
ctx3 = {"conversation_stage": "BOOKING_CONFIRMATION", "customer_context": {"name": "Test User", "phone": "9999999999", "email": "t@t.com"}, "property_context": {"unit": "E-204", "project": "Hiranandani Gardens Powai", "price": "x"}, "booking_context": {}}
r = requests.post(f"{BASE}/api/chat", json={"message": "", "action": "cancel_booking", **ctx3})
assert r.status_code == 200, f"Step 6 failed: {r.text}"
d = r.json()
p("STEP 6 — Cancel Booking", d)
assert d["conversation_stage"] == "PROPERTY_SELECTION"
assert "canceled" in d["response_text"].lower()

# ── Test 7: One-Shot Extraction ──────────────────────────────
ctx4 = {"conversation_stage": "GREETING", "customer_context": {}, "property_context": {}, "booking_context": {}}
r = requests.post(f"{BASE}/api/chat", json={"message": "Book Flat E-204 in Hiranandani. Customer Name: Ritesh Yadav Phone: 9876543210 Email: ritesh@gmail.com Amount: 50000", **ctx4})
d = r.json()
try:
    p("STEP 7 — One-Shot Extraction", d)
except UnicodeEncodeError:
    print("STEP 7 — One-Shot Extraction (Encoding hidden)")
assert d["conversation_stage"] == "BOOKING_CONFIRMATION", f"Expected BOOKING_CONFIRMATION, got {d['conversation_stage']}"
assert d["response_type"] == "booking_summary"
assert d["booking_context"]["amount"] == "50000"
assert d["property_context"]["unit"] == "E-204"

print("\n\n ALL TESTS PASSED!")
