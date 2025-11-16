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

st.title("Treasury FX Risk Dashboard")
st.caption("Streamlit view powered by the same CrewAI treasurer agent as the API/React app.")

with st.sidebar:
    st.header("API Keys")
    openai_key = st.text_input("OpenAI API Key", type="password")
    serpapi_key = st.text_input("SerpAPI Key", type="password")
    st.markdown(
        "Keys are kept in memory only for this session and used to call OpenAI and SerpAPI."
    )

st.subheader("Run Daily Briefing")
col1, col2, col3 = st.columns(3)

with col1:
    selected_date = st.date_input("Analysis date", value=date_cls.today())

with col2:
    region = st.selectbox("Region filter", ["All", "APAC", "LATAM", "Global"], index=0)

with col3:
    currency = st.text_input("Currency filter (optional)", placeholder="e.g. BRL")

run_button = st.button("Run daily briefing", type="primary")

if run_button:
    if not openai_key or not serpapi_key:
        st.error("Please provide both OpenAI and SerpAPI keys before running the briefing.")
    else:
        # Set env vars for the underlying tools
        os.environ["OPENAI_API_KEY"] = openai_key
        os.environ["SERPAPI_API_KEY"] = serpapi_key

        with st.spinner("Running treasurer agent and compiling report..."):
            report: DailyReport = run_daily_report(selected_date.isoformat())

        st.success(f"Report generated for {report.date}")

        # Executive summary
        st.markdown("### Executive summary")
        st.write(report.executive_summary)

        # Actions / Alerts
        st.markdown("### Action / alert section")
        if not report.actions:
            st.info("No immediate treasury action required based on current developments.")
        else:
            for action in report.actions:
                if action.severity == "evaluate_hedging":
                    box = st.error
                elif action.severity == "monitor":
                    box = st.warning
                else:
                    box = st.info

                currencies = ", ".join(action.currencies) or "N/A"
                box(f"**{action.summary}**  \
Currencies: {currencies}")

        # Structured news table
        st.markdown("### Structured news analysis")

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
