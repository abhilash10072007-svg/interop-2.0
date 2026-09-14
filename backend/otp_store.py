import json
import time
import random
from pathlib import Path

DATA_FILE = Path(__file__).parent / "data"
CITIZENS_PATH = DATA_FILE / "synthetic_citizens.json"
LOOKUP_PATH = DATA_FILE / "aadhaar_lookup.json"

with open(CITIZENS_PATH, "r") as f:
    _citizens_list_ = json.load(f)

with open(LOOKUP_PATH, "r") as f:
    _aadhaar_list_ = json.load(f)

_citizens_id_ = {citizen["citizen_id"]: citizen for citizen in _citizens_list_}
_otp_store: dict[str, dict] = {}

OTP_VALID_DURATION = 5 * 60

_otp_request_log: dict[str, list[float]] = {}

MAX_OTP_REQUESTS = 3
RATE_LIMIT_WINDOW_SECONDS = 10 * 60  # 10 minutes


def is_rate_limited(aadhaar_lookup: str) -> bool:
    now = time.time()
    timestamps = _otp_request_log.get(aadhaar_lookup, [])
    timestamps = [ts for ts in timestamps if now - ts < RATE_LIMIT_WINDOW_SECONDS]

    if len(timestamps) >= MAX_OTP_REQUESTS:
        _otp_request_log[aadhaar_lookup] = timestamps
        return True

    timestamps.append(now)
    _otp_request_log[aadhaar_lookup] = timestamps
    return False


def generate_otp(aadhaar_lookup: str):
    otp = f"{random.randint(0, 999999):06d}"
    _otp_store[aadhaar_lookup] = {
        "otp": otp,
        "expires_at": time.time() + OTP_VALID_DURATION,
    }
    return otp


def valid_otp(aadhaar_lookup: str, otp: str) -> bool:
    entry = _otp_store.get(aadhaar_lookup)
    if entry is None:
        return False
    is_valid = (entry["otp"] == otp) and (time.time() < entry["expires_at"])
    del _otp_store[aadhaar_lookup]
    return is_valid


def get_citizen_profile(aadhaar_lookup: str) -> dict | None:
    citizen_id = _aadhaar_list_.get(aadhaar_lookup)
    if citizen_id is None:
        return None
    return _citizens_id_.get(citizen_id)


def get_citizen_profile_by_id(citizen_id: str) -> dict | None:
    return _citizens_id_.get(citizen_id)


def _persist_to_disk():
    with open(CITIZENS_PATH, "w") as f:
        json.dump(list(_citizens_id_.values()), f, indent=2)
    with open(LOOKUP_PATH, "w") as f:
        json.dump(_aadhaar_list_, f, indent=2)


def create_citizen_profile(aadhaar_lookup: str, data: dict) -> dict:
    new_id = f"CIT{len(_citizens_id_) + 1:05d}"
    profile = {
        "citizen_id": new_id,
        "aadhaar_number": data["aadhaar_number"],
        "aadhaar_masked": f"XXXX XXXX {aadhaar_lookup[-4:]}",
        "name": data["name"],
        "dob": data["dob"],
        "phone": data["phone"],
        "email": data["email"],
        "address": {
            "line1": data["address_line1"],
            "district": data["district"],
            "state": data["state"],
            "pincode": data["pincode"],
        },
        "photo_url": f"https://api.dicebear.com/7.x/avataaars/svg?seed={aadhaar_lookup}",
        "linked_schemes": [],
        "kyc_verified": True,
    }
    _citizens_id_[new_id] = profile
    _aadhaar_list_[aadhaar_lookup] = new_id
    _persist_to_disk()
    return profile
