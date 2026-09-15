from services.supabase import supabase
from datetime import datetime

from services.validation import (
    validate_income_data,
    validate_education_data,
    validate_welfare_data
)

from services.department import (
    call_department_safe
)


# ==================================================
# SCHEME RULES
# ==================================================

SCHEME_RULES = {

    "Education Scholarship": {
        "income_limit": 250000,
        "student_status": "ACTIVE"
    },

    "Student Assistance": {
        "income_limit": 300000,
        "student_status": "ACTIVE"
    }
}


# ==================================================
# DATE NORMALIZATION
# ==================================================

def normalize_date(
    date_value,
    date_format=None
):

    if not date_value:
        return None

    formats = []

    if date_format:
        formats.append(date_format)

    formats.extend([
        "%Y-%m-%d",
        "%d-%m-%Y",
        "%d/%m/%Y",
        "%m-%d-%Y",
        "%m/%d/%Y"
    ])

    for fmt in formats:

        try:

            date = datetime.strptime(
                str(date_value),
                fmt
            )

            return date.strftime(
                "%Y-%m-%d"
            )

        except ValueError:

            continue

    raise ValueError(
        f"Unsupported date format: {date_value}"
    )


# ==================================================
# EDUCATION NORMALIZATION + VALIDATION
# ==================================================

def normalize_education(record):

    normalized_data = {

        "citizen_id": record[
            "citizen_ref"
        ],

        "name": record[
            "student_name"
        ],

        "date_of_birth": normalize_date(
            record["date_of_birth"],
            "%d/%m/%Y"
        ),

        "institution": record[
            "institution"
        ],

        "course": record[
            "course"
        ],

        "academic_year": record[
            "academic_year"
        ],

        "status": record[
            "student_status"
        ]
    }

    validation = validate_education_data(
        normalized_data
    )

    if not validation["valid"]:

        return {
            "valid": False,
            "errors": validation["errors"]
        }

    return {
        "valid": True,
        "data": normalized_data
    }


# ==================================================
# INCOME NORMALIZATION + VALIDATION
# ==================================================

def normalize_income(record):

    normalized_data = {

        "citizen_id": record[
            "beneficiary_ref"
        ],

        "name": record[
            "name"
        ],

        "date_of_birth": normalize_date(
            record["dob"],
            "%d-%m-%Y"
        ),

        "annual_income": record[
            "annual_income_inr"
        ],

        "income_source": record[
            "income_source"
        ],

        "verification_status": record[
            "verification_flag"
        ]
    }

    validation = validate_income_data(
        normalized_data
    )

    if not validation["valid"]:

        return {
            "valid": False,
            "errors": validation["errors"]
        }

    return {
        "valid": True,
        "data": normalized_data
    }


# ==================================================
# WELFARE NORMALIZATION + VALIDATION
# ==================================================

def normalize_welfare(record):

    normalized_data = {

        "citizen_id": record[
            "applicant_ref"
        ],

        "name": record[
            "applicant_name"
        ],

        "date_of_birth": normalize_date(
            record["birth_date"],
            "%d-%m-%Y"
        ),

        "scheme": record[
            "scheme_name"
        ],

        "submitted_on": record[
            "submitted_on"
        ],

        "status": record[
            "application_status"
        ]
    }

    validation = validate_welfare_data(
        normalized_data
    )

    if not validation["valid"]:

        return {
            "valid": False,
            "errors": validation["errors"]
        }

    return {
        "valid": True,
        "data": normalized_data
    }


# ==================================================
# CONSENT CHECK
# ==================================================

def check_consent(
    citizen_id,
    data_provider,
    data_type,
    purpose
):

    response = (
        supabase
        .table("consents")
        .select("*")
        .eq(
            "citizen_id",
            citizen_id
        )
        .eq(
            "data_provider",
            data_provider
        )
        .eq(
            "data_type",
            data_type
        )
        .eq(
            "purpose",
            purpose
        )
        .eq(
            "status",
            "GRANTED"
        )
        .execute()
    )

    for consent in response.data:

        expires_at = consent.get(
            "expires_at"
        )

        if expires_at is None:
            continue

        expiry_date = datetime.strptime(
            expires_at,
            "%Y-%m-%d"
        ).date()

        if (
            expiry_date
            >= datetime.today().date()
        ):

            return True

    return False


# ==================================================
# UNIFIED CITIZEN
# ==================================================

