from datetime import datetime, date

from services.supabase import supabase


# ============================================================
# DATE HELPERS
# ============================================================

def normalize_date(date_value, date_format=None):
    """
    Normalize different date formats into YYYY-MM-DD.
    """

    if not date_value:
        return None

    if isinstance(date_value, datetime):
        return date_value.date().isoformat()

    if isinstance(date_value, date):
        return date_value.isoformat()

    value = str(date_value).strip()

    formats = []

    if date_format:
        formats.append(date_format)

    formats.extend([
        "%Y-%m-%d",
        "%Y-%m-%dT%H:%M:%S",
        "%Y-%m-%dT%H:%M:%S.%f",
        "%d-%m-%Y",
        "%d/%m/%Y",
        "%m/%d/%Y",
    ])

    for fmt in formats:
        try:
            return datetime.strptime(value, fmt).date().isoformat()
        except ValueError:
            continue

    return None


def parse_date_value(value):
    """
    Convert a date/timestamp into Python date.
    """

    if not value:
        return None

    if isinstance(value, datetime):
        return value.date()

    if isinstance(value, date):
        return value

    value = str(value).strip()

    formats = [
        "%Y-%m-%d",
        "%Y-%m-%dT%H:%M:%S",
        "%Y-%m-%dT%H:%M:%S.%f",
        "%d-%m-%Y",
        "%d/%m/%Y",
        "%m/%d/%Y",
    ]

    for fmt in formats:
        try:
            return datetime.strptime(value[:26], fmt).date()
        except ValueError:
            continue

    return None


def calculate_age(dob):
    """
    Calculate exact age from date of birth.
    """

    dob = parse_date_value(dob)

    if not dob:
        return None

    today = date.today()

    age = today.year - dob.year

    if (today.month, today.day) < (dob.month, dob.day):
        age -= 1

    return age


def days_since(value):
    """
    Calculate number of days since supplied date.
    """

    parsed = parse_date_value(value)

    if not parsed:
        return None

    return (date.today() - parsed).days


# ============================================================
# SAFE CITIZEN LOOKUP
# ============================================================

def get_citizen_record(citizen_id):
    response = (
        supabase
        .table("citizens")
        .select("*")
        .eq("citizen_id", citizen_id)
        .execute()
    )

    if not response.data:
        return None

    return response.data[0]


# ============================================================
# NORMALIZATION
# ============================================================

def normalize_education(record):

    errors = []

    if not record:
        return {
            "valid": False,
            "data": None,
            "errors": ["Education record is empty"],
        }

    student_id = record.get("student_id")
    citizen_ref = record.get("citizen_ref")
    student_name = record.get("student_name")
    institution = record.get("institution")
    course = record.get("course")
    academic_year = record.get("academic_year")
    student_status = record.get("student_status")

    if not student_id:
        errors.append("Missing student_id")

    if not citizen_ref:
        errors.append("Missing citizen_ref")

    if not student_name:
        errors.append("Missing student_name")

    if not institution:
        errors.append("Missing institution")

    if not course:
        errors.append("Missing course")

    if not academic_year:
        errors.append("Missing academic_year")

    if not student_status:
        errors.append("Missing student_status")

    normalized = {
        "student_id": student_id,
        "citizen_id": citizen_ref,
        "student_name": student_name,
        "institution": institution,
        "course": course,
        "academic_year": academic_year,
        "student_status": (
            str(student_status).upper()
            if student_status
            else None
        ),
    }

    return {
        "valid": len(errors) == 0,
        "data": normalized,
        "errors": errors,
    }


def normalize_income(record):

    errors = []

    if not record:
        return {
            "valid": False,
            "data": None,
            "errors": ["Income record is empty"],
        }

    beneficiary_id = record.get("beneficiary_id")
    citizen_ref = record.get("beneficiary_ref")
    name = record.get("name")
    dob = record.get("dob")
    annual_income = record.get("annual_income_inr")
    income_source = record.get("income_source")
    verification_flag = record.get("verification_flag")

    if not beneficiary_id:
        errors.append("Missing beneficiary_id")

    if not citizen_ref:
        errors.append("Missing beneficiary_ref")

    if not name:
        errors.append("Missing name")

    if annual_income is None:
        errors.append("Missing annual_income_inr")

    normalized_dob = normalize_date(dob)

    if dob and not normalized_dob:
        errors.append("Invalid date of birth")

    try:
        normalized_income = (
            float(annual_income)
            if annual_income is not None
            else None
        )
    except (TypeError, ValueError):
        normalized_income = None
        errors.append("Invalid annual_income_inr")

    normalized = {
        "beneficiary_id": beneficiary_id,
        "citizen_id": citizen_ref,
        "name": name,
        "dob": normalized_dob,
        "annual_income_inr": normalized_income,
        "income_source": income_source,
        "verification_flag": (
            str(verification_flag).upper()
            if verification_flag
            else None
        ),
    }

    return {
        "valid": len(errors) == 0,
        "data": normalized,
        "errors": errors,
    }


def normalize_welfare(record):

    errors = []

    if not record:
        return {
            "valid": False,
            "data": None,
            "errors": ["Welfare record is empty"],
        }

    application_id = record.get("application_id")
    applicant_ref = record.get("applicant_ref")
    applicant_name = record.get("applicant_name")
    birth_date = record.get("birth_date")
    scheme_name = record.get("scheme_name")
    submitted_on = record.get("submitted_on")
    application_status = record.get("application_status")

    if not application_id:
        errors.append("Missing application_id")

    if not applicant_ref:
        errors.append("Missing applicant_ref")

    if not applicant_name:
        errors.append("Missing applicant_name")

    if not scheme_name:
        errors.append("Missing scheme_name")

    normalized_birth_date = normalize_date(birth_date)

    if birth_date and not normalized_birth_date:
        errors.append("Invalid birth_date")

    normalized_submitted_on = normalize_date(submitted_on)

    if submitted_on and not normalized_submitted_on:
        errors.append("Invalid submitted_on")

    normalized = {
        "application_id": application_id,
        "citizen_id": applicant_ref,
        "applicant_name": applicant_name,
        "birth_date": normalized_birth_date,
        "scheme_name": scheme_name,
        "submitted_on": normalized_submitted_on,
        "application_status": (
            str(application_status).upper()
            if application_status
            else None
        ),
    }

    return {
        "valid": len(errors) == 0,
        "data": normalized,
        "errors": errors,
    }


