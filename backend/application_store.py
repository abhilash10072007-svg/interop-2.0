import uuid
from datetime import datetime, timezone

from workflow_rules import evaluate_eligibility
from otp_store import get_citizen_profile_by_id

_applications: dict[str, dict] = {}


def apply_for_scheme(citizen_id: str, scheme_name: str) -> dict:
    profile = get_citizen_profile_by_id(citizen_id)
    if profile is None:
        return {
            "success": False,
            "message": "Citizen profile not found.",
        }

    is_eligible, reason = evaluate_eligibility(scheme_name, profile)
    status = "approved" if is_eligible else "rejected"

    application_id = str(uuid.uuid4())
    record = {
        "application_id": application_id,
        "citizen_id": citizen_id,
        "scheme_name": scheme_name,
        "status": status,
        "reason": reason,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    _applications[application_id] = record

    return {
        "success": True,
        "message": f"Application {status}.",
        "application_id": application_id,
        "status": status,
    }


def list_applications_for_citizen(citizen_id: str) -> list[dict]:
    return [a for a in _applications.values() if a["citizen_id"] == citizen_id]


def get_application(application_id: str) -> dict | None:
    return _applications.get(application_id)
