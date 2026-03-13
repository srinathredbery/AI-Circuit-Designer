from fastapi import APIRouter
from app.api.endpoints import circuits

router = APIRouter()

router.include_router(circuits.router, prefix="/circuits", tags=["circuits"])