# ============================================================
# STATUS NORMALIZATION
# ============================================================

def normalize_status(status):

    if not status:
        return None

    value = str(status).strip().upper()

    mappings = {
        "PENDING": "UNDER_REVIEW",
        "PROCESSING": "UNDER_REVIEW",
        "IN_PROGRESS": "UNDER_REVIEW",
        "UNDER REVIEW": "UNDER_REVIEW",
        "UNDER-REVIEW": "UNDER_REVIEW",

        "VERIFICATION": "UNDER_VERIFICATION",
        "UNDER VERIFICATION": "UNDER_VERIFICATION",
        "UNDER-VERIFICATION": "UNDER_VERIFICATION",

        "APPROVE": "APPROVED",
        "REJECT": "REJECTED",
    }

    return mappings.get(value, value)


# ============================================================
# CONSENT
# ============================================================

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
        .eq("citizen_id", citizen_id)
        .eq("data_provider", data_provider)
        .eq("data_type", data_type)
        .eq("purpose", purpose)
        .eq("status", "GRANTED")
        .execute()
    )

    if not response.data:
        return False

    for consent in response.data:

        expires_at = consent.get("expires_at")

        # NULL expiry means consent has no expiry.
        if expires_at is None:
            return True

        expiry_date = parse_date_value(expires_at)

        # Prototype behavior:
        # If expiry cannot be parsed, treat granted consent as valid.
        if expiry_date is None:
            return True

        if expiry_date >= date.today():
            return True

    return False


def check_required_consents(citizen_id, purpose):

    required = [
        {
            "department": "Education Department",
            "data_provider": "Education Department",
            "data_type": "Education",
            "purpose": purpose,
        },
        {
            "department": "Income Department",
            "data_provider": "Income Department",
            "data_type": "Income",
            "purpose": purpose,
        },
    ]

    missing = []

    education = False
    income = False

    for item in required:

        granted = check_consent(
            citizen_id,
            item["data_provider"],
            item["data_type"],
            item["purpose"],
        )

        if item["data_type"] == "Education":
            education = granted

        if item["data_type"] == "Income":
            income = granted

        if not granted:
            missing.append(item)

    return {
        "education": education,
        "income": income,
        "all_granted": len(missing) == 0,
        "missing": missing,
    }


# ============================================================
# UNIFIED CITIZEN
# ============================================================

def get_unified_citizen(citizen_id):

    citizen_response = (
        supabase
        .table("citizens")
        .select("*")
        .eq("citizen_id", citizen_id)
        .execute()
    )

    if not citizen_response.data:
        return {
            "citizen": None,
            "education": [],
            "income": [],
            "welfare": [],
            "errors": {
                "citizen": "Citizen not found"
            },
        }

    citizen = citizen_response.data[0]

    education_response = (
        supabase
        .table("education_records")
        .select("*")
        .eq("citizen_ref", citizen_id)
        .execute()
    )

    income_response = (
        supabase
        .table("income_records")
        .select("*")
        .eq("beneficiary_ref", citizen_id)
        .execute()
    )

    welfare_response = (
        supabase
        .table("welfare_applications")
        .select("*")
        .eq("applicant_ref", citizen_id)
        .execute()
    )

    education = []
    education_errors = []

    for record in education_response.data or []:

        result = normalize_education(record)

        if result["valid"]:
            education.append(result["data"])
        else:
            education_errors.extend(result["errors"])

    income = []
    income_errors = []

    for record in income_response.data or []:

        result = normalize_income(record)

        if result["valid"]:
            income.append(result["data"])
        else:
            income_errors.extend(result["errors"])

    welfare = []
    welfare_errors = []

    for record in welfare_response.data or []:

        result = normalize_welfare(record)

        if result["valid"]:
            welfare.append(result["data"])
        else:
            welfare_errors.extend(result["errors"])

    return {
        "citizen": citizen,
        "education": education,
        "income": income,
        "welfare": welfare,
        "errors": {
            "education": education_errors,
            "income": income_errors,
            "welfare": welfare_errors,
        },
    }


# ============================================================
# SCHOLARSHIP DATA
# ============================================================

def get_scholarship_data(citizen_id):

    consent = check_required_consents(
        citizen_id,
        "Education Scholarship"
    )

    if not consent["all_granted"]:

        return {
            "data_available": False,
            "message": "Required consent has not been granted",
            "missing_consents": consent["missing"],
            "missing_departments": [
                item["department"]
                for item in consent["missing"]
            ],
        }

    education_response = (
        supabase
        .table("education_records")
        .select("*")
        .eq("citizen_ref", citizen_id)
        .execute()
    )

    income_response = (
        supabase
        .table("income_records")
        .select("*")
        .eq("beneficiary_ref", citizen_id)
        .execute()
    )

    education = []

    for record in education_response.data or []:

        result = normalize_education(record)

        if result["valid"]:
            education.append(result["data"])

    income = []

    for record in income_response.data or []:

        result = normalize_income(record)

        if result["valid"]:
            income.append(result["data"])

    return {
        "data_available": True,
        "education": education,
        "income": income,
        "message": "Scholarship data retrieved successfully",
    }


