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


# ============================================================
# SUBMIT APPLICATION
# ============================================================

@router.post("/submit")
def submit_application(
    citizen_id: str,
    scheme_name: str
):

    print("==============================================")
    print("APPLICATION SUBMISSION")
    print("Citizen ID:", citizen_id)
    print("Scheme:", scheme_name)
    print("==============================================")


    purpose = scheme_name


    # ========================================================
    # CHECK EDUCATION CONSENT
    # ========================================================

    education_consent = check_consent(
        citizen_id,
        "Education Department",
        "Education",
        purpose
    )


    print(
        "Education consent:",
        education_consent
    )


    # ========================================================
    # CHECK INCOME CONSENT
    # ========================================================

    income_consent = check_consent(
        citizen_id,
        "Income Department",
        "Income",
        purpose
    )


    print(
        "Income consent:",
        income_consent
    )


    # ========================================================
    # FIND EXACT MISSING CONSENTS
    # ========================================================

    missing_consents = []


    if not education_consent:

        missing_consents.append(
            {
                "department": "Education Department",
                "data_type": "Education",
                "purpose": purpose
            }
        )


    if not income_consent:

        missing_consents.append(
            {
                "department": "Income Department",
                "data_type": "Income",
                "purpose": purpose
            }
        )


    # ========================================================
    # STOP IF CONSENT IS MISSING
    # ========================================================

    if missing_consents:

        department_names = [
            item["department"]
            for item in missing_consents
        ]


        print(
            "MISSING CONSENTS:",
            department_names
        )


        return {

            "application_submitted": False,

            "message":
                "Required consent has not been granted",

            "missing_consents":
                missing_consents,

            "missing_departments":
                department_names

        }


    # ========================================================
    # CHECK ELIGIBILITY
    # ========================================================

    print(
        "All required consents granted."
    )

    print(
        "Checking eligibility..."
    )


    eligibility = check_eligibility(
        citizen_id,
        scheme_name
    )


    print(
        "Eligibility result:",
        eligibility
    )


    # ========================================================
    # ELIGIBILITY CHECK FAILED
    # ========================================================

    if not eligibility.get(
        "eligibility_checked",
        False
    ):

        return {

            "application_submitted":
                False,

            "message":
                eligibility.get(
                    "message",
                    "Eligibility could not be checked."
                ),

            "eligibility":
                eligibility

        }


    # ========================================================
    # CITIZEN NOT ELIGIBLE
    # ========================================================

    if not eligibility.get(
        "eligible",
        False
    ):

        return {

            "application_submitted":
                False,

            "message":
                "Citizen is not eligible for this scheme",

            "eligibility":
                eligibility

        }


    # ========================================================
    # GET CITIZEN DETAILS
    # ========================================================

    citizen_response = (
        supabase
        .table("citizens")
        .select("*")
        .eq(
            "citizen_id",
            citizen_id
        )
        .execute()
    )


    if not citizen_response.data:

        return {

            "application_submitted":
                False,

            "message":
                "Citizen record not found."

        }


    citizen = citizen_response.data[0]


    # ========================================================
    # GENERATE APPLICATION ID
    # ========================================================

    application_id = (
        f"APP-{uuid.uuid4().hex[:8].upper()}"
    )


    # ========================================================
    # CREATE APPLICATION
    # ========================================================

    application = {

        "application_id":
            application_id,

        "applicant_ref":
            citizen_id,

        "applicant_name":
            citizen.get(
                "name",
                ""
            ),

        "birth_date":
            citizen.get(
                "dob"
            ),

        "scheme_name":
            scheme_name,

        "submitted_on":
            str(date.today()),

        "application_status":
            "SUBMITTED"

    }


    print(
        "Creating application:",
        application
    )


    # ========================================================
    # INSERT APPLICATION INTO SUPABASE
    # ========================================================

    application_response = (
        supabase
        .table("welfare_applications")
        .insert(application)
        .execute()
    )


    # ========================================================
    # CREATE NOTIFICATION
    # ========================================================

    notification = {

        "notification_id":
            f"NOT-{uuid.uuid4().hex[:8].upper()}",

        "citizen_id":
            citizen_id,

        "event_type":
            "APPLICATION_SUBMITTED",

        "message":
            (
                f"Your {scheme_name} application "
                f"{application_id} has been submitted successfully."
            ),

        "read_status":
            "UNREAD",

        "created_at":
            datetime.now().isoformat()

    }


    try:

        supabase \
            .table("notifications") \
            .insert(notification) \
            .execute()

    except Exception as error:

        print(
            "Notification creation warning:",
            error
        )


    # ========================================================
    # SUCCESS
    # ========================================================

    print("==============================================")
    print("APPLICATION SUBMITTED SUCCESSFULLY")
    print("Application ID:", application_id)
    print("==============================================")


    return {

        "application_submitted":
            True,

        "message":
            "Application submitted successfully",

        "application":
            application_response.data,

        "notification":
            notification

    }