def get_unified_citizen(
    citizen_id: str
):

    # ==================================================
    # CITIZEN
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
    # EDUCATION DEPARTMENT
    # ==================================================

    education_result = call_department_safe(

        "Education Department",

        lambda: (
            supabase
            .table("education_records")
            .select("*")
            .eq(
                "citizen_ref",
                citizen_id
            )
            .execute()
        )
    )

    education = (

        education_result["data"]

        if education_result["success"]

        else None
    )

    education_error = (
        education_result["error"]
    )

    # ==================================================
    # INCOME DEPARTMENT
    # ==================================================

    income_result = call_department_safe(

        "Income Department",

        lambda: (
            supabase
            .table("income_records")
            .select("*")
            .eq(
                "beneficiary_ref",
                citizen_id
            )
            .execute()
        )
    )

    income = (

        income_result["data"]

        if income_result["success"]

        else None
    )

    income_error = (
        income_result["error"]
    )

    # ==================================================
    # WELFARE DEPARTMENT
    # ==================================================

    welfare_result = call_department_safe(

        "Welfare Department",

        lambda: (
            supabase
            .table("welfare_applications")
            .select("*")
            .eq(
                "applicant_ref",
                citizen_id
            )
            .execute()
        )
    )

    welfare = (

        welfare_result["data"]

        if welfare_result["success"]

        else None
    )

    welfare_error = (
        welfare_result["error"]
    )

    # ==================================================
    # EDUCATION NORMALIZATION
    # ==================================================

    normalized_education = []

    education_validation_errors = []

    if education is not None:

        for record in education.data:

            result = normalize_education(
                record
            )

            if result["valid"]:

                normalized_education.append(
                    result["data"]
                )

            else:

                education_validation_errors.extend(
                    result["errors"]
                )

    # ==================================================
    # INCOME NORMALIZATION
    # ==================================================

    normalized_income = []

    income_validation_errors = []

    if income is not None:

        for record in income.data:

            result = normalize_income(
                record
            )

            if result["valid"]:

                normalized_income.append(
                    result["data"]
                )

            else:

                income_validation_errors.extend(
                    result["errors"]
                )

    # ==================================================
    # WELFARE NORMALIZATION
    # ==================================================

    normalized_welfare = []

    welfare_validation_errors = []

    if welfare is not None:

        for record in welfare.data:

            result = normalize_welfare(
                record
            )

            if result["valid"]:

                normalized_welfare.append(
                    result["data"]
                )

            else:

                welfare_validation_errors.extend(
                    result["errors"]
                )

    # ==================================================
    # UNIFIED RESPONSE
    # ==================================================

    return {

        "citizen": citizen.data,

        "education": normalized_education,

        "income": normalized_income,

        "welfare": normalized_welfare,

        "errors": {

            "education": education_error,

            "education_validation":
                education_validation_errors,

            "income": income_error,

            "income_validation":
                income_validation_errors,

            "welfare": welfare_error,

            "welfare_validation":
                welfare_validation_errors
        }
    }


# ==================================================
# SCHOLARSHIP DATA
# ==================================================

def get_scholarship_data(
    citizen_id: str
):

    purpose = "Education Scholarship"

    # ==================================================
    # CONSENT
    # ==================================================

    education_consent = check_consent(

        citizen_id,

        "Education Department",

        "Education",

        purpose
    )

    income_consent = check_consent(

        citizen_id,

        "Income Department",

        "Income",

        purpose
    )

    if (
        not education_consent
        or not income_consent
    ):

        return {

            "access_granted": False,

            "message":
                "Required consent has not been granted"
        }

    # ==================================================
    # CITIZEN
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

    education = (
        supabase
        .table("education_records")
        .select("*")
        .eq(
            "citizen_ref",
            citizen_id
        )
        .execute()
    )

    # ==================================================
    # INCOME
    # ==================================================

    income = (
        supabase
        .table("income_records")
        .select("*")
        .eq(
            "beneficiary_ref",
            citizen_id
        )
        .execute()
    )

    # ==================================================
    # EDUCATION NORMALIZATION
    # ==================================================

    normalized_education = []

    education_validation_errors = []

    for record in education.data:

        result = normalize_education(
            record
        )

        if result["valid"]:

            normalized_education.append(
                result["data"]
            )

        else:

            education_validation_errors.extend(
                result["errors"]
            )

    # ==================================================
    # INCOME NORMALIZATION
    # ==================================================

    normalized_income = []

    income_validation_errors = []

    for record in income.data:

        result = normalize_income(
            record
        )

        if result["valid"]:

            normalized_income.append(
                result["data"]
            )

        else:

            income_validation_errors.extend(
                result["errors"]
            )

    # ==================================================
    # RESPONSE
    # ==================================================

    return {

        "access_granted": True,

        "purpose": purpose,

        "citizen": citizen.data,

        "education": normalized_education,

        "income": normalized_income,

        "validation": {

            "education":
                education_validation_errors,

            "income":
                income_validation_errors
        }
    }


# ==================================================
# STATUS NORMALIZATION
# ==================================================