# ============================================================
# SCHEME RULES
# ============================================================

SCHEME_RULES = {

    "Education Scholarship": {
        "income_limit": 250000,
        "student_status": "ACTIVE",
    },

    "Student Assistance": {
        "income_limit": 300000,
        "student_status": "ACTIVE",
    },

    "Driving License": {
        "minimum_age": 18,
        "gearless_minimum_age": 16,
        "learner_license_days": 30,
    },

    "Income Certificate": {
        "minimum_residency_years": 3,
        "certificate_validity_days": 365,
    },

    "Caste Certificate": {
        "required_state": "Tamil Nadu",
    },

    "Vehicle Registration": {
        "require_invoice": True,
        "require_insurance": True,
        "require_puc": True,
    },

    "Personal Loan": {
        "minimum_age": 21,
        "maximum_age": 58,
        "minimum_annual_income": 180000,
    },
}


# ============================================================
# SCHOLARSHIP ELIGIBILITY
# ============================================================

def check_scholarship_eligibility(
    citizen_id,
    scheme_name
):

    citizen = get_citizen_record(citizen_id)

    if not citizen:

        return {
            "eligibility_checked": True,
            "eligible": False,
            "message": "Citizen not found",
            "reasons": [
                "Citizen record does not exist"
            ],
        }

    consent = check_required_consents(
        citizen_id,
        scheme_name
    )

    if not consent["all_granted"]:

        return {
            "eligibility_checked": False,
            "eligible": False,
            "message": "Required consent has not been granted",
            "missing_consents": consent["missing"],
            "missing_departments": [
                item["department"]
                for item in consent["missing"]
            ],
        }

    rules = SCHEME_RULES.get(
        scheme_name,
        SCHEME_RULES["Education Scholarship"]
    )

    education_response = (
        supabase
        .table("education_records")
        .select("*")
        .eq("citizen_ref", citizen_id)
        .execute()
    )

    income_response = (
        supabase
        .table("income_records")
        .select("*")
        .eq("beneficiary_ref", citizen_id)
        .execute()
    )

    education = None
    income = None

    if education_response.data:

        result = normalize_education(
            education_response.data[0]
        )

        if result["valid"]:
            education = result["data"]

    if income_response.data:

        result = normalize_income(
            income_response.data[0]
        )

        if result["valid"]:
            income = result["data"]

    reasons = []

    if not education:
        reasons.append(
            "Valid education record is required"
        )

    if not income:
        reasons.append(
            "Valid income record is required"
        )

    annual_income = (
        income.get("annual_income_inr")
        if income
        else None
    )

    student_status = (
        education.get("student_status")
        if education
        else None
    )

    income_eligible = False
    student_eligible = False

    if annual_income is not None:

        income_eligible = (
            annual_income <= rules["income_limit"]
        )

        if not income_eligible:

            reasons.append(
                f"Annual income exceeds "
                f"₹{rules['income_limit']:,.0f}"
            )

    if student_status:

        student_eligible = (
            student_status.upper()
            == rules["student_status"].upper()
        )

        if not student_eligible:

            reasons.append(
                f"Student status must be "
                f"{rules['student_status']}"
            )

    eligible = len(reasons) == 0

    return {
        "eligibility_checked": True,
        "eligible": eligible,
        "scheme": scheme_name,
        "message": (
            "Citizen is eligible for this scheme"
            if eligible
            else
            "Citizen is not eligible for this scheme"
        ),
        "reasons": reasons,
        "citizen": citizen,
        "criteria": {
            "income_limit": rules["income_limit"],
            "annual_income": annual_income,
            "income_eligible": income_eligible,
            "required_student_status": rules["student_status"],
            "student_status": student_status,
            "student_eligible": student_eligible,
            "education_consent": consent["education"],
            "income_consent": consent["income"],
        },
    }


# ============================================================
# DRIVING LICENSE
# ============================================================

