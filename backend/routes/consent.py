from fastapi import APIRouter, HTTPException
from services.supabase import supabase
from datetime import datetime
import uuid

router = APIRouter()


# ============================================================
# GRANT CONSENT
# ============================================================

@router.post("/grant")
def grant_consent(
    citizen_id: str,
    data_provider: str,
    data_type: str,
    purpose: str
):
    try:

        # ----------------------------------------------------
        # 1. Check citizen exists
        # ----------------------------------------------------

        citizen_response = (
            supabase
            .table("citizens")
            .select("citizen_id")
            .eq("citizen_id", citizen_id)
            .limit(1)
            .execute()
        )

        if not citizen_response.data:
            raise HTTPException(
                status_code=404,
                detail="Citizen not found"
            )

        # ----------------------------------------------------
        # 2. Check whether EXACT consent already exists
        # ----------------------------------------------------

        existing_response = (
            supabase
            .table("consents")
            .select("*")
            .eq("citizen_id", citizen_id)
            .eq("data_provider", data_provider)
            .eq("data_type", data_type)
            .eq("purpose", purpose)
            .limit(1)
            .execute()
        )

        now = datetime.now().isoformat()

        # ----------------------------------------------------
        # 3. Existing consent
        # ----------------------------------------------------

        if existing_response.data:

            existing = existing_response.data[0]

            update_data = {
                "status": "GRANTED"
            }

            # Only update granted_at if the column exists
            # in your table.
            if "granted_at" in existing:
                update_data["granted_at"] = now

            response = (
                supabase
                .table("consents")
                .update(update_data)
                .eq(
                    "consent_id",
                    existing["consent_id"]
                )
                .execute()
            )

            return {
                "success": True,
                "message": "Consent granted successfully",
                "already_existed": True,
                "consent": (
                    response.data[0]
                    if response.data
                    else existing
                )
            }

        # ----------------------------------------------------
        # 4. Create new consent
        # ----------------------------------------------------

        consent_id = (
            f"CON-{uuid.uuid4().hex[:10].upper()}"
        )

        consent_data = {
            "consent_id": consent_id,
            "citizen_id": citizen_id,
            "data_provider": data_provider,
            "data_type": data_type,
            "purpose": purpose,
            "status": "GRANTED"
        }

        # Add granted_at only if your table has the column.
        consent_data["granted_at"] = now

        # NULL expiry means no expiry.
        # Only add this if expires_at exists in your table.
        consent_data["expires_at"] = None

        response = (
            supabase
            .table("consents")
            .insert(consent_data)
            .execute()
        )

        return {
            "success": True,
            "message": "Consent granted successfully",
            "already_existed": False,
            "consent": (
                response.data[0]
                if response.data
                else None
            )
        }

    except HTTPException:
        raise

    except Exception as error:

        print(
            "CONSENT GRANT ERROR:",
            repr(error)
        )

        raise HTTPException(
            status_code=500,
            detail=f"Unable to grant consent: {str(error)}"
        )


# ============================================================
# CHECK CONSENT
# ============================================================

@router.get("/check")
def check_consent_api(
    citizen_id: str,
    data_provider: str,
    data_type: str,
    purpose: str
):

    try:

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

    except Exception as error:

        print(
            "CONSENT CHECK ERROR:",
            repr(error)
        )

        raise HTTPException(
            status_code=500,
            detail=f"Unable to check consent: {str(error)}"
        )