# ============================================================
# GET / TRACK APPLICATION
# ============================================================

@router.get("/{application_id}")
def track_application(
    application_id: str
):

    response = (
        supabase
        .table("welfare_applications")
        .select("*")
        .eq(
            "application_id",
            application_id
        )
        .execute()
    )


    if not response.data:

        return {

            "application":
                None,

            "message":
                "Application not found."

        }


    return {

        "application":
            response.data[0]

    }


# ============================================================
# UPDATE APPLICATION STATUS
# ============================================================

@router.put("/{application_id}/status")
def update_application_status(
    application_id: str,
    user_id: str,
    new_status: str
):

    # --------------------------------------------------------
    # CHECK OFFICER ROLE
    # --------------------------------------------------------

    from services.auth import check_role


    is_officer = check_role(
        user_id,
        "OFFICER"
    )


    if not is_officer:

        return {

            "status_updated":
                False,

            "message":
                "Access denied. Only officers can update application status."

        }


    # --------------------------------------------------------
    # NORMALIZE STATUS
    # --------------------------------------------------------

    new_status = normalize_status(
            new_status
        )


    allowed_statuses = {

        "SUBMITTED",
        "UNDER_REVIEW",
        "APPROVED",
        "REJECTED"

    }


    if new_status not in allowed_statuses:

        return {

            "status_updated":
                False,

            "message":
                f"Invalid application status: {new_status}"

        }


    # --------------------------------------------------------
    # GET CURRENT APPLICATION
    # --------------------------------------------------------

    current_response = (
        supabase
        .table("welfare_applications")
        .select("*")
        .eq(
            "application_id",
            application_id
        )
        .execute()
    )


    if not current_response.data:

        return {

            "status_updated":
                False,

            "message":
                "Application not found."

        }


    current_application =current_response.data[0]


    current_status =normalize_status(
            current_application.get(
                "application_status",
                "SUBMITTED"
            )
        )


    # --------------------------------------------------------
    # VALID STATUS TRANSITIONS
    # --------------------------------------------------------

    valid_transitions = {

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


    if new_status not in valid_transitions.get(
        current_status,
        []
    ):

        return {

            "status_updated":
                False,

            "message":
                (
                    f"Invalid status transition: "
                    f"{current_status} → {new_status}"
                )

        }


    # --------------------------------------------------------
    # UPDATE APPLICATION
    # --------------------------------------------------------

    response = (
        supabase
        .table("welfare_applications")
        .update(
            {
                "application_status":
                    new_status
            }
        )
        .eq(
            "application_id",
            application_id
        )
        .execute()
    )


    # --------------------------------------------------------
    # CREATE STATUS NOTIFICATION
    # --------------------------------------------------------

    event_type = (
        "APPLICATION_"
        + new_status
    )


    if new_status == "UNDER_REVIEW":

        message = (
            f"Your application "
            f"{application_id} is now under review."
        )

    elif new_status == "APPROVED":

        message = (
            f"Your application "
            f"{application_id} has been approved."
        )

    elif new_status == "REJECTED":

        message = (
            f"Your application "
            f"{application_id} has been rejected."
        )

    else:

        message = (
            f"Your application "
            f"{application_id} status has been updated."
        )


    notification = {

        "notification_id":
            f"NOT-{uuid.uuid4().hex[:8].upper()}",

        "citizen_id":
            current_application.get(
                "applicant_ref"
            ),

        "event_type":
            event_type,

        "message":
            message,

        "read_status":
            "UNREAD",

        "created_at":
            datetime.now().isoformat()

    }


    try:

        supabase \
            .table("notifications") \
            .insert(notification) \
            .execute()

    except Exception as error:

        print(
            "Notification creation warning:",
            error
        )


    # --------------------------------------------------------
    # CREATE AUDIT LOG
    # --------------------------------------------------------

    audit_log = {

        "log_id":
            f"LOG-{uuid.uuid4().hex[:8].upper()}",

        "citizen_id":
            current_application.get(
                "applicant_ref"
            ),

        "user_id":
            user_id,

        "action":
            "APPLICATION_STATUS_UPDATED",

        "target_table":
            "welfare_applications",

        "target_id":
            application_id,

        "details":
            (
                f"Application status changed "
                f"from {current_status} "
                f"to {new_status}"
            ),

        "timestamp":
            datetime.now().isoformat()

    }


    try:

        supabase \
            .table("audit_logs") \
            .insert(audit_log) \
            .execute()

    except Exception as error:

        print(
            "Audit log warning:",
            error
        )


    # --------------------------------------------------------
    # RETURN
    # --------------------------------------------------------

    return {

        "status_updated":
            True,

        "message":
            "Application status updated successfully",

        "application":
            response.data,

        "notification":
            notification,

        "audit_log":
            audit_log

    }