def check_driving_license_eligibility(
    citizen_id,
    operation="APPLY",
    license_type="LMV"
):

    citizen = get_citizen_record(citizen_id)

    if not citizen:

        return {
            "eligibility_checked": True,
            "eligible": False,
            "message": "Citizen not found",
            "reasons": [
                "Citizen record does not exist"
            ],
        }

    operation = str(
        operation or "APPLY"
    ).upper()

    license_type = str(
        license_type or "LMV"
    ).upper()

    age = calculate_age(
        citizen.get("dob")
    )

    reasons = []

    # --------------------------------------------------------
    # RENEW
    # --------------------------------------------------------

    if operation == "RENEW":

        response = (
            supabase
            .table("driving_license_records")
            .select("*")
            .eq("citizen_id", citizen_id)
            .execute()
        )

        if not response.data:

            return {
                "eligibility_checked": True,
                "eligible": False,
                "operation": "RENEW",
                "message": "Existing driving license not found",
                "reasons": [
                    "Existing driving license is required"
                ],
            }

        license_record = response.data[0]

        expiry_date = parse_date_value(
            license_record.get("expiry_date")
        )

        days_expired = None

        if expiry_date:
            days_expired = (
                date.today() - expiry_date
            ).days

        suspension_flag = bool(
            license_record.get(
                "suspension_flag",
                False
            )
        )

        court_order_flag = bool(
            license_record.get(
                "court_order_flag",
                False
            )
        )

        if (
            days_expired is not None
            and days_expired > 1825
        ):

            fresh_result = (
                check_driving_license_eligibility(
                    citizen_id=citizen_id,
                    operation="APPLY",
                    license_type=license_type,
                )
            )

            fresh_result["operation"] = "RENEW"
            fresh_result["treated_as_fresh_apply"] = True

            if fresh_result.get("eligible"):

                fresh_result["message"] = (
                    "License expired more than 5 years ago; "
                    "renewal is treated as a fresh application"
                )

            return fresh_result

        if suspension_flag:

            reasons.append(
                "Driving license has an active suspension flag"
            )

        if court_order_flag:

            reasons.append(
                "Driving license has an active court order flag"
            )

        eligible = len(reasons) == 0

        return {
            "eligibility_checked": True,
            "eligible": eligible,
            "operation": "RENEW",
            "message": (
                "Citizen is eligible to renew the driving license"
                if eligible
                else
                "Citizen is not eligible to renew the driving license"
            ),
            "reasons": reasons,
            "criteria": {
                "age": age,
                "license_expiry_date": (
                    license_record.get("expiry_date")
                ),
                "days_expired": days_expired,
                "suspension_flag": suspension_flag,
                "court_order_flag": court_order_flag,
            },
        }

    # --------------------------------------------------------
    # APPLY
    # --------------------------------------------------------

    learner_response = (
        supabase
        .table("learner_license_records")
        .select("*")
        .eq("citizen_id", citizen_id)
        .eq("status", "ACTIVE")
        .execute()
    )

    learner = (
        learner_response.data[0]
        if learner_response.data
        else None
    )

    if license_type == "GEARLESS_TWO_WHEELER":

        if age is None or age < 16:

            reasons.append(
                "Applicant must be at least 16 years old "
                "for a gearless two-wheeler license"
            )

        if age is not None and age < 18:

            if not learner or not learner.get(
                "guardian_consent",
                False
            ):

                reasons.append(
                    "Guardian consent is required "
                    "for applicants below 18"
                )

    else:

        if age is None or age < 18:

            reasons.append(
                "Applicant must be at least 18 years old"
            )

    if not learner:

        reasons.append(
            "Valid active Learner's License is required"
        )

    else:

        learner_days = days_since(
            learner.get("issued_on")
        )

        if (
            learner_days is None
            or learner_days < 30
        ):

            reasons.append(
                "Learner's License must have been "
                "issued at least 30 days ago"
            )

    medical_response = (
        supabase
        .table("medical_fitness_records")
        .select("*")
        .eq("citizen_id", citizen_id)
        .eq("fit", True)
        .execute()
    )

    medical = (
        medical_response.data[0]
        if medical_response.data
        else None
    )

    if not medical:

        reasons.append(
            "Medical fitness declaration is required"
        )

    aadhaar_response = (
        supabase
        .table("aadhaar_records")
        .select("*")
        .eq("citizen_id", citizen_id)
        .eq("address_match", True)
        .eq("verification_status", "VERIFIED")
        .execute()
    )

    aadhaar = (
        aadhaar_response.data[0]
        if aadhaar_response.data
        else None
    )

    if not aadhaar:

        reasons.append(
            "Verified Aadhaar address match is required"
        )

    eligible = len(reasons) == 0

    return {
        "eligibility_checked": True,
        "eligible": eligible,
        "operation": "APPLY",
        "message": (
            "Citizen is eligible for Driving License application"
            if eligible
            else
            "Citizen is not eligible for Driving License application"
        ),
        "reasons": reasons,
        "citizen": citizen,
        "criteria": {
            "age": age,
            "license_type": license_type,
            "minimum_age": (
                16
                if license_type == "GEARLESS_TWO_WHEELER"
                else 18
            ),
            "learner_license_valid": (
                learner is not None
            ),
            "learner_license_days": (
                days_since(
                    learner.get("issued_on")
                )
                if learner
                else None
            ),
            "medical_fitness": (
                medical is not None
            ),
            "aadhaar_address_match": (
                aadhaar is not None
            ),
        },
    }


# ============================================================
# INCOME CERTIFICATE
# ============================================================

def check_income_certificate_eligibility(
    citizen_id,
    issuing_district=None,
    issuing_taluk=None
):

    citizen = get_citizen_record(citizen_id)

    if not citizen:

        return {
            "eligibility_checked": True,
            "eligible": False,
            "message": "Citizen not found",
            "reasons": [
                "Citizen record does not exist"
            ],
        }

    reasons = []

    residency_response = (
        supabase
        .table("residency_records")
        .select("*")
        .eq("citizen_id", citizen_id)
        .execute()
    )

    residency = (
        residency_response.data[0]
        if residency_response.data
        else None
    )

    if not residency:

        reasons.append(
            "Verified residency record is required"
        )

    else:

        if not residency.get("verified", False):

            reasons.append(
                "Residency record has not been verified"
            )

        if not residency.get("state_resident", False):

            reasons.append(
                "Applicant must be a resident of the state"
            )

        residency_years = (
            residency.get("residency_years", 0)
            or 0
        )

        if residency_years < 3:

            reasons.append(
                "Minimum 3 years of residency is required"
            )

        if issuing_district:

            if residency.get("district") != issuing_district:

                reasons.append(
                    "Residency district does not match "
                    "the issuing district"
                )

        if issuing_taluk:

            if residency.get("taluk") != issuing_taluk:

                reasons.append(
                    "Residency taluk does not match "
                    "the issuing taluk"
                )

    income_response = (
        supabase
        .table("income_records")
        .select("*")
        .eq("beneficiary_ref", citizen_id)
        .execute()
    )

    income_record = (
        income_response.data[0]
        if income_response.data
        else None
    )

    income_cross_check = {
        "available": income_record is not None,
        "verified": None,
    }

    if income_record:

        income_cross_check["verified"] = (
            str(
                income_record.get(
                    "verification_flag",
                    ""
                )
            ).upper()
            == "VERIFIED"
        )

    certificate_response = (
        supabase
        .table("income_certificates")
        .select("*")
        .eq("citizen_id", citizen_id)
        .eq("status", "VALID")
        .execute()
    )

    active_certificate = None

    for certificate in (
        certificate_response.data or []
    ):

        expiry_date = parse_date_value(
            certificate.get("expiry_date")
        )

        if (
            expiry_date
            and expiry_date >= date.today()
        ):

            active_certificate = certificate
            break

    if active_certificate:

        reasons.append(
            "A valid Income Certificate already exists"
        )

    eligible = len(reasons) == 0

    return {
        "eligibility_checked": True,
        "eligible": eligible,
        "operation": "APPLY",
        "message": (
            "Citizen is eligible for Income Certificate application"
            if eligible
            else
            "Citizen is not eligible for Income Certificate application"
        ),
        "reasons": reasons,
        "citizen": citizen,
        "criteria": {
            "minimum_residency_years": 3,
            "residency_verified": (
                residency.get("verified", False)
                if residency
                else False
            ),
            "residency_years": (
                residency.get("residency_years")
                if residency
                else None
            ),
            "issuing_district": issuing_district,
            "issuing_taluk": issuing_taluk,
            "income_cross_check": income_cross_check,
            "existing_valid_certificate": (
                active_certificate is not None
            ),
        },
    }


