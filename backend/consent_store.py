import time
import uuid
from datetime import datetime, timezone, timedelta

_consents: dict[str, dict] = {}


def grant_consent(citizen_id: str, grantee: str, data_scope: list[str], duration_minutes: int) -> dict:
    consent_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc)
    expires_at = now + timedelta(minutes=duration_minutes)
    record = {
        "consent_id": consent_id,
        "citizen_id": citizen_id,
        "grantee": grantee,
        "data_scope": data_scope,
        "granted_at": now.isoformat(),
        "expires_at": expires_at.isoformat(),
        "revoked": False,
    }
    _consents[consent_id] = record
    return record


def check_consent(citizen_id: str, grantee: str, field: str) -> bool:
    now = datetime.now(timezone.utc)
    for record in _consents.values():
        if record["citizen_id"] != citizen_id:
            continue
        if record["grantee"] != grantee:
            continue
        if record["revoked"]:
            continue
        if field not in record["data_scope"]:
            continue
        expires_at = datetime.fromisoformat(record["expires_at"])
        if now < expires_at:
            return True
    return False


def revoke_consent(consent_id: str, citizen_id: str) -> bool:
    record = _consents.get(consent_id)
    if record is None:
        return False
    if record["citizen_id"] != citizen_id:
        return False
    record["revoked"] = True
    return True


def list_consents(citizen_id: str) -> list[dict]:
    return [r for r in _consents.values() if r["citizen_id"] == citizen_id]
