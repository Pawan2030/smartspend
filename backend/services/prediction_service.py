import json
import os
from collections import defaultdict
from openai import OpenAI
import traceback
import httpx

API_KEY = os.getenv("OPENROUTER_API_KEY")

if not API_KEY:
    raise Exception("OPENROUTER_API_KEY not found. Check your .env file.")


def get_client():
    return OpenAI(
        api_key=API_KEY,
        base_url="https://openrouter.ai/api/v1",
        http_client=httpx.Client(verify=False)
    )


def normalize_date(date_str: str) -> str:
    if not date_str:
        return "unknown"
    date_str = date_str.strip()

    # Already correct format YYYY-MM-DD
    if len(date_str) >= 7 and date_str[4] == "-":
        return date_str[:7]

    # Format like "16 May 2024" or "May 16 2024"
    months = {
        "jan": "01", "feb": "02", "mar": "03", "apr": "04",
        "may": "05", "jun": "06", "jul": "07", "aug": "08",
        "sep": "09", "oct": "10", "nov": "11", "dec": "12"
    }
    parts = date_str.replace(",", "").split()
    if len(parts) == 3:
        try:
            if parts[0].isdigit():
                # DD Mon YYYY
                d, m, y = parts
                return f"{y}-{months.get(m.lower()[:3], '01')}"
            else:
                # Mon DD YYYY
                m, d, y = parts
                return f"{y}-{months.get(m.lower()[:3], '01')}"
        except Exception:
            pass

    # Fallback — just return first 7 chars
    return date_str[:7] if len(date_str) >= 7 else "unknown"


def generate_prediction(receipts: list) -> dict:
    if not receipts:
        return {
            "predictions": [],
            "insights": ["Not enough data yet. Upload more receipts to see predictions."]
        }

    category_monthly = defaultdict(lambda: defaultdict(float))
    for r in receipts:
        month = normalize_date(r["date"])
        category_monthly[r["category"]][month] += r["total_amount"]

    summary_lines = []
    for category, months in category_monthly.items():
        line = f"{category}: " + ", ".join(
            f"{m} = Rs.{round(v)}" for m, v in sorted(months.items())
        )
        summary_lines.append(line)

    summary_text = "\n".join(summary_lines)

    prompt = f"""You are a personal finance analyst. Based on this spending history grouped by category and month, predict next month's likely spend per category and give 3-4 short, specific insights.

Spending history:
{summary_text}

Return ONLY valid JSON, no markdown, no explanation outside JSON:

{{
  "predictions": [
    {{
      "category": "category name",
      "predicted_amount": 0.00,
      "trend": "up or down or stable",
      "reason": "one short sentence explaining why, based on the data pattern"
    }}
  ],
  "insights": [
    "short specific insight about spending pattern",
    "another insight"
  ]
}}

Rules:
- Only include categories that appear in the data
- predicted_amount must be a realistic number based on trend, not random
- reason must reference actual pattern from the data (e.g. rising trend, seasonal spike, consistent spending)
- insights should be specific and actionable, not generic"""

    client = get_client()

    response = client.chat.completions.create(
        model="qwen/qwen2.5-vl-72b-instruct",
        temperature=0,
        max_tokens=800,
        messages=[{"role": "user", "content": prompt}],
    )

    raw = response.choices[0].message.content.strip()
    clean = raw.replace("```json", "").replace("```", "").strip()
    return json.loads(clean)