# ============================================================
# CASTE CERTIFICATE
# ============================================================

def check_caste_certificate_eligibility(
    citizen_id
):

    citizen = get_citizen_record(citizen_id)

    if not citizen:

        return {
            "eligibility_checked": True,
            "eligible": False,
            "message": "Citizen not found",
            "reasons": [
                "Citizen record does not exist"
            ],
        }

    reasons = []

    community_response = (
        supabase
        .table("community_records")
        .select("*")
        .eq("citizen_id", citizen_id)
        .eq("official_schedule_match", True)
        .eq("verified", True)
        .execute()
    )

    community = (
        community_response.data[0]
        if community_response.data
        else None
    )

    if not community:

        reasons.append(
            "Community is not verified against "
            "the official state schedule"
        )

    residency_response = (
        supabase
        .table("residency_records")
        .select("*")
        .eq("citizen_id", citizen_id)
        .eq("state_resident", True)
        .eq("verified", True)
        .execute()
    )

    residency = (
        residency_response.data[0]
        if residency_response.data
        else None
    )

    if not residency:

        reasons.append(
            "Verified state residency is required"
        )

    lineage_response = (
        supabase
        .table("caste_lineage_records")
        .select("*")
        .eq("citizen_id", citizen_id)
        .eq("lineage_verified", True)
        .execute()
    )

    lineage_verified = bool(
        lineage_response.data
    )

    revenue_response = (
        supabase
        .table("revenue_verifications")
        .select("*")
        .eq("citizen_id", citizen_id)
        .eq("verified", True)
        .execute()
    )

    revenue_verified = bool(
        revenue_response.data
    )

    if (
        not lineage_verified
        and not revenue_verified
    ):

        reasons.append(
            "Either verified family lineage proof "
            "or Revenue Officer verification is required"
        )

    eligible = len(reasons) == 0

    return {
        "eligibility_checked": True,
        "eligible": eligible,
        "operation": "APPLY",
        "message": (
            "Citizen is eligible for Caste Certificate application"
            if eligible
            else
            "Citizen is not eligible for Caste Certificate application"
        ),
        "reasons": reasons,
        "citizen": citizen,
        "criteria": {
            "community_schedule_match": (
                community is not None
            ),
            "community": (
                community.get("community_name")
                if community
                else None
            ),
            "category": (
                community.get("category")
                if community
                else None
            ),
            "state_residency_verified": (
                residency is not None
            ),
            "lineage_verified": lineage_verified,
            "revenue_officer_verified": revenue_verified,
            "manual_verification_required": True,
        },
    }


# ============================================================
# VEHICLE REGISTRATION
# ============================================================

