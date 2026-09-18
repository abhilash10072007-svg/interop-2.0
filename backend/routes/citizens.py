from fastapi import APIRouter

from services.supabase import supabase

from services.interoperability import (
    get_unified_citizen,
    get_scholarship_data,
    check_eligibility,
    get_citizen_dashboard,
)

router = APIRouter()


# ============================================================
# FIND CITIZEN BY MOBILE
# ============================================================

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


# ============================================================
# UNIFIED CITIZEN RECORD
# ============================================================

@router.get("/{citizen_id}/unified")
def get_citizen(citizen_id: str):

    return get_unified_citizen(citizen_id)


# ============================================================
# SCHOLARSHIP DATA
# ============================================================

@router.get("/{citizen_id}/scholarship-data")
def get_scholarship(citizen_id: str):

    return get_scholarship_data(citizen_id)


# ============================================================
# ELIGIBILITY
# ============================================================

@router.get("/{citizen_id}/eligibility")
def check_citizen_eligibility(
    citizen_id: str,
    scheme_name: str,
    operation: str = "apply",

    # Driving License
    license_type: str = "LMV",

    # Income Certificate
    issuing_district: str | None = None,
    issuing_taluk: str | None = None,

    # Vehicle Registration
    chassis_number: str | None = None,
    engine_number: str | None = None,
    invoice_present: bool = True,
    insurance_active: bool = True,
    puc_valid: bool = True,

    # Personal Loan
    declared_income: float | None = None,
):

    print("========================================")
    print("ELIGIBILITY CHECK")
    print("Citizen:", citizen_id)
    print("Scheme:", scheme_name)
    print("Operation:", operation)
    print("========================================")

    return check_eligibility(
        citizen_id=citizen_id,
        scheme_name=scheme_name,
        operation=operation,
        license_type=license_type,
        issuing_district=issuing_district,
        issuing_taluk=issuing_taluk,
        chassis_number=chassis_number,
        engine_number=engine_number,
        declared_income=declared_income,
        invoice_present=invoice_present,
        insurance_active=insurance_active,
        puc_valid=puc_valid,
    )


# ============================================================
# CITIZEN DASHBOARD
# ============================================================

@router.get("/{citizen_id}/dashboard")
def get_citizen_dashboard_api(citizen_id: str):

    return get_citizen_dashboard(citizen_id)