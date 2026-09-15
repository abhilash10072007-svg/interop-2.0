from services.exceptions import (
    DepartmentUnavailableException
)


# ==================================================
# DEPARTMENT CALL
# ==================================================

def call_department(
    department_name,
    operation
):

    try:

        return operation()

    except Exception:

        raise DepartmentUnavailableException(
            department_name
        )


# ==================================================
# SAFE DEPARTMENT CALL
# ==================================================

def call_department_safe(
    department_name,
    operation
):

    try:

        result = operation()

        return {
            "success": True,
            "data": result,
            "error": None
        }

    except Exception as e:

        return {
            "success": False,
            "data": None,
            "error": {
                "error_code":
                    "DEPARTMENT_UNAVAILABLE",

                "department":
                    department_name,

                "message":
                    str(e)
            }
        }