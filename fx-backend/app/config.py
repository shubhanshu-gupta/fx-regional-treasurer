import os


class Settings:
    def __init__(self) -> None:
        self.openai_api_key = os.getenv("OPENAI_API_KEY", "")
        self.serpapi_api_key = os.getenv("SERPAPI_API_KEY", "")
        self.arize_api_key = os.getenv("ARIZE_API_KEY", "")
        self.arize_otlp_endpoint = os.getenv("ARIZE_OTLP_ENDPOINT", "")
        self.arize_service_name = os.getenv("ARIZE_SERVICE_NAME", "fx-regional-treasurer")


settings = Settings()
