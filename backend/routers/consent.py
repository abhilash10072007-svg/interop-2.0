from fastapi import APIRouter, Depends, HTTPException

from models import ConsentRequest, ConsentResponse, RevokeResponse
from consent_store import grant_consent, revoke_consent, list_consents
from auth_utils import get_current_citizen

router = APIRouter(prefix="/consent", tags=["consent"])


@router.post("/grant", response_model=ConsentResponse)
def grant(request: ConsentRequest, citizen_id: str = Depends(get_current_citizen)):
    record = grant_consent(
        citizen_id,
        request.grantee,
        request.data_scope,
        request.duration_minutes,
    )
    return ConsentResponse(
        success=True,
        message=f"Consent granted to {request.grantee}.",
        consent_id=record["consent_id"],
        expires_at=record["expires_at"],
    )


@router.post("/revoke/{consent_id}", response_model=RevokeResponse)
def revoke(consent_id: str, citizen_id: str = Depends(get_current_citizen)):
    ok = revoke_consent(consent_id, citizen_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Consent record not found.")
    return RevokeResponse(success=True, message="Consent revoked.")


@router.get("/my")
def my_consents(citizen_id: str = Depends(get_current_citizen)):
    return list_consents(citizen_id)