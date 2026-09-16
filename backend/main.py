from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from services.exceptions import GovSyncException
from services.supabase import supabase
from routes.citizens import router as citizens_router
from routes.consent import router as consent_router
from routes.applications import router as applications_router
from routes.notifications import router as notifications_router
from routes.audit import router as audit_router
from routes.users import router as users_router
from routes.admin import router as admin_router
from routes.health import router as health_router
from routes.validation import router as validation_router
from routes.reconciliation import router as reconciliation_router

from services.department import (
    call_department
)

from services.exceptions import (
    DepartmentUnavailableException
)

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="GovSync API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.exception_handler(GovSyncException)
async def govsync_exception_handler(
    request: Request,
    exc: GovSyncException
):
    return JSONResponse(
        status_code=503,
        content={
            "success": False,
            "error_code": exc.error_code,
            "message": exc.message
        }
    )

@app.get("/")
def home():
    return {
        "message": "GovSync backend is running"
    }

@app.get("/test-db")
def test_db():
    response = (
        supabase
        .table("citizens")
        .select("*")
        .limit(5)
        .execute()
    )

    return response.data

app.include_router(
    citizens_router,
    prefix="/api/citizens",
    tags=["Citizens"]
)


app.include_router(
    consent_router,
    prefix="/api/consent",
    tags=["Consent"]
)


app.include_router(
    applications_router,
    prefix="/api/applications",
    tags=["Applications"]
)
app.include_router(
    notifications_router,
    prefix="/api/notifications",
    tags=["Notifications"]
)

app.include_router(
    audit_router,
    prefix="/api/audit",
    tags=["Audit Logs"]
)
app.include_router(
    users_router,
    prefix="/api/users",
    tags=["Users"]
)

app.include_router(
    admin_router,
    prefix="/api/admin",
    tags=["Admin Dashboard"]
)

app.include_router(
    health_router,
    prefix="/api/health",
    tags=["API Health"]
)

app.include_router(
    validation_router,
    prefix="/api/validation",
    tags=["Data Validation"]
)

app.include_router(
    reconciliation_router,
    prefix="/api/reconciliation",
    tags=["Data Reconciliation"]
)
