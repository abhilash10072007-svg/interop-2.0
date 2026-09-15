
from fastapi import APIRouter
from services.supabase import supabase

router = APIRouter()


@router.post("/grant")
def grant_consent(
    citizen_id: str,
    data_provider: str,
    data_type: str,
    purpose: str
):
    consent = {
        "consent_id": f"CON-{citizen_id}-{data_provider}",
        "citizen_id": citizen_id,
        "data_provider": data_provider,
        "data_type": data_type,
        "purpose": purpose,
        "status": "GRANTED",
        "granted_at": "2026-09-15",
        "expires_at": "2026-12-15"
    }

    response = (
        supabase
        .table("consents")
        .insert(consent)
        .execute()
    )

    return {
        "message": "Consent granted successfully",
        "consent": response.data
    }


@router.get("/check")
def check_consent_api(
    citizen_id: str,
    data_provider: str,
    data_type: str,
    purpose: str
):
    from services.interoperability import check_consent

    allowed = check_consent(
        citizen_id,
        data_provider,
        data_type,
        purpose
    )

    return {
        "citizen_id": citizen_id,
        "data_provider": data_provider,
        "data_type": data_type,
        "purpose": purpose,
        "consent_granted": allowed
    }