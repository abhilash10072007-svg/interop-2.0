from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from datetime import date
import uuid

from services.supabase import supabase
from services.interoperability import (
    check_eligibility,
    check_required_consents,
)

router = APIRouter()


# ============================================================
# REQUEST MODELS
# ============================================================

class ApplicationSubmitRequest(BaseModel):
    citizen_id: str
    scheme_name: str
    operation: Optional[str] = "APPLY"

    # General
    license_type: Optional[str] = None

    # Driving License
    learner_license_id: Optional[str] = None
    medical_record_id: Optional[str] = None
    aadhaar_record_id: Optional[str] = None

    # Income Certificate
    district: Optional[str] = None
    taluk: Optional[str] = None

    # Caste Certificate
    community: Optional[str] = None

    # Vehicle Registration
    registration_type: Optional[str] = None
    vehicle_id: Optional[str] = None
    chassis_number: Optional[str] = None
    engine_number: Optional[str] = None
    invoice_available: Optional[bool] = None
    insurance_available: Optional[bool] = None
    puc_available: Optional[bool] = None

    # Vehicle Transfer
    buyer_citizen_id: Optional[str] = None
    seller_citizen_id: Optional[str] = None
    buyer_consent: Optional[bool] = None
    seller_consent: Optional[bool] = None
    stolen_flag: Optional[bool] = None
    hypothecation: Optional[bool] = None
    noc_available: Optional[bool] = None
    road_tax_paid: Optional[bool] = None

    # Personal Loan
    declared_income: Optional[float] = None


class ApplicationStatusUpdateRequest(BaseModel):
    user_id: str
    new_status: str


# ============================================================
# CONFIGURATION
# ============================================================

DUPLICATE_BLOCKING_STATUSES = {
    "SUBMITTED",
    "UNDER_REVIEW",
    "UNDER_VERIFICATION",
    "APPROVED",
}


CONSENT_REQUIRED_SERVICES = {
    "Education Scholarship",
    "Student Assistance",
}


# ============================================================
# HELPER FUNCTIONS
# ============================================================

def normalize_scheme_name(scheme_name: str) -> str:
    return " ".join(
        scheme_name.strip().lower().split()
    )


def get_citizen(citizen_id: str):
    response = (
        supabase
        .table("citizens")
        .select("*")
        .eq("citizen_id", citizen_id)
        .limit(1)
        .execute()
    )

    if not response.data:
        raise HTTPException(
            status_code=404,
            detail=f"Citizen {citizen_id} not found",
        )

    return response.data[0]


def find_duplicate_application(
    citizen_id: str,
    scheme_name: str,
):
    response = (
        supabase
        .table("welfare_applications")
        .select("*")
        .eq("applicant_ref", citizen_id)
        .execute()
    )

    applications = response.data or []

    requested_scheme = normalize_scheme_name(
        scheme_name
    )

    for application in applications:

        existing_scheme = normalize_scheme_name(
            str(
                application.get(
                    "scheme_name",
                    "",
                )
            )
        )

        existing_status = str(
            application.get(
                "application_status",
                "",
            )
        ).strip().upper()

        if (
            existing_scheme == requested_scheme
            and existing_status in DUPLICATE_BLOCKING_STATUSES
        ):
            return application

    return None


def generate_application_id() -> str:
    return f"APP-{uuid.uuid4().hex[:8].upper()}"


