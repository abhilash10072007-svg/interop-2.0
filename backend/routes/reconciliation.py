from fastapi import APIRouter

from services.supabase import supabase

from services.interoperability import (
    normalize_education,
    normalize_income,
    normalize_welfare
)

from services.reconciliation import (
    reconcile_citizen_data
)

router = APIRouter()


@router.get("/{citizen_id}")
def reconcile_citizen(citizen_id: str):

    # ==================================================
    # GOLDEN RECORD
    # ==================================================

    citizen = (
        supabase
        .table("citizens")
        .select("*")
        .eq(
            "citizen_id",
            citizen_id
        )
        .single()
        .execute()
    )

    # ==================================================
    # EDUCATION
    # ==================================================

    education_response = (
        supabase
        .table("education_records")
        .select("*")
        .eq(
            "citizen_ref",
            citizen_id
        )
        .execute()
    )

    normalized_education = []

    for record in education_response.data:

        result = normalize_education(
            record
        )

        if result["valid"]:

            normalized_education.append(
                result["data"]
            )

    # ==================================================
    # INCOME
    # ==================================================

    income_response = (
        supabase
        .table("income_records")
        .select("*")
        .eq(
            "beneficiary_ref",
            citizen_id
        )
        .execute()
    )

    normalized_income = []

    for record in income_response.data:

        result = normalize_income(
            record
        )

        if result["valid"]:

            normalized_income.append(
                result["data"]
            )

    # ==================================================
    # WELFARE
    # ==================================================

    welfare_response = (
        supabase
        .table("welfare_applications")
        .select("*")
        .eq(
            "applicant_ref",
            citizen_id
        )
        .execute()
    )

    normalized_welfare = []

    for record in welfare_response.data:

        result = normalize_welfare(
            record
        )

        if result["valid"]:

            normalized_welfare.append(
                result["data"]
            )

    # ==================================================
    # RECONCILIATION
    # ==================================================

    reconciliation = reconcile_citizen_data(

        citizen.data,

        normalized_education,

        normalized_income,

        normalized_welfare
    )

    # ==================================================
    # RESPONSE
    # ==================================================

    return {

        "citizen_id":
            citizen_id,

        "golden_record":
            citizen.data,

        "reconciliation":
            reconciliation
    }