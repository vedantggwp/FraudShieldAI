"""
FraudShield API

FastAPI-based fraud detection service that analyzes transactions
and provides risk assessments with AI-generated explanations.
"""

import json
from contextlib import asynccontextmanager
from datetime import datetime
from pathlib import Path

from fastapi import Depends, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from app.config import RISK_THRESHOLDS
from app.models import (
    HealthResponse,
    PaginatedResponse,
    TransactionCreate,
    TransactionDetailResponse,
    TransactionResponse,
)
from app.services.anomaly_detector import (
    AnomalyDetectorProtocol,
    get_anomaly_detector,
)
from app.services.explanation_generator import (
    ExplanationGeneratorProtocol,
    get_explanation_generator,
)
from app.storage import transaction_store


def get_risk_level(score: float) -> str:
    """Map risk score to risk level."""
    if score >= RISK_THRESHOLDS["high"]:
        return "high"
    elif score >= RISK_THRESHOLDS["medium"]:
        return "medium"
    return "low"


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load seed data on startup."""
    seed_file = Path(__file__).parent / "data" / "demo_transactions.json"
    if seed_file.exists():
        with open(seed_file) as f:
            seed_data = json.load(f)

            detector = get_anomaly_detector()
            for item in seed_data:
                # Convert timestamp string to datetime
                if isinstance(item.get("timestamp"), str):
                    item["timestamp"] = datetime.fromisoformat(
                        item["timestamp"].replace("Z", "+00:00")
                    )

                # Calculate risk score and factors
                risk_score, factors = detector.calculate_risk_score(item)
                item["risk_score"] = risk_score
                item["risk_level"] = get_risk_level(risk_score)
                item["factors"] = factors

            count = transaction_store.load_seed_data(seed_data)
            print(f"FraudShield: Loaded {count} seed transactions")
    yield
    print("FraudShield: Shutting down")


# Initialize FastAPI app
app = FastAPI(
    title="FraudShield API",
    description="AI-powered fraud detection for financial transactions",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["Root"])
async def root():
    """API root - service information."""
    return {
        "service": "FraudShield API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health",
    }


@app.get("/health", response_model=HealthResponse, tags=["Health"])
async def health_check():
    """Health check endpoint for Azure App Service."""
    return HealthResponse(status="healthy", service="FraudShield API")


@app.post(
    "/transactions",
    response_model=TransactionResponse,
    status_code=201,
    tags=["Transactions"],
    summary="Submit a new transaction for fraud analysis",
)
async def create_transaction(
    transaction: TransactionCreate,
    detector: AnomalyDetectorProtocol = Depends(get_anomaly_detector),
):
    """
    Submit a new transaction for fraud detection analysis.

    The transaction will be analyzed and assigned a risk score between 0 and 1,
    with a corresponding risk level (high, medium, low).
    """
    # Prepare transaction data
    transaction_data = transaction.model_dump()

    # Calculate risk score
    risk_score, factors = detector.calculate_risk_score(transaction_data)
    risk_level = get_risk_level(risk_score)

    # Add calculated fields
    transaction_data["risk_score"] = risk_score
    transaction_data["risk_level"] = risk_level
    transaction_data["factors"] = factors

    # Store transaction
    transaction_id = transaction_store.add(transaction_data)

    # Retrieve and return
    stored = transaction_store.get(transaction_id)
    return TransactionResponse(
        id=stored["id"],
        amount=stored["amount"],
        payee=stored["payee"],
        timestamp=stored["timestamp"],
        reference=stored["reference"],
        risk_score=stored["risk_score"],
        risk_level=stored["risk_level"],
        created_at=stored["created_at"],
    )


@app.get(
    "/transactions",
    response_model=PaginatedResponse,
    tags=["Transactions"],
    summary="Get all transactions with risk scores",
)
async def list_transactions(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
):
    """
    Retrieve a paginated list of all transactions with their risk scores.

    Results are sorted by creation date (newest first).
    """
    skip = (page - 1) * page_size
    items, total = transaction_store.get_all(skip=skip, limit=page_size)

    total_pages = (total + page_size - 1) // page_size if total > 0 else 0

    return PaginatedResponse(
        items=[
            TransactionResponse(
                id=item["id"],
                amount=item["amount"],
                payee=item["payee"],
                timestamp=item["timestamp"],
                reference=item["reference"],
                risk_score=item["risk_score"],
                risk_level=item["risk_level"],
                created_at=item["created_at"],
            )
            for item in items
        ],
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
    )


@app.get(
    "/transactions/{transaction_id}",
    response_model=TransactionDetailResponse,
    tags=["Transactions"],
    summary="Get transaction details with full explanation",
)
async def get_transaction(
    transaction_id: str,
    detector: AnomalyDetectorProtocol = Depends(get_anomaly_detector),
    generator: ExplanationGeneratorProtocol = Depends(get_explanation_generator),
):
    """
    Retrieve a single transaction with its full fraud analysis explanation.

    The response includes the risk assessment explanation, confidence level,
    identified risk factors, and recommended action.
    """
    transaction = transaction_store.get(transaction_id)

    if transaction is None:
        raise HTTPException(
            status_code=404,
            detail=f"Transaction with ID {transaction_id} not found",
        )

    # Get stored risk data or recalculate
    risk_score = transaction.get("risk_score")
    factors = transaction.get("factors", [])

    if risk_score is None:
        risk_score, factors = detector.calculate_risk_score(transaction)

    # Generate explanation
    explanation_data = generator.generate_explanation(
        transaction=transaction,
        risk_score=risk_score,
        factors=factors,
    )

    return TransactionDetailResponse(
        id=transaction["id"],
        amount=transaction["amount"],
        payee=transaction["payee"],
        timestamp=transaction["timestamp"],
        reference=transaction["reference"],
        risk_score=risk_score,
        risk_level=explanation_data["risk_level"],
        created_at=transaction["created_at"],
        confidence=explanation_data["confidence"],
        explanation=explanation_data["explanation"],
        risk_factors=explanation_data["risk_factors"],
        recommended_action=explanation_data["recommended_action"],
    )
