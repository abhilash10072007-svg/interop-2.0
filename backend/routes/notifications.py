from fastapi import APIRouter
from services.supabase import supabase
from datetime import datetime
import uuid

router = APIRouter()


@router.post("/create")
def create_notification(
    citizen_id: str,
    event_type: str,
    message: str
):

    notification = {
        "notification_id": f"NOT-{uuid.uuid4().hex[:8].upper()}",
        "citizen_id": citizen_id,
        "event_type": event_type,
        "message": message,
        "read_status": "UNREAD",
        "created_at": datetime.now().isoformat()
    }

    response = (
        supabase
        .table("notifications")
        .insert(notification)
        .execute()
    )

    return {
        "message": "Notification created successfully",
        "notification": response.data
    }


@router.get("/{citizen_id}")
def get_notifications(citizen_id: str):

    response = (
        supabase
        .table("notifications")
        .select("*")
        .eq("citizen_id", citizen_id)
        .order("created_at", desc=True)
        .execute()
    )

    return {
        "citizen_id": citizen_id,
        "notifications": response.data
    }