# Treasury FX Risk Dashboard

An intelligent FX macro monitoring agent and dashboard for treasury teams.

The system consists of:

- **fx-backend/** – Python backend using FastAPI + CrewAI, with optional Arize tracing.
- **fx-frontend/** – React (Vite) web dashboard for treasurers to view daily FX risk reports.

---

## 1. Prerequisites

- Python **3.11+**
- Node.js **18+** and npm

You will also need your own API keys:

- **OpenAI API key** (required at runtime from the UI)
- **SerpAPI key** (required at runtime from the UI)
- **Arize AX API key** (optional, for tracing only, configured server-side)

---

## 2. Clone the repository

```bash
git clone https://github.com/shubhanshu-gupta/fx-regional-treasurer.git
cd fx-regional-treasurer
```

---

## 3. Backend: FastAPI + CrewAI

### 3.1 Create and activate a virtual environment

```bash
cd fx-backend
python3 -m venv .venv
source .venv/bin/activate  # macOS / Linux
```

### 3.2 Install dependencies

```bash
pip install -r requirements.txt
```

### 3.3 Configure backend environment (optional)

For **basic usage**, you do *not* need to put your OpenAI/SerpAPI keys in `.env`; the frontend will collect them at runtime and send them per request.

If you want **Arize tracing** or to set defaults, copy and edit the env file:

```bash
cp .env.example .env
```

Edit `.env` and set (all optional for core functionality):

- `ARIZE_API_KEY` – your Arize key
- `ARIZE_OTLP_ENDPOINT` – Arize OTLP endpoint
- `ARIZE_SERVICE_NAME` – service name shown in Arize (e.g. `fx-regional-treasurer`)

### 3.4 Run the backend API

```bash
python main.py
```

The API will be available at:

- `http://localhost:8000/api/report` – POST endpoint to generate the daily FX report.

The server uses autoreload in development; changes under `fx-backend/app/` trigger reloads.

---

## 4. Frontend: Treasury FX Risk Dashboard (React)

### 4.1 Install dependencies

In a second terminal:

```bash
cd fx-frontend
cp .env.example .env  # keeps VITE_API_BASE_URL=http://localhost:8000
npm install
```

### 4.2 Run the dashboard locally

```bash
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

### 4.3 Use the dashboard

1. Make sure the backend is running (`python main.py` in `fx-backend`).
2. Open `http://localhost:5173`.
3. In the **Settings** tab of the dashboard, enter:
   - **OpenAI API Key (required)** – your `sk-...` key.
   - **SerpAPI Key (required)** – your SerpAPI key.

   These keys are sent from the browser to the backend only when you run a report; they are not written to disk by the server.

4. Go to the **Dashboard** tab:
   - Pick an **analysis date** (defaults to today).
   - Optionally choose **Region / Category / Currency filters**.
   - Click **"Apply Filters"** and then **"Refresh Data"**.

The dashboard will call the backend’s `/api/report` endpoint, run the CrewAI agent, and display:

- **Metric tiles**: Active alerts, regions covered, and risk level.
- **Executive Summary**: an AI-written macro summary for the selected date.
- **Action / Alert Section**: colored cards with recommended treasury actions and impacted currencies.
- **Structured News Analysis**: table of structural FX events (category, region, currencies, source & date, impact statement, link).

---

## 5. Optional: Streamlit app (alternate UI)

If you prefer a single-file Python app (or want to deploy on Streamlit Community Cloud), this repo includes a Streamlit wrapper that uses the same backend logic.

### 5.1 Run Streamlit locally

In a terminal with the backend virtualenv active:

```bash
cd fx-backend
streamlit run streamlit_app.py
```

Then open the URL shown in the terminal (usually `http://localhost:8501`).

In the Streamlit app:

1. Enter your **OpenAI** and **SerpAPI** keys in the sidebar.
2. Choose an analysis date, region filter, and optional currency filter.
3. Click **Run daily briefing**.

You will see a layout that mirrors the React dashboard:

- Header (**FX News Monitor**) and filters row.
- A **metrics row** (active alerts, regions covered, risk level).
- **Executive summary card**.
- **Action / alert section** (cards colored by severity).
- **Structured news analysis** table with the same fields as the React UI.

### 5.2 Deploying to Streamlit Cloud (high-level)

1. Push your fork of this repo to GitHub.
2. On https://share.streamlit.io, create a new app pointing to this repo.
3. Set the **main file** to:

   ```text
   fx-backend/streamlit_app.py
   ```

4. Optionally configure default environment variables for keys, or rely on users entering their keys in the sidebar.

Once deployed, anyone with the URL can run the same FX treasurer agent without installing Python/Node locally.

---

## 6. Optional: Arize tracing

If `ARIZE_API_KEY` and `ARIZE_OTLP_ENDPOINT` are set in `fx-backend/.env`, the backend will send traces for each `/api/report` request via OpenTelemetry, allowing you to inspect agent runs in Arize AX.

If these values are omitted, tracing is simply disabled; the core app continues to work.

---

## 7. Possible cloud deployment options

This repository is structured as a two-service app (backend + frontend). A few ways to run it in the cloud:

- **FastAPI backend** on a PaaS (Render, Railway, Fly.io, Azure Web App, etc.)
  - Run `uvicorn app.api:app` as the web process.
  - Set environment variables for Arize (optional) in the cloud platform.

- **Frontend** on a static host (Netlify, Vercel, GitHub Pages):
  - Build with `npm run build` inside `fx-frontend`.
  - Serve the `dist/` directory.
  - Point `VITE_API_BASE_URL` (or an equivalent runtime config) at your deployed backend URL.

- **Streamlit-style deployment** (alternative UI):
  - This repo already includes `fx-backend/streamlit_app.py` as a reference implementation.
  - That Streamlit app can be deployed on Streamlit Community Cloud or any server that supports `streamlit run`.

This repo ships both a React dashboard and a Streamlit app, powered by the same backend logic.

---

## 8. Backend architecture & agent flow

At a high level, each daily run goes through the following steps:

```text
User (UI) → FastAPI endpoint → CrewAI agent → Tools / news search → Pydantic DailyReport → UI rendering
```

You can also think of it visually like this:

```mermaid
flowchart LR
  React[React Dashboard] -->|date + keys| Api[/POST /api/report/]
  Streamlit[Streamlit App] -->|date + keys (env)| Agent
  Api -->|run_daily_report(date)| Agent
  Agent --> Task
  Task --> Tools
  Tools --> Task
  Task -->|DailyReport| Api
  Task -->|DailyReport| Streamlit
  Api -->|JSON DailyReport| React
```

### 8.1 Key backend components

- **`app/tasks.py`**
  - Defines the structured output models:
    - `FxEvent` – one structural news item (category, region, currencies, source, impact statement, URL).
    - `FxAction` – one recommended action (severity, summary, currencies).
    - `DailyReport` – container with `date`, `executive_summary`, `items: List[FxEvent]`, `actions: List[FxAction]`.
  - Defines `build_daily_report_task(agent)` – a CrewAI `Task` with:
    - Detailed instructions about what news to consider (structural FX only).
    - `expected_output` describing the JSON schema.
    - `output_pydantic=DailyReport` so the Crew directly produces a validated `DailyReport`.

- **`app/agents.py`**
  - Builds the **regional treasurer agent** with:
    - A role description (treasury FX risk focus).
    - Access to tools in `news_tools.py` for news search / retrieval.

- **`app/news_tools.py`**
  - Wraps **SerpAPI** and related utilities so the agent can:
    - Search reputable news sources.
    - Pull article metadata and content.
  - These tools are what the agent actually invokes when “reading the news.”

- **`app/crew_runner.py`**
  - `run_daily_report(run_date: Optional[str]) -> DailyReport`:
    - Builds the agent and task.
    - Creates a `Crew(agents=[agent], tasks=[task])`.
    - Calls `crew.kickoff(inputs={"date": today_str})`.
    - Normalizes the `DailyReport.date` to the requested analysis date.
    - Handles different return shapes (direct `DailyReport`, JSON string, or dict) and always returns a validated `DailyReport` instance.

- **`app/api.py`**
  - FastAPI app exposing `/api/report`:
    - Accepts a date and API keys from the frontend.
    - Injects keys into environment / config for tools.
    - Calls `run_daily_report(...)` and returns the `DailyReport` as JSON.

### 8.2 End-to-end flow (React dashboard)

```text
React Dashboard (fx-frontend)
  ├─ Collects OpenAI + SerpAPI keys from Settings
  ├─ User chooses date + filters and clicks “Refresh Data”
  ├─ Frontend calls POST /api/report with date + keys
  ▼
FastAPI backend (fx-backend/app/api.py)
  ├─ Receives request, sets up keys for tools
  ├─ Calls run_daily_report(date)
  ▼
CrewAI Crew (agent + task)
  ├─ Agent uses news_tools (SerpAPI etc.) to fetch relevant articles
  ├─ Task instructions shape the analysis toward structural FX/liquidity themes
  ├─ Crew returns a DailyReport (executive_summary, items, actions)
  ▼
Backend
  ├─ Normalizes DailyReport.date to requested date
  └─ Returns JSON to frontend
  ▼
React Dashboard
  ├─ Renders metrics, executive summary, actions, table
  └─ Lets the user filter by region/category/currency
```

### 8.3 End-to-end flow (Streamlit app)

```text
Streamlit app (fx-backend/streamlit_app.py)
  ├─ Collects OpenAI + SerpAPI keys in sidebar
  ├─ User chooses date + filters and clicks “Run daily briefing”
  ├─ App sets env vars and calls run_daily_report(date) directly
  ▼
CrewAI Crew (same as above)
  └─ Returns DailyReport
  ▼
Streamlit app
  ├─ Shows metrics row
  ├─ Renders executive summary card
  ├─ Renders action/alert cards
  └─ Renders structured news table with client-side filters
```

Both UIs are thin layers over the same agentic backbone. If you change the agent prompt, tools, or `DailyReport` schema, both the React dashboard and the Streamlit app will reflect those changes.
