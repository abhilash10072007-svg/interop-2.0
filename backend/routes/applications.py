from fastapi import APIRouter
from services.supabase import supabase
from services.interoperability import (
    check_consent,
    normalize_status,
    check_eligibility
)
from datetime import date, datetime
import uuid

router = APIRouter()


@router.post("/submit")
def submit_application(
    citizen_id: str,
    scheme_name: str
):

    purpose = scheme_name

    # Check Education Department consent
    education_consent = check_consent(
        citizen_id,
        "Education Department",
        "Education",
        purpose
    )

    # Check Income Department consent
    income_consent = check_consent(
        citizen_id,
        "Income Department",
        "Income",
        purpose
    )

    # Stop application if required consent is missing
    if not education_consent or not income_consent:
        return {
            "application_submitted": False,
            "message": "Required consent has not been granted"
        }

    # Check eligibility
    eligibility = check_eligibility(
        citizen_id,
        scheme_name
    )

    # Stop if eligibility could not be checked
    if not eligibility["eligibility_checked"]:
        return {
            "application_submitted": False,
            "message": eligibility["message"]
        }

    # Stop if citizen is not eligible
    if not eligibility["eligible"]:
        return {
            "application_submitted": False,
            "message": "Citizen is not eligible for this scheme",
            "eligibility": eligibility
        }

    # Get citizen details
    citizen = (
        supabase
        .table("citizens")
        .select("*")
        .eq("citizen_id", citizen_id)
        .single()
        .execute()
    )

    # Generate application ID
    application_id = f"APP-{uuid.uuid4().hex[:8].upper()}"

    # Create application
    application = {
        "application_id": application_id,
        "applicant_ref": citizen_id,
        "applicant_name": citizen.data["name"],
        "birth_date": citizen.data["dob"],
        "scheme_name": scheme_name,
        "submitted_on": str(date.today()),
        "application_status": "SUBMITTED"
    }

    # Store application in Supabase
    response = (
        supabase
        .table("welfare_applications")
        .insert(application)
        .execute()
    )

    # Create notification automatically
    notification = {
        "notification_id": f"NOT-{uuid.uuid4().hex[:8].upper()}",
        "citizen_id": citizen_id,
        "event_type": "APPLICATION_SUBMITTED",
        "message": (
            f"Your {scheme_name} application "
            f"{application_id} has been submitted successfully."
        ),
        "read_status": "UNREAD",
        "created_at": datetime.now().isoformat()
    }

    supabase \
        .table("notifications") \
        .insert(notification) \
        .execute()

    return {
        "application_submitted": True,
        "message": "Application submitted successfully",
        "application": response.data,
        "notification": notification
    }


@router.get("/{application_id}")
def track_application(application_id: str):

    response = (
        supabase
        .table("welfare_applications")
        .select("*")
        .eq("application_id", application_id)
        .single()
        .execute()
    )

    return {
        "application": response.data
    }


@router.put("/{application_id}/status")
def update_application_status(
    application_id: str,
    user_id: str,
    new_status: str
):

    # Check if user is an officer
    from services.auth import check_role

    is_officer = check_role(
        user_id,
        "OFFICER"
    )

    if not is_officer:
        return {
            "status_updated": False,
            "message": "Access denied. Only officers can update application status."
        }

    # Check whether application exists
    application = (
        supabase
        .table("welfare_applications")
        .select("*")
        .eq("application_id", application_id)
        .single()
        .execute()
    )

    if application.data is None:
        return {
            "status_updated": False,
            "message": "Application not found"
        }

    # Normalize the new status
    new_status = normalize_status(new_status)

    # Validate status
    allowed_statuses = [
        "UNDER_REVIEW",
        "APPROVED",
        "REJECTED"
    ]

    if new_status not in allowed_statuses:
        return {
            "status_updated": False,
            "message": "Invalid application status"
        }

    # Get current application status
    current_status = normalize_status(
        application.data["application_status"]
    )

    # Define allowed workflow transitions
    allowed_transitions = {
        "SUBMITTED": [
            "UNDER_REVIEW"
        ],
        "UNDER_REVIEW": [
            "APPROVED",
            "REJECTED"
        ],
        "APPROVED": [],
        "REJECTED": []
    }

    # Check whether transition is allowed
    if new_status not in allowed_transitions.get(
        current_status,
        []
    ):
        return {
            "status_updated": False,
            "message": (
                f"Invalid workflow transition: "
                f"{current_status} → {new_status}"
            )
        }

    # Update application
    response = (
        supabase
        .table("welfare_applications")
        .update({
            "application_status": new_status
        })
        .eq("application_id", application_id)
        .execute()
    )

    citizen_id = application.data["applicant_ref"]

    # Create notification
    notification = {
        "notification_id": f"NOT-{uuid.uuid4().hex[:8].upper()}",
        "citizen_id": citizen_id,
        "event_type": "APPLICATION_STATUS_UPDATED",
        "message": (
            f"Your {application.data['scheme_name']} application "
            f"{application_id} status has been updated to {new_status}."
        ),
        "read_status": "UNREAD",
        "created_at": datetime.now().isoformat()
    }

    supabase \
        .table("notifications") \
        .insert(notification) \
        .execute()

    # Create audit log
    audit_log = {
        "log_id": f"AUD-{uuid.uuid4().hex[:8].upper()}",
        "user_id": user_id,
        "citizen_id": citizen_id,
        "action": "UPDATE_APPLICATION_STATUS",
        "purpose": application.data["scheme_name"],
        "status": "SUCCESS",
        "timestamp": datetime.now().isoformat()
    }

    supabase \
        .table("audit_logs") \
        .insert(audit_log) \
        .execute()

    return {
        "status_updated": True,
        "message": "Application status updated successfully",
        "application": response.data,
        "notification": notification,
        "audit_log": audit_log
    }


@router.get("/citizen/{citizen_id}")
def get_citizen_applications(citizen_id: str):

    response = (
        supabase
        .table("welfare_applications")
        .select("*")
        .eq("applicant_ref", citizen_id)
        .order("submitted_on", desc=True)
        .execute()
    )

    applications = response.data

    for application in applications:
        application["application_status"] = normalize_status(
            application["application_status"]
        )

    return {
        "citizen_id": citizen_id,
        "applications": applications
    }