def get_service_category(scheme_name: str) -> str:

    categories = {
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

    return categories.get(
        scheme_name,
        "Government Services",
    )


def create_notification(
    citizen_id: str,
    event_type: str,
    message: str,
):

    notification_id = (
        f"NOT-{uuid.uuid4().hex[:8].upper()}"
    )

    notification = {
        "notification_id": notification_id,
        "citizen_id": citizen_id,
        "event_type": event_type,
        "message": message,
        "read_status": "false",
    }

    try:

        response = (
            supabase
            .table("notifications")
            .insert(notification)
            .execute()
        )

        if response.data:
            return response.data[0]

    except Exception:
        pass

    return notification


def create_audit_log(
    citizen_id: str,
    action: str,
    purpose: str,
    status: str = "SUCCESS",
    user_id: str = "SYSTEM",
):

    log_id = (
        f"LOG-{uuid.uuid4().hex[:8].upper()}"
    )

    audit = {
        "log_id": log_id,
        "user_id": user_id,
        "citizen_id": citizen_id,
        "action": action,
        "purpose": purpose,
        "status": status,
    }

    try:

        response = (
            supabase
            .table("audit_logs")
            .insert(audit)
            .execute()
        )

        if response.data:
            return response.data[0]

    except Exception:
        pass

    return audit


# ============================================================
# SUBMIT APPLICATION
# ============================================================

@router.post("/submit")
def submit_application(
    request: ApplicationSubmitRequest,
):

    citizen_id = request.citizen_id.strip()
    scheme_name = request.scheme_name.strip()

    operation = (
        request.operation or "APPLY"
    ).strip().upper()

    if not citizen_id:
        raise HTTPException(
            status_code=400,
            detail="Citizen ID is required",
        )

    if not scheme_name:
        raise HTTPException(
            status_code=400,
            detail="Scheme name is required",
        )

    # --------------------------------------------------------
    # 1. Validate citizen
    # --------------------------------------------------------

    citizen = get_citizen(citizen_id)

    # --------------------------------------------------------
    # 2. TRACK operation
    # --------------------------------------------------------

    if operation == "TRACK":

        applications_response = (
            supabase
            .table("welfare_applications")
            .select("*")
            .eq(
                "applicant_ref",
                citizen_id,
            )
            .eq(
                "scheme_name",
                scheme_name,
            )
            .order(
                "submitted_on",
                desc=True,
            )
            .execute()
        )

        applications = (
            applications_response.data or []
        )

        return {
            "application_submitted": False,
            "tracking_required": True,
            "citizen_id": citizen_id,
            "scheme_name": scheme_name,
            "applications": applications,
        }

    # --------------------------------------------------------
    # 3. Duplicate check
    # --------------------------------------------------------

    duplicate_application = (
        find_duplicate_application(
            citizen_id=citizen_id,
            scheme_name=scheme_name,
        )
    )

    if duplicate_application:

        existing_status = str(
            duplicate_application.get(
                "application_status",
                "",
            )
        ).strip().upper()

        return {
            "application_submitted": False,
            "duplicate_application": True,

            "message": (
                f"You already have an active "
                f"application for {scheme_name}."
            ),

            "reason": (
                "A citizen cannot submit another "
                "application for the same scheme "
                "while an existing application is "
                "active or approved."
            ),

            "existing_application": {
                "application_id":
                    duplicate_application.get(
                        "application_id"
                    ),

                "scheme_name":
                    duplicate_application.get(
                        "scheme_name"
                    ),

                "application_status":
                    existing_status,

                "submitted_on":
                    duplicate_application.get(
                        "submitted_on"
                    ),
            },
        }

    # --------------------------------------------------------
    # 4. Consent check
    # --------------------------------------------------------

    if scheme_name in CONSENT_REQUIRED_SERVICES:

        consent_result = (
            check_required_consents(
                citizen_id=citizen_id
            )
        )

        if not consent_result.get(
            "all_granted",
            False,
        ):

            missing_consents = (
                consent_result.get(
                    "missing",
                    [],
                )
            )

            return {
                "application_submitted": False,
                "consent_required": True,

                "message": (
                    "Required citizen consent "
                    "has not been granted."
                ),

                "missing_consents":
                    missing_consents,
            }

    # --------------------------------------------------------
    # 5. Eligibility
    # --------------------------------------------------------

    eligibility_kwargs = {
        "citizen_id": citizen_id,
        "scheme_name": scheme_name,
        "operation": operation,
    }

    optional_fields = [
        "license_type",
        "learner_license_id",
        "medical_record_id",
        "aadhaar_record_id",
        "district",
        "taluk",
        "community",
        "registration_type",
        "vehicle_id",
        "chassis_number",
        "engine_number",
        "invoice_available",
        "insurance_available",
        "puc_available",
        "buyer_citizen_id",
        "seller_citizen_id",
        "buyer_consent",
        "seller_consent",
        "stolen_flag",
        "hypothecation",
        "noc_available",
        "road_tax_paid",
        "declared_income",
    ]

    for field in optional_fields:

        value = getattr(
            request,
            field,
            None,
        )

        if value is not None:
            eligibility_kwargs[field] = value

    try:

        eligibility = check_eligibility(
            **eligibility_kwargs
        )

    except TypeError:

        eligibility = check_eligibility(
            citizen_id=citizen_id,
            scheme_name=scheme_name,
            operation=operation,
        )

    # --------------------------------------------------------
    # Eligibility failure
    # --------------------------------------------------------

    if (
        eligibility.get(
            "eligibility_checked"
        )
        and not eligibility.get(
            "eligible",
            False,
        )
    ):

        return {
            "application_submitted": False,
            "eligibility_checked": True,
            "eligible": False,

            "message": (
                "Application cannot be submitted "
                "because the citizen is not eligible."
            ),

            "reasons":
                eligibility.get(
                    "reasons",
                    [],
                ),

            "criteria":
                eligibility.get(
                    "criteria",
                    {},
                ),

            "missing_consents":
                eligibility.get(
                    "missing_consents",
                    [],
                ),

            "eligibility":
                eligibility,
        }

    # --------------------------------------------------------
    # 6. Create application
    # --------------------------------------------------------

    application_id = generate_application_id()

    submitted_on = date.today().isoformat()

    if scheme_name == "Caste Certificate":
        initial_status = "UNDER_VERIFICATION"
    else:
        initial_status = "SUBMITTED"

    service_category = get_service_category(
        scheme_name
    )

    application = {
        "application_id": application_id,
        "applicant_ref": citizen_id,
        "applicant_name": citizen.get("name"),
        "birth_date": citizen.get("dob"),
        "scheme_name": scheme_name,
        "submitted_on": submitted_on,
        "application_status": initial_status,
        "operation": operation,
        "service_category": service_category,
    }

    # --------------------------------------------------------
    # Insert into Supabase
    # --------------------------------------------------------

    try:

        insert_response = (
            supabase
            .table("welfare_applications")
            .insert(application)
            .execute()
        )

        if not insert_response.data:

            raise HTTPException(
                status_code=500,
                detail="Failed to create application",
            )

        application = insert_response.data[0]

    except HTTPException:
        raise

    except Exception as exc:

        error_text = str(exc)

        if (
            "duplicate" in error_text.lower()
            or "unique" in error_text.lower()
        ):

            duplicate_application = (
                find_duplicate_application(
                    citizen_id=citizen_id,
                    scheme_name=scheme_name,
                )
            )

            return {
                "application_submitted": False,
                "duplicate_application": True,

                "message": (
                    f"You already have an active "
                    f"application for {scheme_name}."
                ),

                "existing_application":
                    duplicate_application,
            }

        raise HTTPException(
            status_code=500,
            detail=(
                "Failed to create application: "
                f"{error_text}"
            ),
        )

    # --------------------------------------------------------
    # 7. Notification
    # --------------------------------------------------------

    notification = create_notification(
        citizen_id=citizen_id,
        event_type="APPLICATION_SUBMITTED",
        message=(
            f"Your {scheme_name} application "
            f"{application_id} has been "
            f"submitted successfully."
        ),
    )

    # --------------------------------------------------------
    # 8. Audit log
    # --------------------------------------------------------

    audit_log = create_audit_log(
        citizen_id=citizen_id,
        action=(
            f"APPLICATION_SUBMITTED:"
            f"{scheme_name}"
        ),
        purpose=scheme_name,
        status="SUCCESS",
    )

    # --------------------------------------------------------
    # Final response
    # --------------------------------------------------------

    return {
        "application_submitted": True,

        "message":
            "Application submitted successfully",

        "application": application,

        "application_id":
            application_id,

        "status":
            initial_status,

        "operation":
            operation,

        "service_category":
            service_category,

        "notification":
            notification,

        "audit_log":
            audit_log,

        "eligibility":
            eligibility,
    }


# ============================================================
# GET APPLICATION
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
        .limit(1)
        .execute()
    )

    if not response.data:

        raise HTTPException(
            status_code=404,
            detail="Application not found",
        )

    return {
        "found": True,
        "application": response.data[0],
    }


