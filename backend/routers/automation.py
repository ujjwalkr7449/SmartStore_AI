from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import desc

from core.deps import get_current_user, require_admin
from db.session import get_db
from models.automation import AutomationLog
from services.scheduler_service import scheduler_service

router = APIRouter()

@router.get("/logs")
def get_automation_logs(db: Session = Depends(get_db), _=Depends(get_current_user)):
    logs = db.query(AutomationLog).order_by(desc(AutomationLog.created_at)).limit(10).all()
    return logs

@router.post("/trigger")
def trigger_automation(_=Depends(require_admin)):
    scheduler_service._run_low_stock_automation()
    return {"message": "Automation triggered successfully"}
