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

## 4. Frontend: Treasury FX Risk Dashboard

### 4.1 Install dependencies

In a second terminal:

```bash
cd fx-frontend
cp .env.example .env  # keeps VITE_API_BASE_URL=http://localhost:8000
npm install
```

### 4.2 Run the dashboard

```bash
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

### 4.3 Using the dashboard

1. At the top of the page, in the **API Keys** section, enter:
   - **OpenAI API Key (required)** – your `sk-...` key.
   - **SerpAPI Key (required)** – your SerpAPI key.

   Arize keys are optional and configured on the backend via `.env` (see above).

2. Choose a date (defaults to today) and adjust filters as needed.
3. Click **"Run Daily Briefing"**.

The dashboard will call the backend, run the CrewAI agent, and display:

- Executive summary card.
- Actions / alerts panel (with severity color-coding).
- Events table with category, region, impacted currencies, source & date, and FX impact statements.

---

## 5. Optional: Arize tracing

If `ARIZE_API_KEY` and `ARIZE_OTLP_ENDPOINT` are set in `fx-backend/.env`, the backend will send traces for each `/api/report` request via OpenTelemetry, allowing you to inspect agent runs in Arize AX.

If these values are omitted, tracing is simply disabled; the core app continues to work.

---

## 6. Possible cloud deployment options

This repository is structured as a two-service app (backend + frontend). A few ways to run it in the cloud:

- **FastAPI backend** on a PaaS (Render, Railway, Fly.io, Azure Web App, etc.)
  - Run `uvicorn app.api:app` as the web process.
  - Set environment variables for Arize (optional) in the cloud platform.

- **Frontend** on a static host (Netlify, Vercel, GitHub Pages):
  - Build with `npm run build` inside `fx-frontend`.
  - Serve the `dist/` directory.
  - Point `VITE_API_BASE_URL` (or an equivalent runtime config) at your deployed backend URL.

- **Streamlit-style deployment** (alternative UI):
  - You can wrap the same backend logic in a Streamlit app (e.g. a single `streamlit_app.py` that collects API keys, calls the CrewAI pipeline, and renders tables/charts).
  - That Streamlit app can be deployed on Streamlit Community Cloud or any server that supports `streamlit run`.

This repo currently ships a React dashboard rather than a Streamlit app, but the backend logic is reusable in either style.
