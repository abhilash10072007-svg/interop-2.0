from fastapi import APIRouter
from services.supabase import supabase
from datetime import datetime
import uuid

router = APIRouter()


@router.post("/log")
def create_audit_log(
    user_id: str,
    citizen_id: str,
    action: str,
    purpose: str,
    status: str
):

    audit_log = {
        "log_id": f"AUD-{uuid.uuid4().hex[:8].upper()}",
        "user_id": user_id,
        "citizen_id": citizen_id,
        "action": action,
        "purpose": purpose,
        "status": status,
        "timestamp": datetime.now().isoformat()
    }

    response = (
        supabase
        .table("audit_logs")
        .insert(audit_log)
        .execute()
    )

    return {
        "message": "Audit log created successfully",
        "audit_log": response.data
    }


@router.get("/{citizen_id}")
def get_audit_logs(citizen_id: str):

    response = (
        supabase
        .table("audit_logs")
        .select("*")
        .eq("citizen_id", citizen_id)
        .order("timestamp", desc=True)
        .execute()
    )

    return {
        "citizen_id": citizen_id,
        "audit_logs": response.data
    }