from datetime import datetime


# ==================================================
# CITIZEN VALIDATION
# ==================================================

def validate_citizen_data(data):

    errors = []

    if not data.get("citizen_id"):
        errors.append("Citizen ID is required")

    if not data.get("name"):
        errors.append("Name is required")

    dob = data.get("date_of_birth")

    if not dob:
        errors.append("Date of birth is required")

    else:

        try:

            datetime.strptime(
                dob,
                "%Y-%m-%d"
            )

        except ValueError:

            errors.append(
                "Date of birth must use YYYY-MM-DD format"
            )

    if not data.get("phone"):
        errors.append("Phone number is required")

    return {
        "valid": len(errors) == 0,
        "errors": errors
    }


# ==================================================
# INCOME VALIDATION
# ==================================================

def validate_income_data(data):

    errors = []

    if not data.get("citizen_id"):
        errors.append("Citizen ID is required")

    income = data.get("annual_income")

    if income is None:

        errors.append(
            "Annual income is required"
        )

    elif income < 0:

        errors.append(
            "Annual income cannot be negative"
        )

    verification_status = data.get(
        "verification_status"
    )

    if not verification_status:

        errors.append(
            "Verification status is required"
        )

    return {
        "valid": len(errors) == 0,
        "errors": errors
    }


# ==================================================
# EDUCATION VALIDATION
# ==================================================

def validate_education_data(data):

    errors = []

    if not data.get("citizen_id"):
        errors.append("Citizen ID is required")

    if not data.get("institution"):
        errors.append("Institution is required")

    if not data.get("course"):
        errors.append("Course is required")

    if not data.get("status"):
        errors.append("Student status is required")

    return {
        "valid": len(errors) == 0,
        "errors": errors
    }


# ==================================================
# WELFARE VALIDATION
# ==================================================

def validate_welfare_data(data):

    errors = []

    if not data.get("citizen_id"):
        errors.append("Citizen ID is required")

    if not data.get("name"):
        errors.append("Applicant name is required")

    if not data.get("date_of_birth"):
        errors.append("Date of birth is required")

    if not data.get("scheme"):
        errors.append("Scheme name is required")

    if not data.get("submitted_on"):
        errors.append("Submission date is required")

    if not data.get("status"):
        errors.append("Application status is required")

    return {
        "valid": len(errors) == 0,
        "errors": errors
    }