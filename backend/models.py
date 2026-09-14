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
    is_new_user: bool = False
class SignupRequest(BaseModel):
    aadhaar_number: str
    name: str
    dob: str
    phone: str
    email: str
    address_line1: str
    district: str
    state: str
    pincode: str

    @field_validator("aadhaar_number")
    @classmethod
    def validate_aadhaar_number(cls, value):
        value = value.strip().replace(" ", "")
        if not value.isdigit() or len(value) != 12:
            raise ValueError("Aadhaar number is invalid. It should be a 12-digit number.")
        return value


class SignupResponse(BaseModel):
    success: bool
    message: str
    citizen_profile: dict | None = None
    session_token: str | None = None

class ConsentRequest(BaseModel):
    grantee: str          # e.g. "Ration Office"
    data_scope: list[str] # e.g. ["income", "address"]
    duration_minutes: int = 60


class ConsentResponse(BaseModel):
    success: bool
    message: str
    consent_id: str | None = None
    expires_at: str | None = None


class ConsentOut(BaseModel):
    consent_id: str
    citizen_id: str
    grantee: str
    data_scope: list[str]
    granted_at: str
    expires_at: str
    revoked: bool


class RevokeResponse(BaseModel):
    success: bool
    message: str

class ApplyRequest(BaseModel):
    scheme_name: str


class ApplyResponse(BaseModel):
    success: bool
    message: str
    application_id: str | None = None
    status: str | None = None


class ApplicationOut(BaseModel):
    application_id: str
    citizen_id: str
    scheme_name: str
    status: str
    reason: str | None = None
    created_at: str
