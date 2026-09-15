from fastapi import APIRouter
from services.auth import get_user, check_role

router = APIRouter()


@router.get("/{user_id}")
def get_user_details(user_id: str):

    user = get_user(user_id)

    return {
        "user": user
    }


@router.get("/{user_id}/check-role")
def check_user_role(
    user_id: str,
    required_role: str
):

    allowed = check_role(
        user_id,
        required_role
    )

    return {
        "user_id": user_id,
        "required_role": required_role,
        "access_granted": allowed
    }