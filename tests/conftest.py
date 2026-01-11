"""Shared pytest fixtures for FraudShield API tests."""

import pytest
from httpx import AsyncClient, ASGITransport

from app.main import app
from app.storage import transaction_store


@pytest.fixture(autouse=True)
def clear_storage():
    """Clear transaction store before each test."""
    transaction_store.clear()
    yield
    transaction_store.clear()


@pytest.fixture
async def client():
    """Async test client for FastAPI using httpx."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


@pytest.fixture
def valid_transaction_data():
    """Sample valid transaction data for testing."""
    return {
        "amount": 500.00,
        "payee": "Test Vendor Ltd",
        "timestamp": "2026-01-10T14:30:00Z",
        "reference": "Test Payment",
        "payee_is_new": False,
    }


@pytest.fixture
def high_risk_transaction_data():
    """Transaction data that should trigger HIGH risk score."""
    return {
        "amount": 5000.00,
        "payee": "Suspicious Entity",
        "timestamp": "2026-01-10T03:00:00Z",
        "reference": "Wire Transfer",
        "payee_is_new": True,
    }


@pytest.fixture
def low_risk_transaction_data():
    """Transaction data that should trigger LOW risk score."""
    return {
        "amount": 200.00,
        "payee": "Regular Supplier",
        "timestamp": "2026-01-10T10:00:00Z",
        "reference": "Monthly Order",
        "payee_is_new": False,
    }


@pytest.fixture
def medium_risk_transaction_data():
    """Transaction data that should trigger MEDIUM risk score."""
    return {
        "amount": 300.00,
        "payee": "New Vendor",
        "timestamp": "2026-01-10T22:00:00Z",
        "reference": "First Order",
        "payee_is_new": True,
    }
