from pydantic import BaseModel, field_validator
class SendOtpRequest(BaseModel):
    aadhaar_number: str
    @field_validator("aadhaar_number")
    @classmethod
    def validate_aadhaar_number(cls, value):
        value = value.strip().replace(" ", "")
        if not value.isdigit() or len(value) != 12:
            raise ValueError("Aadhaar number is invalid. It should be a 12-digit number.")
        return value
class SendOtpResponse(BaseModel):
    success: bool
    message: str
    demo_otp: str | None = None
class VerifyOtpRequest(BaseModel):
    aadhaar_number: str
    otp: str
    @field_validator("aadhaar_number")
    @classmethod
    def validate_aadhaar_number(cls, value):
        value = value.strip().replace(" ", "")
        if not value.isdigit() or len(value) != 12:
            raise ValueError("Aadhaar number is invalid. It should be a 12-digit number.")
        return value
class VerifyOtpResponse(BaseModel):
    success: bool
    message: str
    citizen_profile: dict | None = None
    session_token: str | None = None