from fastapi import APIRouter

from services.interoperability import (
    get_unified_citizen,
    get_scholarship_data,
    check_eligibility,
    get_citizen_dashboard
)

router = APIRouter()


@router.get("/{citizen_id}/unified")
def get_citizen(citizen_id: str):
    return get_unified_citizen(citizen_id)


@router.get("/{citizen_id}/scholarship-data")
def get_scholarship(citizen_id: str):
    return get_scholarship_data(citizen_id)


@router.get("/{citizen_id}/eligibility")
def check_citizen_eligibility(
    citizen_id: str,
    scheme_name: str
):
    return check_eligibility(
        citizen_id,
        scheme_name
    )


@router.get("/{citizen_id}/dashboard")
def get_citizen_dashboard_api(
    citizen_id: str
):
    return get_citizen_dashboard(citizen_id)