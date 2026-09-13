from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers.auth import router as auth_router

app = FastAPI(title="GovConnect Auth Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth_router)
@app.get("/health")
def health_check():
    return {"status": "ok"}