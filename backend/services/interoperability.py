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

    print("==========================================")
    print("CHECKING CONSENT")
    print("Citizen ID:", citizen_id)
    print("Provider:", data_provider)
    print("Data Type:", data_type)
    print("Purpose:", purpose)
    print("==========================================")


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


    print(
        "Matching consent records:",
        response.data
    )


    # ==================================================
    # NO MATCHING CONSENT
    # ==================================================

    if not response.data:

        print(
            "CONSENT RESULT: NOT GRANTED"
        )

        return False


    # ==================================================
    # CHECK EXPIRY
    # ==================================================

    for consent in response.data:

        expires_at = consent.get(
            "expires_at"
        )


        # ------------------------------------------------
        # NULL expiry = NO EXPIRY
        # ------------------------------------------------

        if expires_at is None:

            print(
                "Consent has no expiry date."
            )

            print(
                "CONSENT RESULT: GRANTED"
            )

            return True


        # ------------------------------------------------
        # Parse expiry date
        # ------------------------------------------------

        try:

            expiry_string = str(
                expires_at
            )


            if "T" in expiry_string:

                expiry_date = (
                    datetime.fromisoformat(
                        expiry_string.replace(
                            "Z",
                            ""
                        )
                    ).date()
                )

            else:

                expiry_date = (
                    datetime.strptime(
                        expiry_string,
                        "%Y-%m-%d"
                    ).date()
                )


        except ValueError:

            print(
                "Unable to parse expiry date:",
                expires_at
            )

            # For this prototype, treat a granted
            # consent with an unparseable expiry as
            # granted rather than silently denying it.

            return True


        # ------------------------------------------------
        # Valid expiry
        # ------------------------------------------------

        if (
            expiry_date
            >= datetime.today().date()
        ):

            print(
                "Consent is still valid."
            )

            print(
                "CONSENT RESULT: GRANTED"
            )

            return True


    print(
        "CONSENT RESULT: EXPIRED"
    )

    return False


# ==================================================
# CHECK ALL SCHOLARSHIP CONSENTS
# ==================================================

def check_required_consents(
    citizen_id,
    purpose
):

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


    missing_consents = []


    if not education_consent:

        missing_consents.append({

            "department":
                "Education Department",

            "data_provider":
                "Education Department",

            "data_type":
                "Education",

            "purpose":
                purpose

        })


    if not income_consent:

        missing_consents.append({

            "department":
                "Income Department",

            "data_provider":
                "Income Department",

            "data_type":
                "Income",

            "purpose":
                purpose

        })


    return {

        "education":
            education_consent,

        "income":
            income_consent,

        "all_granted":
            len(missing_consents) == 0,

        "missing":
            missing_consents

    }


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

        "citizen":
            citizen.data,

        "education":
            normalized_education,

        "income":
            normalized_income,

        "welfare":
            normalized_welfare,

        "errors": {

            "education":
                education_error,

            "education_validation":
                education_validation_errors,

            "income":
                income_error,

            "income_validation":
                income_validation_errors,

            "welfare":
                welfare_error,

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
    # CHECK REQUIRED CONSENTS
    # ==================================================

    consent_result = check_required_consents(
        citizen_id,
        purpose
    )


    if not consent_result["all_granted"]:

        return {

            "access_granted":
                False,

            "message":
                "Required consent has not been granted",

            "missing_consents":
                consent_result["missing"],

            "missing_departments": [
                item["department"]
                for item in
                consent_result["missing"]
            ]

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

        "access_granted":
            True,

        "purpose":
            purpose,

        "citizen":
            citizen.data,

        "education":
            normalized_education,

        "income":
            normalized_income,

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

    if not status:

        return "SUBMITTED"


    status = (
        status
        .strip()
        .upper()
    )


    status_mapping = {

        "SUBMITTED":
            "SUBMITTED",

        "SUBMIT":
            "SUBMITTED",

        "UNDER REVIEW":
            "UNDER_REVIEW",

        "UNDER_REVIEW":
            "UNDER_REVIEW",

        "REVIEW":
            "UNDER_REVIEW",

        "APPROVED":
            "APPROVED",

        "APPROVE":
            "APPROVED",

        "REJECTED":
            "REJECTED",

        "REJECT":
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
    # CHECK REQUIRED CONSENTS
    # ==================================================

    consent_result = check_required_consents(
        citizen_id,
        purpose
    )


    if not consent_result["all_granted"]:

        return {

            "eligibility_checked":
                False,

            "eligible":
                False,

            "message":
                "Required consent has not been granted",

            "missing_consents":
                consent_result["missing"],

            "missing_departments": [
                item["department"]
                for item in
                consent_result["missing"]
            ]

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

    annual_income = float(
        income_record.get(
            "annual_income_inr",
            0
        )
        or 0
    )


    income_eligible = (

        annual_income
        <= rules[
            "income_limit"
        ]

    )


    # ==================================================
    # STUDENT STATUS CHECK
    # ==================================================

    student_status = (
        str(
            education_record.get(
                "student_status",
                ""
            )
        )
        .strip()
        .upper()
    )


    required_status = (
        rules[
            "student_status"
        ]
        .strip()
        .upper()
    )


    student_eligible = (

        student_status
        == required_status

    )


    # ==================================================
    # FINAL ELIGIBILITY
    # ==================================================

    eligible = (

        income_eligible
        and student_eligible

    )


    reasons = []


    if not income_eligible:

        reasons.append(
            "Annual income exceeds the scheme limit."
        )


    if not student_eligible:

        reasons.append(
            "Student status does not meet the scheme requirement."
        )


    # ==================================================
    # RESPONSE
    # ==================================================

    return {

        "eligibility_checked":
            True,

        "eligible":
            eligible,

        "scheme":
            scheme_name,

        "message": (

            "Citizen is eligible for this scheme"

            if eligible

            else

            "Citizen is not eligible for this scheme"

        ),

        "reasons":
            reasons,

        "citizen":
            supabase
            .table("citizens")
            .select("*")
            .eq(
                "citizen_id",
                citizen_id
            )
            .single()
            .execute()
            .data,

        "criteria": {

            "income_limit":
                rules[
                    "income_limit"
                ],

            "annual_income":
                annual_income,

            "income_eligible":
                income_eligible,

            "required_student_status":
                required_status,

            "student_status":
                student_status,

            "student_eligible":
                student_eligible,

            "education_consent":
                consent_result[
                    "education"
                ],

            "income_consent":
                consent_result[
                    "income"
                ]

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
            application.get(
                "application_status"
            )
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