# ============================================================
# TRACK APPLICATION
# ============================================================

@router.get("/{application_id}/track")
def track_application(
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
        .limit(1)
        .execute()
    )

    if not response.data:

        raise HTTPException(
            status_code=404,
            detail="Application not found",
        )

    application = response.data[0]

    return {
        "application_id":
            application.get("application_id"),

        "scheme_name":
            application.get("scheme_name"),

        "status":
            application.get("application_status"),

        "submitted_on":
            application.get("submitted_on"),

        "operation":
            application.get("operation"),

        "service_category":
            application.get("service_category"),
    }


# ============================================================
# GET CITIZEN APPLICATIONS
# ============================================================

@router.get("/citizen/{citizen_id}")
def get_citizen_applications(
    citizen_id: str,
):

    get_citizen(citizen_id)

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
    request: ApplicationStatusUpdateRequest,
):

    # --------------------------------------------------------
    # Validate request body
    # --------------------------------------------------------

    user_id = request.user_id.strip()
    new_status = request.new_status.strip().upper()

    if not user_id:
        raise HTTPException(
            status_code=400,
            detail="User ID is required",
        )

    if not new_status:
        raise HTTPException(
            status_code=400,
            detail="New status is required",
        )

    # --------------------------------------------------------
    # Get application
    # --------------------------------------------------------

    response = (
        supabase
        .table("welfare_applications")
        .select("*")
        .eq(
            "application_id",
            application_id,
        )
        .limit(1)
        .execute()
    )

    if not response.data:

        raise HTTPException(
            status_code=404,
            detail="Application not found",
        )

    application = response.data[0]

    old_status = str(
        application.get(
            "application_status",
            "",
        )
    ).strip().upper()

    # --------------------------------------------------------
    # Allowed transitions
    # --------------------------------------------------------

    allowed_transitions = {

        "SUBMITTED": {
            "UNDER_REVIEW",
            "UNDER_VERIFICATION",
            "REJECTED",
        },

        "UNDER_REVIEW": {
            "APPROVED",
            "REJECTED",
        },

        "UNDER_VERIFICATION": {
            "UNDER_REVIEW",
            "APPROVED",
            "REJECTED",
        },

        "APPROVED": set(),

        "REJECTED": set(),
    }

    allowed_statuses = allowed_transitions.get(
        old_status,
        set(),
    )

    if new_status not in allowed_statuses:

        raise HTTPException(
            status_code=400,
            detail=(
                f"Invalid status transition: "
                f"{old_status} -> {new_status}"
            ),
        )

    # --------------------------------------------------------
    # Update status
    # --------------------------------------------------------

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

        raise HTTPException(
            status_code=500,
            detail="Failed to update application status",
        )

    updated_application = (
        update_response.data[0]
    )

    citizen_id = updated_application.get(
        "applicant_ref"
    )

    scheme_name = updated_application.get(
        "scheme_name"
    )

    # --------------------------------------------------------
    # Notification
    # --------------------------------------------------------

    notification = create_notification(
        citizen_id=citizen_id,
        event_type="APPLICATION_STATUS_UPDATED",
        message=(
            f"Your {scheme_name} application "
            f"{application_id} status has been "
            f"updated from {old_status} "
            f"to {new_status}."
        ),
    )

    # --------------------------------------------------------
    # Audit
    # --------------------------------------------------------

    audit_log = create_audit_log(
        citizen_id=citizen_id,
        action=(
            f"APPLICATION_STATUS_UPDATED:"
            f"{application_id}:"
            f"{old_status}->{new_status}"
        ),
        purpose=scheme_name,
        status="SUCCESS",
        user_id=user_id,
    )

    # --------------------------------------------------------
    # Final response
    # --------------------------------------------------------

    return {
        "success": True,

        "message":
            "Application status updated successfully",

        "application":
            updated_application,

        "application_id":
            application_id,

        "old_status":
            old_status,

        "new_status":
            new_status,

        "notification":
            notification,

        "audit_log":
            audit_log,
    }