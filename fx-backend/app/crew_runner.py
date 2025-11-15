from datetime import date as date_cls
from typing import Optional

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

    if isinstance(result, DailyReport):
        return result

    # crewai will normally return the pydantic object; this is a fallback
    return DailyReport.model_validate(result)
