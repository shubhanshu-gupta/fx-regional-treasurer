from typing import Optional

from opentelemetry import trace
from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter
from opentelemetry.sdk.resources import Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor

from .config import settings


_tracing_initialized = False


def init_tracing() -> None:
    global _tracing_initialized
    if _tracing_initialized:
        return

    if not settings.arize_api_key or not settings.arize_otlp_endpoint:
        # Tracing is optional; skip initialization if config is missing.
        return

    resource = Resource.create({"service.name": settings.arize_service_name})

    provider = TracerProvider(resource=resource)

    exporter = OTLPSpanExporter(
        endpoint=settings.arize_otlp_endpoint,
        headers={"Authorization": f"Bearer {settings.arize_api_key}"},
    )

    processor = BatchSpanProcessor(exporter)
    provider.add_span_processor(processor)

    trace.set_tracer_provider(provider)

    _tracing_initialized = True


def get_tracer(name: Optional[str] = None):
    return trace.get_tracer(name or settings.arize_service_name)
