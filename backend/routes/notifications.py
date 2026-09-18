from fastapi import APIRouter
from services.supabase import supabase
from datetime import datetime
import uuid

router = APIRouter()


# ============================================================
# CREATE NOTIFICATION
# ============================================================

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
        "success": True,
        "message": "Notification created successfully",
        "notification": response.data[0] if response.data else None
    }


# ============================================================
# GET CITIZEN NOTIFICATIONS
# ============================================================

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


# ============================================================
# MARK ONE NOTIFICATION AS READ
# ============================================================

@router.put("/{notification_id}/read")
def mark_notification_read(notification_id: str):

    response = (
        supabase
        .table("notifications")
        .update({
            "read_status": "READ"
        })
        .eq("notification_id", notification_id)
        .execute()
    )

    if not response.data:
        return {
            "success": False,
            "message": "Notification not found",
            "notification": None
        }

    return {
        "success": True,
        "message": "Notification marked as read",
        "notification": response.data[0]
    }


# ============================================================
# MARK ALL CITIZEN NOTIFICATIONS AS READ
# ============================================================

@router.put("/{citizen_id}/read-all")
def mark_all_notifications_read(citizen_id: str):

    response = (
        supabase
        .table("notifications")
        .update({
            "read_status": "READ"
        })
        .eq("citizen_id", citizen_id)
        .eq("read_status", "UNREAD")
        .execute()
    )

    return {
        "success": True,
        "message": "All notifications marked as read",
        "updated_count": len(response.data or [])
    }