import os
from datetime import date as date_cls

import streamlit as st

from app.crew_runner import run_daily_report
from app.tasks import DailyReport


st.set_page_config(
    page_title="Treasury FX Risk Dashboard",
    page_icon="💱",
    layout="wide",
)

with st.sidebar:
    st.header("API Keys")
    openai_key = st.text_input("OpenAI API Key", type="password")
    serpapi_key = st.text_input("SerpAPI Key", type="password")
    st.caption("Keys are kept in memory only for this session and used to call OpenAI and SerpAPI.")

st.markdown("## FX News Monitor")
st.markdown("<span style='color: #6b7280;'>Real-time currency market intelligence for treasury operations</span>", unsafe_allow_html=True)

col_date, col_region, col_ccy, col_btn = st.columns([1.2, 1.1, 1, 0.9])

with col_date:
    selected_date = st.date_input("Analysis date", value=date_cls.today())
with col_region:
    region = st.selectbox("Region filter", ["All", "APAC", "LATAM", "Global"], index=0)
with col_ccy:
    currency = st.text_input("Currency filter", placeholder="e.g. BRL")
with col_btn:
    run_button = st.button("Run daily briefing", type="primary")

last_updated = None

if run_button:
    if not openai_key or not serpapi_key:
        st.error("Please provide both OpenAI and SerpAPI keys before running the briefing.")
    else:
        os.environ["OPENAI_API_KEY"] = openai_key
        os.environ["SERPAPI_API_KEY"] = serpapi_key

        with st.spinner("Running treasurer agent and compiling report..."):
            report: DailyReport = run_daily_report(selected_date.isoformat())

        last_updated = date_cls.today().isoformat()

        st.success(f"Report generated for {report.date}")

        # Metrics row
        m1, m2, m3 = st.columns(3)
        with m1:
            st.markdown("#### Active Alerts")
            st.markdown(f"<div style='font-size: 1.8rem; font-weight: 700;'>{len(report.actions)}</div>", unsafe_allow_html=True)
            st.caption("Requires monitoring")
        with m2:
            st.markdown("#### Regions Covered")
            st.markdown("<div style='font-size: 1.8rem; font-weight: 700;'>2</div>", unsafe_allow_html=True)
            st.caption("APAC &amp; LATAM")
        with m3:
            st.markdown("#### Risk Level")
            st.markdown(
                "<span style='display:inline-block;padding:2px 10px;border-radius:999px;border:1px solid rgba(250,204,21,0.6);background:rgba(250,204,21,0.1);color:#92400e;font-size:0.8rem;font-weight:600;'>Medium</span>",
                unsafe_allow_html=True,
            )
            st.caption("Monitor closely")

        if last_updated:
            st.markdown(f"<span style='font-size:0.8rem;color:#9ca3af;'>Last updated: {last_updated}</span>", unsafe_allow_html=True)

        st.markdown("---")

        # Executive summary card
        st.markdown("### Executive summary")
        st.markdown(
            "<div style='border-radius:0.75rem;border-left:4px solid hsl(214,95%,36%);padding:1rem 1.25rem;background:white;'>"
            f"<div style='color:#6b7280;font-size:0.85rem;margin-bottom:0.25rem;'>Today's key macro developments</div>"
            f"<div style='font-size:0.95rem;line-height:1.6;color:#111827;'>{report.executive_summary}</div>"
            "</div>",
            unsafe_allow_html=True,
        )

        # Action / alert section
        st.markdown("### Action / alert section")
        st.caption("Treasury recommendations based on current developments")

        if not report.actions:
            st.info("No immediate treasury action required based on current developments.")
        else:
            for action in report.actions:
                if action.severity == "evaluate_hedging":
                    border_color = "rgba(220,38,38,0.7)"
                    bg_color = "rgba(248,113,113,0.05)"
                elif action.severity == "monitor":
                    border_color = "rgba(234,179,8,0.7)"
                    bg_color = "rgba(250,204,21,0.05)"
                else:
                    border_color = "rgba(22,163,74,0.7)"
                    bg_color = "rgba(34,197,94,0.05)"

                currencies = ", ".join(action.currencies) or "N/A"

                st.markdown(
                    "<div style='border-radius:0.75rem;border:1px solid #e5e7eb;"  # card border
                    f"border-left:4px solid {border_color};background:{bg_color};padding:0.75rem 1rem;margin-bottom:0.5rem;'>"
                    "<div style='font-size:0.85rem;color:#111827;font-weight:600;margin-bottom:0.15rem;'>"
                    f"{action.summary}</div>"
                    f"<div style='font-size:0.8rem;color:#6b7280;'>Currencies: {currencies}</div>"
                    "</div>",
                    unsafe_allow_html=True,
                )

        # Structured news analysis
        st.markdown("### Structured news analysis")
        st.caption("Material developments with long-term FX implications from credible sources")

        items = report.items
        if region != "All":
            items = [item for item in items if item.region == region]
        if currency:
            items = [item for item in items if currency in item.currencies]

        if not items:
            st.info("No qualifying structural developments for the selected filters.")
        else:
            table_rows = [
                {
                    "Category": item.category,
                    "Headline": item.headline,
                    "Region": item.region,
                    "Currencies": ", ".join(item.currencies),
                    "Source": item.source,
                    "Source date": item.source_date,
                    "Impact": item.impact_statement,
                    "URL": item.url or "",
                }
                for item in items
            ]
            st.dataframe(table_rows, use_container_width=True)