def check_vehicle_registration_eligibility(
    citizen_id,
    operation="NEW",
    chassis_number=None,
    engine_number=None,
    invoice_present=True,
    insurance_active=True,
    puc_valid=True,
):

    citizen = get_citizen_record(citizen_id)

    if not citizen:

        return {
            "eligibility_checked": True,
            "eligible": False,
            "message": "Citizen not found",
            "reasons": [
                "Citizen record does not exist"
            ],
        }

    operation = str(
        operation or "NEW"
    ).upper()

    reasons = []

    # --------------------------------------------------------
    # NEW
    # --------------------------------------------------------

    if operation == "NEW":

        if not chassis_number:

            reasons.append(
                "Chassis number is required"
            )

        if not engine_number:

            reasons.append(
                "Engine number is required"
            )

        if chassis_number:

            response = (
                supabase
                .table("vehicle_registration_records")
                .select("*")
                .eq(
                    "chassis_number",
                    chassis_number
                )
                .execute()
            )

            if response.data:

                reasons.append(
                    "Chassis number is already registered"
                )

        if engine_number:

            response = (
                supabase
                .table("vehicle_registration_records")
                .select("*")
                .eq(
                    "engine_number",
                    engine_number
                )
                .execute()
            )

            if response.data:

                reasons.append(
                    "Engine number is already registered"
                )

        if not invoice_present:

            reasons.append(
                "Vehicle invoice is required"
            )

        if not insurance_active:

            reasons.append(
                "Active third-party insurance is required"
            )

        if not puc_valid:

            reasons.append(
                "Valid PUC is required"
            )

        eligible = len(reasons) == 0

        return {
            "eligibility_checked": True,
            "eligible": eligible,
            "operation": "NEW",
            "message": (
                "Vehicle is eligible for new registration"
                if eligible
                else
                "Vehicle is not eligible for new registration"
            ),
            "reasons": reasons,
            "criteria": {
                "invoice_present": invoice_present,
                "insurance_active": insurance_active,
                "puc_valid": puc_valid,
                "chassis_number": chassis_number,
                "engine_number": engine_number,
            },
        }

    # --------------------------------------------------------
    # TRANSFER
    # --------------------------------------------------------

    if operation == "TRANSFER":

        vehicle_response = (
            supabase
            .table("vehicle_registration_records")
            .select("*")
            .eq("citizen_id", citizen_id)
            .execute()
        )

        if not vehicle_response.data:

            return {
                "eligibility_checked": True,
                "eligible": False,
                "operation": "TRANSFER",
                "message": "Vehicle record not found",
                "reasons": [
                    "Existing vehicle registration is required"
                ],
            }

        vehicle = vehicle_response.data[0]

        transfer_response = (
            supabase
            .table("vehicle_transfer_records")
            .select("*")
            .eq(
                "vehicle_record_id",
                vehicle.get("vehicle_record_id")
            )
            .execute()
        )

        transfer = (
            transfer_response.data[0]
            if transfer_response.data
            else None
        )

        if not transfer:

            reasons.append(
                "Vehicle transfer record is required"
            )

        else:

            if not transfer.get(
                "buyer_consent",
                False
            ):

                reasons.append(
                    "Buyer consent is required"
                )

            if not transfer.get(
                "seller_consent",
                False
            ):

                reasons.append(
                    "Seller consent is required"
                )

            if transfer.get(
                "stolen_flag",
                False
            ):

                reasons.append(
                    "Vehicle has an active stolen flag"
                )

            if (
                transfer.get(
                    "hypothecation_flag",
                    False
                )
                and not transfer.get(
                    "noc_present",
                    False
                )
            ):

                reasons.append(
                    "NOC is required for a hypothecated vehicle"
                )

            if not transfer.get(
                "road_tax_paid",
                False
            ):

                reasons.append(
                    "Road tax must be paid"
                )

        eligible = len(reasons) == 0

        return {
            "eligibility_checked": True,
            "eligible": eligible,
            "operation": "TRANSFER",
            "message": (
                "Vehicle is eligible for ownership transfer"
                if eligible
                else
                "Vehicle is not eligible for ownership transfer"
            ),
            "reasons": reasons,
            "criteria": {
                "transfer_record_found": (
                    transfer is not None
                ),
            },
        }

    # --------------------------------------------------------
    # UPDATE
    # --------------------------------------------------------

    if operation == "UPDATE":

        vehicle_response = (
            supabase
            .table("vehicle_registration_records")
            .select("*")
            .eq("citizen_id", citizen_id)
            .eq("ownership_match", True)
            .execute()
        )

        ownership_match = bool(
            vehicle_response.data
        )

        if not ownership_match:

            reasons.append(
                "Existing vehicle ownership "
                "could not be verified"
            )

        eligible = len(reasons) == 0

        return {
            "eligibility_checked": True,
            "eligible": eligible,
            "operation": "UPDATE",
            "message": (
                "Vehicle update is permitted"
                if eligible
                else
                "Vehicle update is not permitted"
            ),
            "reasons": reasons,
            "criteria": {
                "ownership_match": ownership_match,
            },
        }

    return {
        "eligibility_checked": True,
        "eligible": False,
        "operation": operation,
        "message": (
            f"Unsupported vehicle operation: {operation}"
        ),
        "reasons": [
            f"Operation '{operation}' is not supported"
        ],
    }


# ============================================================
# PERSONAL LOAN
# ============================================================

