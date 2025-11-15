from crewai import LLM


def get_default_llm() -> LLM:
    # CrewAI will read OPENAI_API_KEY from environment
    return LLM(model="gpt-4o")
