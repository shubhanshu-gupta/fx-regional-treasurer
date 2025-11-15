from typing import Any, List

import httpx
from crewai_tools import tool
from pydantic import BaseModel

from .config import settings


class NewsResult(BaseModel):
    title: str
    url: str
    source: str
    published_at: str | None = None
    snippet: str | None = None


REPUTABLE_DOMAINS = [
    "reuters.com",
    "ft.com",
    "wsj.com",
    "bloomberg.com",
    "imf.org",
    "bis.org",
    "ecb.europa.eu",
    "boj.or.jp",
    "rba.gov.au",
    "rbnz.govt.nz",
    "mas.gov.sg",
    "bcb.gov.br",
    "banxico.org.mx",
]


@tool("serpapi_structured_news_search")
def serpapi_structured_news_search(query: str) -> List[dict[str, Any]]:
    """Search for macro/FX-relevant news using SerpAPI, restricted to reputable domains.

    Returns a list of dictionaries with keys: title, url, source, published_at, snippet.
    """
    if not settings.serpapi_api_key:
        return []

    params = {
        "engine": "google",
        "q": query,
        "api_key": settings.serpapi_api_key,
        "num": 10,
        "hl": "en",
    }

    results: List[dict[str, Any]] = []

    try:
        with httpx.Client(timeout=10.0) as client:
            resp = client.get("https://serpapi.com/search", params=params)
            resp.raise_for_status()
            data = resp.json()
    except Exception:
        return []

    organic_results = data.get("organic_results", []) or []

    for item in organic_results:
        link = item.get("link")
        title = item.get("title")
        snippet = item.get("snippet")
        source = item.get("source") or item.get("displayed_link") or "unknown"
        date_str = item.get("date") or item.get("published_at")

        if not link or not title:
            continue

        if not any(domain in link for domain in REPUTABLE_DOMAINS):
            continue

        news = NewsResult(
            title=title,
            url=link,
            source=str(source),
            published_at=str(date_str) if date_str else None,
            snippet=snippet,
        )
        results.append(news.model_dump())

    return results
