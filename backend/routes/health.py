from fastapi import APIRouter

router = APIRouter()


@router.get("/departments")
def department_health():

    return {
        "departments": [
            {
                "department": "Education Department",
                "status": "UP",
                "api_version": "v1"
            },
            {
                "department": "Income Department",
                "status": "UP",
                "api_version": "v1"
            },
            {
                "department": "Welfare Department",
                "status": "UP",
                "api_version": "v1"
            }
        ]
    }