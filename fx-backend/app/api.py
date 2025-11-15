import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from .config import settings
from .crew_runner import run_daily_report
from .tracing import get_tracer, init_tracing


init_tracing()
app = FastAPI(title="FX Regional Treasurer Agent API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ReportRequest(BaseModel):
    date: str | None = None
    openai_api_key: str | None = None
    serpapi_api_key: str | None = None


@app.post("/api/report")
async def generate_report(req: ReportRequest):
    if req.openai_api_key:
        os.environ["OPENAI_API_KEY"] = req.openai_api_key

    if req.serpapi_api_key:
        settings.serpapi_api_key = req.serpapi_api_key

    tracer = get_tracer("fx-report")
    with tracer.start_as_current_span("generate_report"):
        report = run_daily_report(req.date)
        return report.model_dump()
