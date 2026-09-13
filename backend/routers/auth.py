from fastapi import APIRouter, Depends, HTTPException

from models import (
    SendOtpRequest,
    SendOtpResponse,
    VerifyOtpRequest,
    VerifyOtpResponse,
)
from otp_store import (
    generate_otp,
    valid_otp,
    get_citizen_profile,
    get_citizen_profile_by_id,
    is_rate_limited,
)
from auth_utils import create_access_token, get_current_citizen

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/send-otp", response_model=SendOtpResponse)
def send_otp(request: SendOtpRequest):
    if is_rate_limited(request.aadhaar_number):
        raise HTTPException(
            status_code=429,
            detail="Too many OTP requests. Please try again after some time.",
        )
    otp = generate_otp(request.aadhaar_number)
    return SendOtpResponse(
        success=True,
        message="OTP sent successfully.",
        demo_otp=otp,
    )


@router.post("/verify-otp", response_model=VerifyOtpResponse)
def verify_otp_route(request: VerifyOtpRequest):
    is_valid = valid_otp(request.aadhaar_number, request.otp)
    if not is_valid:
        return VerifyOtpResponse(
            success=False,
            message="Invalid or expired OTP.",
        )
    profile = get_citizen_profile(request.aadhaar_number)
    if profile is None:
        return VerifyOtpResponse(
            success=False,
            message="No citizen record found for this Aadhaar number.",
        )
    session_token = create_access_token(profile["citizen_id"])
    return VerifyOtpResponse(
        success=True,
        message="Login successful.",
        citizen_profile=profile,
        session_token=session_token,
    )


@router.get("/me")
def get_me(citizen_id: str = Depends(get_current_citizen)):
    profile = get_citizen_profile_by_id(citizen_id)
    if profile is None:
        raise HTTPException(status_code=404, detail="Citizen not found")
    return profile