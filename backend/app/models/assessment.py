from sqlalchemy import Column, Integer, Float, String, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class Assessment(Base):
    __tablename__ = "assessments"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    credit_score = Column(Integer) # 300 - 850
    risk_level = Column(String) # High, Medium, Low
    confidence_score = Column(Float)
    shap_values = Column(JSON) # Store Explainable AI reasoning
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="assessments")
    recommendation = relationship("Recommendation", back_populates="assessment", uselist=False)

class Recommendation(Base):
    __tablename__ = "recommendations"
    id = Column(Integer, primary_key=True, index=True)
    assessment_id = Column(Integer, ForeignKey("assessments.id"), unique=True)
    recommended_amount = Column(Float)
    installment_plan_months = Column(Integer)
    approval_probability = Column(Float)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    assessment = relationship("Assessment", back_populates="recommendation")
