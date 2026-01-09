"""
FraudShield Anomaly Detector Service

Provides deterministic fraud risk scoring based on transaction attributes.
Currently uses rule-based mock; designed for future Azure Anomaly Detector integration.
"""

from datetime import datetime
from typing import Protocol

from app.config import (
    AVG_TRANSACTION_AMOUNT,
    BUSINESS_HOURS_START,
    BUSINESS_HOURS_END,
    SCORING_WEIGHTS,
    AMOUNT_SPIKE_MULTIPLIER,
)


class AnomalyDetectorProtocol(Protocol):
    """Protocol defining the anomaly detector interface."""

    def calculate_risk_score(self, transaction: dict) -> tuple[float, list[str]]:
        """
        Calculate risk score for a transaction.

        Args:
            transaction: Transaction data dict

        Returns:
            tuple: (risk_score 0-1, list of triggered factor codes)
        """
        ...


class MockAnomalyDetector:
    """
    Deterministic anomaly detector for MVP.

    Calculates risk score based on transaction attributes:
    - NEW_PAYEE: First-time payee (+0.25)
    - UNUSUAL_TIMING: Outside business hours (+0.25)
    - AMOUNT_SPIKE: Amount > 3x average (+0.30)
    - SUSPICIOUS_REFERENCE: Contains urgency markers (+0.15)
    """

    def calculate_risk_score(self, transaction: dict) -> tuple[float, list[str]]:
        """
        Calculate deterministic risk score based on transaction attributes.

        Args:
            transaction: Dict with amount, payee, timestamp, reference, payee_is_new

        Returns:
            tuple: (risk_score capped at 1.0, list of triggered factors)
        """
        score = 0.0
        factors = []

        # Factor 1: New payee detection
        if transaction.get("payee_is_new", False):
            score += SCORING_WEIGHTS["NEW_PAYEE"]
            factors.append("NEW_PAYEE")

        # Factor 2: Unusual timing (outside 9am-6pm)
        timestamp = transaction.get("timestamp")
        if timestamp:
            if isinstance(timestamp, str):
                timestamp = datetime.fromisoformat(timestamp.replace("Z", "+00:00"))
            hour = timestamp.hour
            if hour < BUSINESS_HOURS_START or hour >= BUSINESS_HOURS_END:
                score += SCORING_WEIGHTS["UNUSUAL_TIMING"]
                factors.append("UNUSUAL_TIMING")

        # Factor 3: Amount spike (> 3x average)
        amount = transaction.get("amount", 0)
        spike_threshold = AVG_TRANSACTION_AMOUNT * AMOUNT_SPIKE_MULTIPLIER
        if amount > spike_threshold:
            score += SCORING_WEIGHTS["AMOUNT_SPIKE"]
            factors.append("AMOUNT_SPIKE")

        # Factor 4: Suspicious reference patterns
        reference = transaction.get("reference", "").upper()
        if "URGENT" in reference:
            score += SCORING_WEIGHTS["SUSPICIOUS_REFERENCE"]
            factors.append("SUSPICIOUS_REFERENCE")

        return min(score, 1.0), factors


class AzureAnomalyDetector:
    """
    Azure Anomaly Detector integration stub.

    Future implementation will use:
    - Azure Anomaly Detector API
    - Multivariate anomaly detection
    - Time-series analysis

    Environment variables required:
    - ANOMALY_DETECTOR_ENDPOINT
    - ANOMALY_DETECTOR_KEY
    """

    def __init__(self, endpoint: str, api_key: str):
        self.endpoint = endpoint
        self.api_key = api_key
        # TODO: Initialize Azure SDK client
        # from azure.ai.anomalydetector import AnomalyDetectorClient
        # from azure.core.credentials import AzureKeyCredential
        # self.client = AnomalyDetectorClient(endpoint, AzureKeyCredential(api_key))

    def calculate_risk_score(self, transaction: dict) -> tuple[float, list[str]]:
        """Calculate risk score using Azure Anomaly Detector."""
        raise NotImplementedError("Azure integration not yet implemented")


def get_anomaly_detector() -> AnomalyDetectorProtocol:
    """
    Factory function to get the appropriate anomaly detector.

    In production, will check environment variables:
    - If ANOMALY_DETECTOR_ENDPOINT and ANOMALY_DETECTOR_KEY are set,
      returns AzureAnomalyDetector
    - Otherwise, returns MockAnomalyDetector
    """
    # MVP: Always return mock
    return MockAnomalyDetector()
