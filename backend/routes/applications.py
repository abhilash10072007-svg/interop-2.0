from datetime import datetime
import uuid

from fastapi import APIRouter

from services.supabase import supabase
from services.interoperability import (
    check_eligibility,
    check_required_consents,
)


router = APIRouter()


# ============================================================
# HELPERS
# ============================================================

def create_application_id():
    """
    Generate a readable application ID.
    Example: APP-7A3F91C2
    """
    return f"APP-{uuid.uuid4().hex[:8].upper()}"


def create_notification(
    citizen_id,
    event_type,
    message,
):
    """
    Create notification for citizen.
    """

    notification_id = (
        f"NOT-{uuid.uuid4().hex[:8].upper()}"
    )

    response = (
        supabase
        .table("notifications")
        .insert({
            "notification_id": notification_id,
            "citizen_id": citizen_id,
            "event_type": event_type,
            "message": message,
            "read_status": False,
            "created_at": datetime.utcnow().isoformat(),
        })
        .execute()
    )

    return (
        response.data[0]
        if response.data
        else None
    )


def create_audit_log(
    citizen_id,
    action,
    purpose,
    status="SUCCESS",
    user_id="SYSTEM",
):
    """
    Create audit entry for interoperability actions.
    """

    log_id = (
        f"LOG-{uuid.uuid4().hex[:8].upper()}"
    )

    response = (
        supabase
        .table("audit_logs")
        .insert({
            "log_id": log_id,
            "user_id": user_id,
            "citizen_id": citizen_id,
            "action": action,
            "purpose": purpose,
            "status": status,
            "timestamp": datetime.utcnow().isoformat(),
        })
        .execute()
    )

    return (
        response.data[0]
        if response.data
        else None
    )


# ============================================================
# SUBMIT APPLICATION
# ============================================================

