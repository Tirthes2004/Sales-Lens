import json
from urllib import error, parse, request

from django.conf import settings


def generate_sales_summary(analytics_payload):
    if not settings.GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY is not configured.")

    prompt = build_summary_prompt(analytics_payload)
    response_data = call_gemini(prompt)
    return extract_summary_text(response_data)


def build_summary_prompt(analytics_payload):
    compact_payload = json.dumps(analytics_payload, default=str)

    return (
        "You are a senior sales analyst writing an executive summary for the "
        "latest uploaded sales file. Use only the provided JSON data. Write in "
        "the same style as an executive dashboard insight panel: 2 to 3 short "
        "paragraphs, polished business language, no markdown bullets, no table, "
        "and no heading. Explain the overall sales trend, total revenue, profit, "
        "profit margin, transaction count, strongest products, regional pattern "
        "if region values are meaningful, and one practical recommendation. If "
        "regions are Unknown or missing, say that regional detail is unavailable "
        "instead of pretending there is regional performance. Do not invent values "
        "or percentages. Keep it under 180 words.\n\n"
        f"Sales analytics JSON:\n{compact_payload}"
    )


def call_gemini(prompt):
    model = settings.GEMINI_MODEL
    encoded_model = parse.quote(f"models/{model}", safe="/")
    url = (
        "https://generativelanguage.googleapis.com/v1beta/"
        f"{encoded_model}:generateContent?key={settings.GEMINI_API_KEY}"
    )

    payload = {
        "contents": [
            {
                "parts": [
                    {
                        "text": prompt,
                    }
                ]
            }
        ],
        "generationConfig": {
            "temperature": 0.4,
            "maxOutputTokens": 320,
        },
    }

    data = json.dumps(payload).encode("utf-8")
    api_request = request.Request(
        url,
        data=data,
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    try:
        with request.urlopen(api_request, timeout=30) as response:
            return json.loads(response.read().decode("utf-8"))
    except error.HTTPError as exc:
        details = exc.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"Gemini API error: {details}") from exc
    except error.URLError as exc:
        raise RuntimeError(f"Could not reach Gemini API: {exc.reason}") from exc


def extract_summary_text(response_data):
    try:
        return response_data["candidates"][0]["content"]["parts"][0]["text"].strip()
    except (KeyError, IndexError, TypeError) as exc:
        raise RuntimeError("Gemini response did not include summary text.") from exc
