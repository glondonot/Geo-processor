import os

class Settings:
    APP_NAME: str = os.getenv("APP_NAME", "GeoProcessor")
    ENV: str = os.getenv("ENV", "development")

settings = Settings()