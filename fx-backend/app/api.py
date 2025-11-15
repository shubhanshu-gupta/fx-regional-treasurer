from fastapi import FastAPI
from pydantic import BaseModel

from .crew_runner import run_daily_report
from .tracing import get_tracer, init_tracing


init_tracing()
app = FastAPI(title="FX Regional Treasurer Agent API")


class ReportRequest(BaseModel):
    date: str | None = None


@app.post("/api/report")
async def generate_report(req: ReportRequest):
    tracer = get_tracer("fx-report")
    with tracer.start_as_current_span("generate_report"):
        report = run_daily_report(req.date)
        return report.model_dump()