def check_personal_loan_eligibility(
    citizen_id,
    declared_income=None
):

    citizen = get_citizen_record(citizen_id)

    if not citizen:

        return {
            "eligibility_checked": True,
            "eligible": False,
            "message": "Citizen not found",
            "reasons": [
                "Citizen record does not exist"
            ],
        }

    rules = SCHEME_RULES["Personal Loan"]

    reasons = []

    # --------------------------------------------------------
    # AGE
    # --------------------------------------------------------

    age = calculate_age(
        citizen.get("dob")
    )

    if age is None:

        reasons.append(
            "Valid date of birth is required"
        )

    elif (
        age < rules["minimum_age"]
        or age > rules["maximum_age"]
    ):

        reasons.append(
            "Applicant age must be between "
            f"{rules['minimum_age']} and "
            f"{rules['maximum_age']} years"
        )

    # --------------------------------------------------------
    # INCOME
    # --------------------------------------------------------

    income_value = None

    if declared_income is not None:

        try:
            income_value = float(
                declared_income
            )
        except (ValueError, TypeError):

            income_value = None

    if income_value is None:

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

        if income_response.data:

            income_record = (
                income_response.data[0]
            )

            raw_income = income_record.get(
                "annual_income_inr"
            )

            if raw_income is not None:

                try:
                    income_value = float(raw_income)
                except (ValueError, TypeError):
                    income_value = None

    minimum_income = rules[
        "minimum_annual_income"
    ]

    if income_value is None:

        reasons.append(
            "Declared or verified annual income is required"
        )

    elif income_value < minimum_income:

        reasons.append(
            f"Annual income must be at least "
            f"₹{minimum_income:,.0f}"
        )

    # --------------------------------------------------------
    # EXISTING LOAN / DEFAULT
    # --------------------------------------------------------

    loan_response = (
        supabase
        .table("loan_records")
        .select("*")
        .eq("citizen_id", citizen_id)
        .execute()
    )

    loan = (
        loan_response.data[0]
        if loan_response.data
        else None
    )

    existing_loan = (
        loan.get(
            "existing_loan",
            False
        )
        if loan
        else False
    )

    default_flag = (
        loan.get(
            "default_flag",
            False
        )
        if loan
        else False
    )

    if default_flag:

        reasons.append(
            "Existing loan default flag is present"
        )

    # --------------------------------------------------------
    # KYC
    # --------------------------------------------------------

    kyc_response = (
        supabase
        .table("kyc_records")
        .select("*")
        .eq("citizen_id", citizen_id)
        .eq("kyc_complete", True)
        .eq("verified", True)
        .execute()
    )

    kyc_complete = bool(
        kyc_response.data
    )

    if not kyc_complete:

        reasons.append(
            "Complete verified KYC is required"
        )

    # --------------------------------------------------------
    # INCOME CERTIFICATE
    # --------------------------------------------------------

    certificate_response = (
        supabase
        .table("income_certificates")
        .select("*")
        .eq("citizen_id", citizen_id)
        .eq("status", "VALID")
        .execute()
    )

    valid_certificate = None

    for certificate in (
        certificate_response.data or []
    ):

        expiry = parse_date_value(
            certificate.get("expiry_date")
        )

        if expiry is None:
            continue

        if expiry >= date.today():

            valid_certificate = certificate
            break

    income_certificate_match = None

    if valid_certificate:

        certificate_income = float(
            valid_certificate.get(
                "annual_income_inr",
                0
            ) or 0
        )

        if income_value is not None:

            income_certificate_match = (
                certificate_income == income_value
            )

            if not income_certificate_match:

                reasons.append(
                    "Declared income does not match "
                    "the valid Income Certificate"
                )

    eligible = len(reasons) == 0

    return {
        "eligibility_checked": True,
        "eligible": eligible,
        "operation": "APPLY",
        "message": (
            "Citizen is eligible for Personal Loan application"
            if eligible
            else
            "Citizen is not eligible for Personal Loan application"
        ),
        "reasons": reasons,
        "citizen": citizen,
        "criteria": {
            "age": age,
            "minimum_age": rules["minimum_age"],
            "maximum_age": rules["maximum_age"],
            "annual_income": income_value,
            "minimum_annual_income": minimum_income,
            "existing_loan": existing_loan,
            "default_flag": default_flag,
            "kyc_complete": kyc_complete,
            "income_certificate_found": (
                valid_certificate is not None
            ),
            "income_certificate_match": (
                income_certificate_match
            ),
            "interoperability_check": (
                "Income Certificate cross-reference performed"
                if valid_certificate
                else
                "No valid Income Certificate available"
            ),
        },
    }


# ============================================================
# PERSONAL LOAN INCOME VERIFICATION
# ============================================================

def verify_personal_loan_income(
    citizen_id: str,
    declared_income=None,
):
    """
    Verify declared income against the latest
    Income Certificate.

    This operation only verifies the income value.
    It does not approve or reject a loan.
    """

    citizen = get_citizen_record(citizen_id)

    if not citizen:

        return {
            "eligibility_checked": True,
            "verification": False,
            "income_certificate_found": False,
            "income_match": False,
            "message": "Citizen not found",
        }

    # --------------------------------------------------------
    # GET INCOME CERTIFICATES
    # --------------------------------------------------------

    certificate_response = (
        supabase
        .table("income_certificates")
        .select("*")
        .eq("citizen_id", citizen_id)
        .order("issued_on", desc=True)
        .execute()
    )

    certificates = certificate_response.data or []

    # --------------------------------------------------------
    # NO CERTIFICATE
    # --------------------------------------------------------

    if not certificates:

        return {
            "eligibility_checked": True,
            "verification": True,
            "income_certificate_found": False,
            "income_match": None,
            "declared_income": declared_income,
            "certificate_income": None,
            "message": (
                "No Income Certificate found; "
                "income cross-reference is unavailable"
            ),
        }

    certificate = certificates[0]

    certificate_income = certificate.get(
        "annual_income_inr"
    )

    certificate_status = str(
        certificate.get("status", "")
    ).upper()

    # --------------------------------------------------------
    # CERTIFICATE INCOME MISSING
    # --------------------------------------------------------

    if certificate_income is None:

        return {
            "eligibility_checked": True,
            "verification": False,
            "income_certificate_found": True,
            "income_match": False,
            "declared_income": declared_income,
            "certificate_income": None,
            "certificate_status": certificate_status,
            "message": (
                "Income Certificate exists but "
                "certified income is unavailable"
            ),
        }

    # --------------------------------------------------------
    # DECLARED INCOME MISSING
    # --------------------------------------------------------

    if declared_income is None:

        return {
            "eligibility_checked": True,
            "verification": False,
            "income_certificate_found": True,
            "income_match": False,
            "declared_income": None,
            "certificate_income": float(
                certificate_income
            ),
            "certificate_status": certificate_status,
            "message": (
                "Declared income is required "
                "for verification"
            ),
        }

    # --------------------------------------------------------
    # COMPARE
    # --------------------------------------------------------

    try:

        declared = float(
            declared_income
        )

        certified = float(
            certificate_income
        )

    except (TypeError, ValueError):

        return {
            "eligibility_checked": True,
            "verification": False,
            "income_certificate_found": True,
            "income_match": False,
            "declared_income": declared_income,
            "certificate_income": certificate_income,
            "certificate_status": certificate_status,
            "message": (
                "Income values could not be compared"
            ),
        }

    income_match = declared == certified

    # Verification means the check was successfully
    # performed. income_match contains the result.
    verification = True

    if income_match:

        message = (
            "Declared income matches Income Certificate"
        )

    else:

        message = (
            "Declared income does not match "
            "Income Certificate"
        )

    return {
        "eligibility_checked": True,
        "verification": verification,
        "income_certificate_found": True,
        "income_match": income_match,
        "declared_income": declared,
        "certificate_income": certified,
        "certificate_status": certificate_status,
        "certificate_id": certificate.get(
            "certificate_id"
        ),
        "certificate_number": certificate.get(
            "certificate_number"
        ),
        "message": message,
    }


