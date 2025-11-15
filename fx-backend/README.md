# FX Regional Treasurer Backend

Python backend for the FX regional treasurer agent.

## Setup

1. Create and activate a virtual environment.
2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Copy `.env.example` to `.env` and set your own keys:

- `OPENAI_API_KEY`
- `SERPAPI_API_KEY`
- `ARIZE_API_KEY` (optional but required for tracing)
- `ARIZE_OTLP_ENDPOINT` (from Arize)
- `ARIZE_SERVICE_NAME` (any service name you like)

4. Run the API:

```bash
python main.py
```

The API will be available at `http://localhost:8000` with the main endpoint:

- `POST /api/report` – generate the daily FX macro report.
