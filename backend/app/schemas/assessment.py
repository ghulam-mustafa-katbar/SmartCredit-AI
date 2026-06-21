from pydantic import BaseModel
from typing import Dict, Any, Optional
from datetime import datetime

class AssessmentBase(BaseModel):
    credit_score: int
    risk_level: str
    confidence_score: float
    shap_values: Dict[str, float]

class AssessmentCreate(AssessmentBase):
    user_id: int

class AssessmentInDBBase(AssessmentBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class Assessment(AssessmentInDBBase):
    pass
