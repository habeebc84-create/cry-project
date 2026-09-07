import os

config_path = r'C:\Users\habee\backend\app\config.py'

content = '''import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env"),
        env_file_encoding="utf-8",
        case_sensitive=True,
    )

    PROJECT_NAME: str = "Smart Rainfall Prediction & Water Resource Management API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    # Override via SECRET_KEY env var / .env file — never commit real keys!
    SECRET_KEY: str = "water_intelligence_secret_key_2026_super_secure_change_in_prod"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 1 day

    # Hidden admin slug – change this in .env for production
    ADMIN_SLUG: str = "_0BD8dzwvAjtj9uUN43c"

    # OpenAQ API for real-time air quality data
    OPENAQ_API_KEY: str = "d4eb95036d20e2fa377141c2ec27b888f5aace51faa43156dbbf496954c95129"
    OPENAQ_BASE_URL: str = "https://api.openaq.org/v3"

    DATABASE_URL: str = "sqlite:///./water_intelligence.db"
    
    BASE_DIR: str = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    DATASETS_DIR: str = os.path.join(BASE_DIR, "datasets")
    SAVED_MODELS_DIR: str = os.path.join(BASE_DIR, "saved_models")

settings = Settings()

os.makedirs(settings.DATASETS_DIR, exist_ok=True)
os.makedirs(settings.SAVED_MODELS_DIR, exist_ok=True)
'''

with open(config_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("config.py updated with OpenAQ API key")
