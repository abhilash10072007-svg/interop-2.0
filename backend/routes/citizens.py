from fastapi import APIRouter

from services.supabase import supabase

from services.interoperability import (
    get_unified_citizen,
    get_scholarship_data,
    check_eligibility,
    get_citizen_dashboard,
)

router = APIRouter()


# =========================================================
# FIND CITIZEN BY MOBILE NUMBER
# =========================================================
# IMPORTANT:
# Keep this route BEFORE /{citizen_id}/...
# =========================================================

@router.get("/by-mobile/{mobile}")
def get_citizen_by_mobile(mobile: str):

    print("========================================")
    print("MOBILE LOGIN")
    print("Received mobile:", mobile)

    response = (
        supabase
        .table("citizens")
        .select("*")
        .eq("phone", mobile)
        .execute()
    )

    print("Supabase result:", response.data)
    print("========================================")

    if not response.data:
        return {
            "found": False,
            "citizen": None,
            "message": "Citizen not found",
        }

    citizen = response.data[0]

    return {
        "found": True,
        "citizen": citizen,
    }


# =========================================================
# UNIFIED CITIZEN RECORD
# =========================================================

@router.get("/{citizen_id}/unified")
def get_citizen(citizen_id: str):

    return get_unified_citizen(citizen_id)


# =========================================================
# SCHOLARSHIP DATA
# =========================================================

@router.get("/{citizen_id}/scholarship-data")
def get_scholarship(citizen_id: str):

    return get_scholarship_data(citizen_id)


# =========================================================
# ELIGIBILITY
# =========================================================

@router.get("/{citizen_id}/eligibility")
def check_citizen_eligibility(
    citizen_id: str,
    scheme_name: str
):

    return check_eligibility(
        citizen_id,
        scheme_name
    )


# =========================================================
# CITIZEN DASHBOARD
# =========================================================

@router.get("/{citizen_id}/dashboard")
def get_citizen_dashboard_api(citizen_id: str):

    return get_citizen_dashboard(citizen_id)