def normalize_status(
    status: str
):

    status = status.strip().upper()

    status_mapping = {

        "SUBMITTED":
            "SUBMITTED",

        "UNDER REVIEW":
            "UNDER_REVIEW",

        "UNDER_REVIEW":
            "UNDER_REVIEW",

        "APPROVED":
            "APPROVED",

        "REJECTED":
            "REJECTED"
    }

    return status_mapping.get(
        status,
        status
    )


# ==================================================
# ELIGIBILITY
# ==================================================

def check_eligibility(
    citizen_id: str,
    scheme_name: str
):

    purpose = scheme_name

    # ==================================================
    # SCHEME RULES
    # ==================================================

    rules = SCHEME_RULES.get(
        scheme_name
    )

    if rules is None:

        return {

            "eligibility_checked":
                False,

            "eligible":
                False,

            "message":
                "Scheme not supported"
        }

    # ==================================================
    # CONSENT
    # ==================================================

    education_consent = check_consent(

        citizen_id,

        "Education Department",

        "Education",

        purpose
    )

    income_consent = check_consent(

        citizen_id,

        "Income Department",

        "Income",

        purpose
    )

    if (
        not education_consent
        or not income_consent
    ):

        return {

            "eligibility_checked":
                False,

            "eligible":
                False,

            "message":
                "Required consent has not been granted"
        }

    # ==================================================
    # EDUCATION DATA
    # ==================================================

    education = (
        supabase
        .table("education_records")
        .select("*")
        .eq(
            "citizen_ref",
            citizen_id
        )
        .execute()
    )

    # ==================================================
    # INCOME DATA
    # ==================================================

    income = (
        supabase
        .table("income_records")
        .select("*")
        .eq(
            "beneficiary_ref",
            citizen_id
        )
        .execute()
    )

    # ==================================================
    # DATA EXISTENCE
    # ==================================================

    if (
        not education.data
        or not income.data
    ):

        return {

            "eligibility_checked":
                False,

            "eligible":
                False,

            "message":
                "Required department data not found"
        }

    education_record = (
        education.data[0]
    )

    income_record = (
        income.data[0]
    )

    # ==================================================
    # INCOME CHECK
    # ==================================================

    income_eligible = (

        income_record[
            "annual_income_inr"
        ]

        <= rules[
            "income_limit"
        ]
    )

    # ==================================================
    # STUDENT STATUS CHECK
    # ==================================================

    student_eligible = (

        education_record[
            "student_status"
        ]
        .strip()
        .upper()

        == rules[
            "student_status"
        ]
    )

    # ==================================================
    # FINAL ELIGIBILITY
    # ==================================================

    eligible = (

        income_eligible
        and student_eligible
    )

    return {

        "eligibility_checked":
            True,

        "eligible":
            eligible,

        "scheme":
            scheme_name,

        "criteria": {

            "income_limit":
                rules["income_limit"],

            "annual_income":
                income_record[
                    "annual_income_inr"
                ],

            "income_eligible":
                income_eligible,

            "required_student_status":
                rules[
                    "student_status"
                ],

            "student_status":
                education_record[
                    "student_status"
                ],

            "student_eligible":
                student_eligible
        }
    }


# ==================================================
# CITIZEN DASHBOARD
# ==================================================

def get_citizen_dashboard(
    citizen_id: str
):

    # ==================================================
    # CITIZEN
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
    # APPLICATIONS
    # ==================================================

    applications = (
        supabase
        .table("welfare_applications")
        .select("*")
        .eq(
            "applicant_ref",
            citizen_id
        )
        .order(
            "submitted_on",
            desc=True
        )
        .execute()
    )

    for application in applications.data:

        application[
            "application_status"
        ] = normalize_status(
            application[
                "application_status"
            ]
        )

    # ==================================================
    # NOTIFICATIONS
    # ==================================================

    notifications = (
        supabase
        .table("notifications")
        .select("*")
        .eq(
            "citizen_id",
            citizen_id
        )
        .order(
            "created_at",
            desc=True
        )
        .execute()
    )

    # ==================================================
    # CONSENTS
    # ==================================================

    consents = (
        supabase
        .table("consents")
        .select("*")
        .eq(
            "citizen_id",
            citizen_id
        )
        .order(
            "granted_at",
            desc=True
        )
        .execute()
    )

    # ==================================================
    # AUDIT LOGS
    # ==================================================

    audit_logs = (
        supabase
        .table("audit_logs")
        .select("*")
        .eq(
            "citizen_id",
            citizen_id
        )
        .order(
            "timestamp",
            desc=True
        )
        .execute()
    )

    # ==================================================
    # DASHBOARD RESPONSE
    # ==================================================

    return {

        "citizen":
            citizen.data,

        "applications":
            applications.data,

        "notifications":
            notifications.data,

        "consents":
            consents.data,

        "audit_logs":
            audit_logs.data
    }