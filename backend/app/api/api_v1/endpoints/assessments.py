from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.api import deps
from app.schemas.assessment import Assessment, AssessmentCreate
from app.models.assessment import Assessment as AssessmentModel
from app.models.user import User as UserModel
from app.core.ml_model import ml_engine

router = APIRouter()

@router.post("/generate", response_model=Assessment)
async def generate_assessment(
    profile_data: dict, # Ideally typed via FinancialProfile schema
    db: AsyncSession = Depends(deps.get_db),
    current_user: UserModel = Depends(deps.get_current_active_user),
):
    """
    Generate an AI credit assessment based on financial profile.
    """
    if not ml_engine.is_loaded:
        raise HTTPException(status_code=503, detail="AI Model is not loaded. Try again later.")
        
    try:
        prediction = ml_engine.predict(profile_data)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Inference failed: {str(e)}")
        
    db_assessment = AssessmentModel(
        user_id=current_user.id,
        credit_score=prediction["credit_score"],
        risk_level=prediction["risk_level"],
        confidence_score=prediction["confidence_score"],
        shap_values=prediction["shap_values"]
    )
    
    db.add(db_assessment)
    await db.commit()
    await db.refresh(db_assessment)
    
    return db_assessment
