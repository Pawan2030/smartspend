from dotenv import load_dotenv
import os

# Load environment variables BEFORE importing anything that uses them
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import init_db
from routes.receipts import router as receipts_router


app = FastAPI(title="SmartSpend API")


frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost",
        "http://127.0.0.1",
        "http://localhost:5173",
        frontend_url,
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# TEMP: Skip database initialization for deployment testing
init_db()


# Register routes
app.include_router(receipts_router)


@app.get("/")
def root():
    return {
        "message": "SmartSpend API is running 🚀"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }
