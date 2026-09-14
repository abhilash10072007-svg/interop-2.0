from fastapi import APIRouter, Depends, HTTPException

from models import ApplyRequest, ApplyResponse, ApplicationOut
from application_store import apply_for_scheme, list_applications_for_citizen, get_application
from auth_utils import get_current_citizen

router = APIRouter(prefix="/applications", tags=["applications"])


@router.post("/apply", response_model=ApplyResponse)
def apply(request: ApplyRequest, citizen_id: str = Depends(get_current_citizen)):
    result = apply_for_scheme(citizen_id, request.scheme_name)
    return ApplyResponse(**result)


@router.get("/my")
def my_applications(citizen_id: str = Depends(get_current_citizen)):
    return list_applications_for_citizen(citizen_id)


@router.get("/{application_id}")
def get_one(application_id: str, citizen_id: str = Depends(get_current_citizen)):
    record = get_application(application_id)
    if record is None or record["citizen_id"] != citizen_id:
        raise HTTPException(status_code=404, detail="Application not found.")
    return record
