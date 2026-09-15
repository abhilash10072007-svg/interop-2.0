from fastapi import APIRouter
from services.supabase import supabase
from services.interoperability import normalize_status

router = APIRouter()


@router.get("/dashboard")
def get_admin_dashboard():

    # Get all applications
    response = (
        supabase
        .table("welfare_applications")
        .select("*")
        .order("submitted_on", desc=True)
        .execute()
    )

    applications = response.data

    # Normalize application statuses
    for application in applications:
        application["application_status"] = normalize_status(
            application["application_status"]
        )

    # Count applications by status
    total_applications = len(applications)

    submitted = sum(
        1
        for application in applications
        if application["application_status"] == "SUBMITTED"
    )

    under_review = sum(
        1
        for application in applications
        if application["application_status"] == "UNDER_REVIEW"
    )

    approved = sum(
        1
        for application in applications
        if application["application_status"] == "APPROVED"
    )

    rejected = sum(
        1
        for application in applications
        if application["application_status"] == "REJECTED"
    )

    return {
        "total_applications": total_applications,
        "status_summary": {
            "submitted": submitted,
            "under_review": under_review,
            "approved": approved,
            "rejected": rejected
        },
        "recent_applications": applications[:10]
    }