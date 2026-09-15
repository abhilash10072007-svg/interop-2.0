from services.supabase import supabase


def get_user(user_id: str):

    user_id = user_id.strip()

    response = (
        supabase
        .table("users")
        .select("*")
        .eq("user_id", user_id)
        .single()
        .execute()
    )

    return response.data


def check_role(user_id: str, required_role: str):

    user = get_user(user_id)

    if user is None:
        return False

    user_role = user.get("role")

    if user_role is None:
        return False

    return user_role.strip().upper() == required_role.strip().upper()