@router.post("/submit")
def submit_application(
    citizen_id: str,
    scheme_name: str,
    operation: str = "APPLY",

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

    operation = str(
        operation or "APPLY"
    ).upper()

    print("========================================")
    print("APPLICATION SUBMISSION")
    print("Citizen ID:", citizen_id)
    print("Scheme:", scheme_name)
    print("Operation:", operation)
    print("========================================")

    # ========================================================
    # CITIZEN
    # ========================================================

    citizen_response = (
        supabase
        .table("citizens")
        .select("*")
        .eq("citizen_id", citizen_id)
        .execute()
    )

    if not citizen_response.data:

        return {
            "application_submitted": False,
            "message": "Citizen not found",
        }

    citizen = citizen_response.data[0]

    # ========================================================
    # TRACKING
    # ========================================================
    #
    # Track does not create a new application.
    # It only looks up an existing application.
    #

    if operation == "TRACK":

        return {
            "application_submitted": False,
            "tracking_required": True,
            "message": (
                "Tracking requires an existing "
                "application ID"
            ),
        }

    # ========================================================
    # CONSENT
    # ========================================================
    #
    # Education Scholarship / Student Assistance
    # continue using the existing consent model.
    #
    # Other services currently do not require the
    # Education + Income consent pair.
    #

    if scheme_name in [
        "Education Scholarship",
        "Student Assistance",
    ]:

        consent = check_required_consents(
            citizen_id,
            scheme_name,
        )

        if not consent["all_granted"]:

            return {
                "application_submitted": False,
                "message": (
                    "Required consent has not been granted"
                ),
                "missing_consents": consent["missing"],
                "missing_departments": [
                    item["department"]
                    for item in consent["missing"]
                ],
            }

    # ========================================================
    # ELIGIBILITY
    # ========================================================

    eligibility = check_eligibility(
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

    # --------------------------------------------------------
    # If eligibility was checked and failed
    # --------------------------------------------------------

    if (
        eligibility.get("eligibility_checked")
        and eligibility.get("eligible") is False
    ):

        return {
            "application_submitted": False,
            "message": eligibility.get(
                "message",
                "Citizen is not eligible",
            ),
            "reasons": eligibility.get(
                "reasons",
                [],
            ),
            "criteria": eligibility.get(
                "criteria"
            ),
            "eligibility": eligibility,
        }

    # ========================================================
    # CREATE APPLICATION ID
    # ========================================================

    application_id = create_application_id()

    submitted_on = datetime.utcnow().date().isoformat()

    # ========================================================
    # INITIAL STATUS
    # ========================================================
    #
    # Caste Certificate:
    # SUBMITTED → UNDER_VERIFICATION
    #
    # Everything else:
    # SUBMITTED
    #

    initial_status = "SUBMITTED"

    if scheme_name == "Caste Certificate":
        initial_status = "UNDER_VERIFICATION"

    # ========================================================
    # SERVICE CATEGORY
    # ========================================================

    category_map = {

        "Education Scholarship":
            "Social Welfare & Education",

        "Student Assistance":
            "Social Welfare & Education",

        "Driving License":
            "Transport & Vehicles",

        "Vehicle Registration":
            "Transport & Vehicles",

        "Income Certificate":
            "Revenue & Land Administration",

        "Caste Certificate":
            "Backward Classes & Community Welfare",

        "Personal Loan":
            "Public Financial Institutions Network",
    }

    service_category = category_map.get(
        scheme_name,
        "Government Services",
    )

    # ========================================================
    # APPLICATION RECORD
    # ========================================================

    application_data = {
        "application_id": application_id,
        "applicant_ref": citizen_id,
        "applicant_name": citizen.get(
            "name"
        ),
        "birth_date": citizen.get(
            "dob"
        ),
        "scheme_name": scheme_name,
        "submitted_on": submitted_on,
        "application_status": initial_status,
        "operation": operation,
        "service_category": service_category,
    }

    try:

        response = (
            supabase
            .table("welfare_applications")
            .insert(application_data)
            .execute()
        )

    except Exception as error:

        print(
            "APPLICATION INSERT ERROR:",
            error
        )

        return {
            "application_submitted": False,
            "message": (
                "Failed to create application"
            ),
            "error": str(error),
        }

    if not response.data:

        return {
            "application_submitted": False,
            "message": (
                "Application could not be created"
            ),
        }

    application = response.data[0]

    # ========================================================
    # NOTIFICATION
    # ========================================================

    if initial_status == "UNDER_VERIFICATION":

        notification_message = (
            f"Your {scheme_name} application "
            f"{application_id} has been submitted "
            f"and is now under verification."
        )

    else:

        notification_message = (
            f"Your {scheme_name} application "
            f"{application_id} has been submitted "
            f"successfully."
        )

    notification = create_notification(
        citizen_id=citizen_id,
        event_type="APPLICATION_SUBMITTED",
        message=notification_message,
    )

    # ========================================================
    # AUDIT
    # ========================================================

    audit = create_audit_log(
        citizen_id=citizen_id,
        action=(
            f"APPLICATION_SUBMITTED:{scheme_name}"
        ),
        purpose=scheme_name,
        status="SUCCESS",
    )

    # ========================================================
    # RESPONSE
    # ========================================================

    return {
        "application_submitted": True,
        "message": (
            "Application submitted successfully"
        ),
        "application": application,
        "application_id": application_id,
        "status": initial_status,
        "operation": operation,
        "service_category": service_category,
        "notification": notification,
        "audit_log": audit,
        "eligibility": eligibility,
    }


# ============================================================
# TRACK APPLICATION
# ============================================================

@router.get("/{application_id}/track")
def track_application(
    application_id: str,
    citizen_id: str,
):

    print("========================================")
    print("APPLICATION TRACKING")
    print("Application ID:", application_id)
    print("Citizen ID:", citizen_id)
    print("========================================")

    response = (
        supabase
        .table("welfare_applications")
        .select("*")
        .eq(
            "application_id",
            application_id,
        )
        .eq(
            "applicant_ref",
            citizen_id,
        )
        .execute()
    )

    if not response.data:

        return {
            "found": False,
            "authorized": False,
            "message": (
                "Application not found for "
                "this citizen"
            ),
        }

    application = response.data[0]

    return {
        "found": True,
        "authorized": True,
        "application": application,
        "application_id": application_id,
        "citizen_id": citizen_id,
        "status": application.get(
            "application_status"
        ),
    }


# ============================================================
# GET SINGLE APPLICATION
# ============================================================

@router.get("/{application_id}")
def get_application(
    application_id: str,
):

    response = (
        supabase
        .table("welfare_applications")
        .select("*")
        .eq(
            "application_id",
            application_id,
        )
        .execute()
    )

    if not response.data:

        return {
            "found": False,
            "message": "Application not found",
        }

    application = response.data[0]

    return {
        "found": True,
        "application": application,
    }


# ============================================================
# GET CITIZEN APPLICATIONS
# ============================================================

@router.get("/citizen/{citizen_id}")
def get_citizen_applications(
    citizen_id: str,
):

    response = (
        supabase
        .table("welfare_applications")
        .select("*")
        .eq(
            "applicant_ref",
            citizen_id,
        )
        .order(
            "submitted_on",
            desc=True,
        )
        .execute()
    )

    applications = response.data or []

    return {
        "citizen_id": citizen_id,
        "applications": applications,
        "count": len(applications),
    }


# ============================================================
# UPDATE APPLICATION STATUS
# ============================================================

@router.put("/{application_id}/status")
def update_application_status(
    application_id: str,
    user_id: str,
    new_status: str,
):

    new_status = str(
        new_status
    ).upper()

    print("========================================")
    print("APPLICATION STATUS UPDATE")
    print("Application:", application_id)
    print("User:", user_id)
    print("New status:", new_status)
    print("========================================")

    # ========================================================
    # GET APPLICATION
    # ========================================================

    response = (
        supabase
        .table("welfare_applications")
        .select("*")
        .eq(
            "application_id",
            application_id,
        )
        .execute()
    )

    if not response.data:

        return {
            "updated": False,
            "message": "Application not found",
        }

    application = response.data[0]

    current_status = str(
        application.get(
            "application_status",
            ""
        )
    ).upper()

    citizen_id = application.get(
        "applicant_ref"
    )

    scheme_name = application.get(
        "scheme_name"
    )

    # ========================================================
    # ALLOWED TRANSITIONS
    # ========================================================

    allowed_transitions = {

        "SUBMITTED": [
            "UNDER_REVIEW",
            "UNDER_VERIFICATION",
            "REJECTED",
        ],

        "UNDER_REVIEW": [
            "APPROVED",
            "REJECTED",
        ],

        "UNDER_VERIFICATION": [
            "UNDER_REVIEW",
            "APPROVED",
            "REJECTED",
        ],

        "APPROVED": [],

        "REJECTED": [],
    }

    allowed = allowed_transitions.get(
        current_status,
        [],
    )

    if new_status not in allowed:

        return {
            "updated": False,
            "message": (
                f"Invalid status transition: "
                f"{current_status} → {new_status}"
            ),
            "current_status": current_status,
            "allowed_statuses": allowed,
        }

    # ========================================================
    # UPDATE
    # ========================================================

    update_response = (
        supabase
        .table("welfare_applications")
        .update({
            "application_status": new_status,
        })
        .eq(
            "application_id",
            application_id,
        )
        .execute()
    )

    if not update_response.data:

        return {
            "updated": False,
            "message": (
                "Application status update failed"
            ),
        }

    updated_application = (
        update_response.data[0]
    )

    # ========================================================
    # NOTIFICATION
    # ========================================================

    notification_message = (
        f"Your {scheme_name} application "
        f"{application_id} status has been updated "
        f"to {new_status.replace('_', ' ').title()}."
    )

    notification = create_notification(
        citizen_id=citizen_id,
        event_type="APPLICATION_STATUS_UPDATED",
        message=notification_message,
    )

    # ========================================================
    # AUDIT
    # ========================================================

    audit = create_audit_log(
        citizen_id=citizen_id,
        action=(
            f"APPLICATION_STATUS_UPDATED:"
            f"{application_id}"
        ),
        purpose=scheme_name,
        status="SUCCESS",
        user_id=user_id,
    )

    return {
        "updated": True,
        "message": (
            "Application status updated successfully"
        ),
        "application": updated_application,
        "previous_status": current_status,
        "new_status": new_status,
        "notification": notification,
        "audit_log": audit,
    }