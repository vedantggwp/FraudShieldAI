"""
FraudShield Database Models

SQLAlchemy ORM models for database tables.
"""

from datetime import datetime
from sqlalchemy import Column, String, Float, DateTime, Boolean, Text, JSON
from sqlalchemy.dialects.postgresql import UUID
import uuid

from app.database import Base


class Transaction(Base):
    """Transaction model for storing fraud detection records."""
    
    __tablename__ = "transactions"

    # Primary key
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    
    # Transaction details
    amount = Column(Float, nullable=False)
    payee = Column(String(255), nullable=False, index=True)
    timestamp = Column(DateTime(timezone=True), nullable=False)
    reference = Column(String(100), nullable=False)
    payee_is_new = Column(Boolean, default=False)
    
    # Risk assessment
    risk_score = Column(Float, nullable=False, index=True)
    risk_level = Column(String(10), nullable=False, index=True)  # high, medium, low
    factors = Column(JSON, default=list)  # List of triggered factor codes
    
    # Explanation (generated lazily, cached here)
    confidence = Column(Float, nullable=True)
    explanation = Column(Text, nullable=True)
    risk_factors_detailed = Column(JSON, nullable=True)  # Formatted factor descriptions
    recommended_action = Column(Text, nullable=True)
    
    # Action tracking
    status = Column(String(20), default="pending", index=True)  # pending, approved, rejected, investigating
    reviewed_by = Column(String(255), nullable=True)
    reviewed_at = Column(DateTime(timezone=True), nullable=True)
    notes = Column(Text, nullable=True)
    
    # Metadata
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<Transaction(id={self.id}, payee={self.payee}, risk_level={self.risk_level})>"


class User(Base):
    """User model for authentication (future enhancement)."""
    
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    last_login = Column(DateTime(timezone=True), nullable=True)

    def __repr__(self):
        return f"<User(email={self.email})>"


class AuditLog(Base):
    """Audit log for tracking user actions (future enhancement)."""
    
    __tablename__ = "audit_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=True, index=True)
    transaction_id = Column(UUID(as_uuid=True), nullable=True, index=True)
    action = Column(String(50), nullable=False)  # viewed, approved, rejected, created, etc.
    details = Column(JSON, nullable=True)
    ip_address = Column(String(45), nullable=True)
    user_agent = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, index=True)

    def __repr__(self):
        return f"<AuditLog(action={self.action}, user_id={self.user_id})>"
