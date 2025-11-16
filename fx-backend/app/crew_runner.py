from datetime import date as date_cls
from typing import Optional

import json
from crewai import Crew

from .agents import build_regional_treasurer_agent
from .tasks import DailyReport, build_daily_report_task


def run_daily_report(run_date: Optional[str] = None) -> DailyReport:
    agent = build_regional_treasurer_agent()
    task = build_daily_report_task(agent)

    crew = Crew(agents=[agent], tasks=[task])

    if run_date is None:
        today_str = date_cls.today().isoformat()
    else:
        today_str = run_date

    result = crew.kickoff(inputs={"date": today_str})

    def _attach_date(report: DailyReport) -> DailyReport:
        # Normalize the report date to the requested analysis date to avoid
        # stale or hallucinated values coming back from the model.
        report.date = today_str
        return report

    if isinstance(result, DailyReport):
        return _attach_date(result)

    # If CrewOutput-like object, try to parse its raw JSON payload
    if hasattr(result, "raw") and isinstance(result.raw, str):
        return _attach_date(DailyReport.model_validate_json(result.raw))

    # If we already have a dict-like structure, validate it directly
    if isinstance(result, dict):
        return _attach_date(DailyReport.model_validate(result))

    raise ValueError(f"Unexpected crew result type: {type(result)}")
