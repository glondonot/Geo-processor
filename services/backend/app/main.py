from fastapi import FastAPI
from app.core.config import settings
from app.api.v1.routes import router as geo_router

app = FastAPI(title=settings.APP_NAME)

app.include_router(geo_router, prefix="/api/v1")