# ============================================================
# MAIN ELIGIBILITY DISPATCHER
# ============================================================

def check_eligibility(
    citizen_id,
    scheme_name,
    operation="apply",
    license_type="LMV",
    issuing_district=None,
    issuing_taluk=None,
    chassis_number=None,
    engine_number=None,
    declared_income=None,
    invoice_present=True,
    insurance_active=True,
    puc_valid=True,
):

    operation = str(
        operation or "apply"
    ).upper()

    scheme_name = str(
        scheme_name or ""
    ).strip()

    # --------------------------------------------------------
    # TRACK
    # --------------------------------------------------------

    if operation == "TRACK":

        return {
            "eligibility_checked": False,
            "eligible": None,
            "operation": "TRACK",
            "message": (
                "Tracking operation does not require "
                "eligibility verification"
            ),
        }

    # --------------------------------------------------------
    # PERSONAL LOAN VERIFY
    # IMPORTANT:
    # This MUST come before normal Personal Loan APPLY.
    # --------------------------------------------------------

    if scheme_name == "Personal Loan":

        if operation == "VERIFY":

            return verify_personal_loan_income(
                citizen_id=citizen_id,
                declared_income=declared_income,
            )

        return check_personal_loan_eligibility(
            citizen_id=citizen_id,
            declared_income=declared_income,
        )

    # --------------------------------------------------------
    # DRIVING LICENSE
    # --------------------------------------------------------

    if scheme_name == "Driving License":

        return check_driving_license_eligibility(
            citizen_id=citizen_id,
            operation=operation,
            license_type=license_type,
        )

    # --------------------------------------------------------
    # INCOME CERTIFICATE
    # --------------------------------------------------------

    if scheme_name == "Income Certificate":

        return check_income_certificate_eligibility(
            citizen_id=citizen_id,
            issuing_district=issuing_district,
            issuing_taluk=issuing_taluk,
        )

    # --------------------------------------------------------
    # CASTE CERTIFICATE
    # --------------------------------------------------------

    if scheme_name == "Caste Certificate":

        return check_caste_certificate_eligibility(
            citizen_id=citizen_id
        )

    # --------------------------------------------------------
    # VEHICLE REGISTRATION
    # --------------------------------------------------------

    if scheme_name == "Vehicle Registration":

        return check_vehicle_registration_eligibility(
            citizen_id=citizen_id,
            operation=operation,
            chassis_number=chassis_number,
            engine_number=engine_number,
            invoice_present=invoice_present,
            insurance_active=insurance_active,
            puc_valid=puc_valid,
        )

    # --------------------------------------------------------
    # EDUCATION SCHOLARSHIP / STUDENT ASSISTANCE
    # --------------------------------------------------------

    if scheme_name in [
        "Education Scholarship",
        "Student Assistance",
    ]:

        return check_scholarship_eligibility(
            citizen_id=citizen_id,
            scheme_name=scheme_name,
        )

    # --------------------------------------------------------
    # UNKNOWN SERVICE
    # --------------------------------------------------------

    return {
        "eligibility_checked": False,
        "eligible": False,
        "operation": operation,
        "message": (
            f"Unsupported scheme: {scheme_name}"
        ),
        "reasons": [
            f"No eligibility rules are configured "
            f"for {scheme_name}"
        ],
    }


# ============================================================
# CITIZEN DASHBOARD
# ============================================================

def get_citizen_dashboard(citizen_id: str):

    # ========================================================
    # CITIZEN
    # ========================================================

    citizen_response = (
        supabase
        .table("citizens")
        .select("*")
        .eq("citizen_id", citizen_id)
        .single()
        .execute()
    )

    citizen_data = citizen_response.data

    # ========================================================
    # APPLICATIONS
    # ========================================================

    applications = (
        supabase
        .table("welfare_applications")
        .select("*")
        .eq("applicant_ref", citizen_id)
        .order("submitted_on", desc=True)
        .execute()
    )

    application_data = applications.data or []

    for application in application_data:

        application["application_status"] = normalize_status(
            application.get(
                "application_status",
                "SUBMITTED"
            )
        )

    # ========================================================
    # NOTIFICATIONS
    # ========================================================

    notifications = (
        supabase
        .table("notifications")
        .select("*")
        .eq("citizen_id", citizen_id)
        .order("created_at", desc=True)
        .execute()
    )

    notification_data = (
        notifications.data or []
    )

    # ========================================================
    # CONSENTS
    # ========================================================

    try:

        consents = (
            supabase
            .table("consents")
            .select("*")
            .eq("citizen_id", citizen_id)
            .execute()
        )

        consent_data = (
            consents.data or []
        )

        if consent_data and "granted_at" in consent_data[0]:

            consent_data.sort(
                key=lambda x: x.get(
                    "granted_at"
                ) or "",
                reverse=True
            )

    except Exception as error:

        print(
            "Dashboard consent fetch error:",
            error
        )

        consent_data = []

    # ========================================================
    # AUDIT LOGS
    # ========================================================

    try:

        audit_logs = (
            supabase
            .table("audit_logs")
            .select("*")
            .eq("citizen_id", citizen_id)
            .order("timestamp", desc=True)
            .execute()
        )

        audit_data = (
            audit_logs.data or []
        )

    except Exception as error:

        print(
            "Dashboard audit fetch error:",
            error
        )

        audit_data = []

    # ========================================================
    # DASHBOARD RESPONSE
    # ========================================================

    return {
        "citizen": citizen_data,
        "applications": application_data,
        "notifications": notification_data,
        "consents": consent_data,
        "audit_logs": audit_data,
    }