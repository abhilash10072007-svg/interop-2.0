"""
Generates a synthetic citizen dataset for the GovConnect demo.
No real Aadhaar numbers or real people — all fictional, clearly demo-only.

Aadhaar numbers are generated in a reserved fictional range (starting with '9999')
so they can never collide with or resemble a real Aadhaar number pattern.
"""
import json
import random
from faker import Faker

fake = Faker("en_IN")
random.seed(42)

STATES = [
    ("Tamil Nadu", "Coimbatore"), ("Tamil Nadu", "Chennai"), ("Tamil Nadu", "Madurai"),
    ("Kerala", "Kochi"), ("Karnataka", "Bengaluru"), ("Maharashtra", "Pune"),
    ("Delhi", "New Delhi"), ("West Bengal", "Kolkata"), ("Telangana", "Hyderabad"),
]

GENDERS = ["Male", "Female"]

WELFARE_SCHEMES = ["PM-KISAN", "Ayushman Bharat", "PMAY", "MGNREGA", "Ration Card (NFSA)"]

def gen_fake_aadhaar(i):
    return f"9999 {1000 + i:04d} {random.randint(1000,9999)}"

def gen_profile(i):
    gender = random.choice(GENDERS)
    name = fake.name_male() if gender == "Male" else fake.name_female()
    state, district = random.choice(STATES)
    dob = fake.date_of_birth(minimum_age=18, maximum_age=75)
    aadhaar = gen_fake_aadhaar(i)
    return {
        "citizen_id": f"CIT{i:05d}",
        "aadhaar_number": aadhaar,
        "aadhaar_masked": f"XXXX XXXX {aadhaar[-4:]}",
        "name": name,
        "gender": gender,
        "dob": dob.isoformat(),
        "phone": "+91" + fake.msisdn()[3:13],
        "email": fake.email(),
        "address": {
            "line1": fake.street_address(),
            "district": district,
            "state": state,
            "pincode": fake.postcode(),
        },
        "photo_url": f"https://api.dicebear.com/7.x/avataaars/svg?seed={aadhaar.replace(' ','')}",
        "linked_schemes": random.sample(WELFARE_SCHEMES, k=random.randint(0, 3)),
        "kyc_verified": True,
    }

N = 40
profiles = [gen_profile(i) for i in range(1, N + 1)]

with open("data/synthetic_citizens.json", "w") as f:
    json.dump(profiles, f, indent=2)

lookup = {p["aadhaar_number"].replace(" ", ""): p["citizen_id"] for p in profiles}
with open("data/aadhaar_lookup.json", "w") as f:
    json.dump(lookup, f, indent=2)

print(f"Generated {N} synthetic citizen profiles.")
print("Sample Aadhaar numbers to use in the demo:")
for p in profiles[:5]:
    print(f"  {p['aadhaar_number']}  ->  {p['name']}")
