from typing import List

from crewai import Task
from pydantic import BaseModel

class FxEvent(BaseModel):
    category: str
    headline: str
    region: str
    currencies: List[str]
    source: str
    source_date: str
    url: str | None = None
    impact_statement: str


class FxAction(BaseModel):
    severity: str  # none | monitor | evaluate_hedging
    summary: str
    currencies: List[str]


class DailyReport(BaseModel):
    date: str
    executive_summary: str
    items: List[FxEvent]
    actions: List[FxAction]


def build_daily_report_task(agent) -> Task:
    instructions = (
        "Review only reputable global news outlets and official institutional releases. "
        "Identify developments with medium- to long-term structural implications for FX, "
        "currencies or liquidity, especially in APAC and LATAM. Exclude intraday FX moves, "
        "technical analysis, minor local news and opinion or editorial content. For each "
        "kept event, extract a factual description and FX impact that is strictly grounded "
        "in the cited article(s). If FX impact is unclear, say so explicitly."
    )

    expected_output = (
        "Return a JSON object with keys: date (YYYY-MM-DD), executive_summary (3-4 "
        "factual sentences), items (list of events with: category, headline, region, "
        "currencies, source, source_date, url, impact_statement), and actions (list of "
        "recommended actions with: severity, summary, currencies)."
    )

    return Task(
        description=instructions,
        expected_output=expected_output,
        agent=agent,
        output_pydantic=DailyReport,
    )
