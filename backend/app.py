"""
FastAPI application for AI Text Detection.

Endpoints:
    POST /api/analyze  — Analyze text for AI detection
    GET  /api/health   — Health check
"""
import os
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from models import AnalyzeRequest, AnalyzeResponse, HealthResponse
from detector import detector

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load the AI model at startup, cleanup on shutdown."""
    logger.info("Starting up — loading AI detection model...")
    try:
        detector.load_model()
        logger.info("AI detection model ready.")
    except Exception as e:
        logger.error(f"Failed to load model on startup: {e}")
        # Don't crash — let health check report model status
    yield
    logger.info("Shutting down.")


# Create FastAPI app
app = FastAPI(
    title="AI Detection API",
    description="Analyze text to determine if it was written by AI or a human.",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS — allow all origins by default, or read from env
allowed_origins = os.getenv("ALLOWED_ORIGINS", "*")
if allowed_origins == "*":
    origins = ["*"]
else:
    origins = [origin.strip() for origin in allowed_origins.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/api/analyze", response_model=AnalyzeResponse)
async def analyze_text(request: AnalyzeRequest):
    """
    Analyze text to detect whether it was AI-generated or human-written.

    Returns prediction, confidence, probability breakdown,
    supplemental metrics, and explanatory observations.
    """
    if not detector.is_loaded:
        raise HTTPException(
            status_code=503,
            detail="AI model is still loading. Please try again in a moment.",
        )

    try:
        result = detector.analyze(request.text)
        return AnalyzeResponse(**result)
    except Exception as e:
        logger.error(f"Analysis error: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="An error occurred during analysis. Please try again.",
        )


@app.get("/api/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint — reports server and model status."""
    return HealthResponse(
        status="ok",
        model_loaded=detector.is_loaded,
    )
