"""
FraudShield Configuration Constants

Contains thresholds and parameters for fraud detection scoring.
"""

# Average transaction amount for spike detection (in GBP)
AVG_TRANSACTION_AMOUNT = 520

# Business hours range (24-hour format)
BUSINESS_HOURS_START = 9   # 9am
BUSINESS_HOURS_END = 18    # 6pm

# Risk level thresholds
RISK_THRESHOLDS = {
    "high": 0.65,    # >= 0.65 is HIGH risk
    "medium": 0.35,  # >= 0.35 is MEDIUM risk
                     # < 0.35 is LOW risk
}

# Scoring weights for each factor
SCORING_WEIGHTS = {
    "NEW_PAYEE": 0.25,
    "UNUSUAL_TIMING": 0.25,
    "AMOUNT_SPIKE": 0.30,
    "SUSPICIOUS_REFERENCE": 0.15,
}

# Amount spike multiplier (transaction > AVG * this = spike)
AMOUNT_SPIKE_MULTIPLIER = 3  # >£1,560 triggers spike
