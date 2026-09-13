import os
from datetime import datetime, timedelta, timezone

from dotenv import load_dotenv
from jose import jwt, JWTError
from fastapi import Header, HTTPException, status

load_dotenv()

SECRET_KEY = os.getenv("JWT_SECRET_KEY")
ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
TOKEN_EXPIRY_MINUTES = int(os.getenv("JWT_EXPIRY_MINUTES", "60"))

if not SECRET_KEY:
    raise RuntimeError("JWT_SECRET_KEY is not set. Check your .env file.")


def create_access_token(citizen_id: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=TOKEN_EXPIRY_MINUTES)
    payload = {
        "sub": citizen_id,
        "exp": expire,
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def decode_access_token(token: str) -> str | None:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload.get("sub")
    except JWTError:
        return None


def get_current_citizen(authorization: str = Header(...)) -> str:
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header",
        )
    token = authorization.removeprefix("Bearer ")
    citizen_id = decode_access_token(token)
    if citizen_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )
    return citizen_id