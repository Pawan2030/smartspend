import json
import os
from collections import defaultdict
from dotenv import load_dotenv
from openai import OpenAI
import traceback
import httpx

load_dotenv()

API_KEY = os.getenv("OPENROUTER_API_KEY")

if not API_KEY:
    raise Exception("OPENROUTER_API_KEY not found. Check your .env file.")


def get_client():
    return OpenAI(
        api_key=API_KEY,
        base_url="https://openrouter.ai/api/v1",
        http_client=httpx.Client(verify=False)
    )


def generate_monthly_summary(receipts: list) -> dict:
    if not receipts:
        return {
            "summary": "No receipts found. Upload some receipts to generate a summary.",
            "highlights": [],
            "suggestions": [],
            "report_title": "Monthly Spending Report",
            "total_spent": 0,
            "top_category": "N/A",
            "top_store": "N/A",
            "total_receipts": 0
        }

    category_totals = defaultdict(float)
    category_counts = defaultdict(int)
    store_totals    = defaultdict(float)
    monthly_totals  = defaultdict(float)
    total_spent     = 0

    for r in receipts:
        category_totals[r["category"]]   += r["total_amount"]
        category_counts[r["category"]]   += 1
        store_totals[r["store_name"]]    += r["total_amount"]
        month = r["date"][:7] if r["date"] and len(r["date"]) >= 7 else "unknown"
        monthly_totals[month]            += r["total_amount"]
        total_spent                      += r["total_amount"]

    top_category   = max(category_totals, key=category_totals.get)
    top_store      = max(store_totals, key=store_totals.get)
    total_receipts = len(receipts)

    category_lines = "\n".join(
        f"- {cat}: Rs.{round(amt)} ({category_counts[cat]} receipts)"
        for cat, amt in sorted(category_totals.items(), key=lambda x: -x[1])
    )
    store_lines = "\n".join(
        f"- {store}: Rs.{round(amt)}"
        for store, amt in sorted(store_totals.items(), key=lambda x: -x[1])[:5]
    )
    monthly_lines = "\n".join(
        f"- {month}: Rs.{round(amt)}"
        for month, amt in sorted(monthly_totals.items())
    )

    prompt = f"""You are a friendly personal finance advisor. Analyze this spending data and return a helpful summary.

SPENDING DATA:
Total spent: Rs.{round(total_spent)}
Total receipts: {total_receipts}
Top spending category: {top_category}
Most visited store: {top_store}

Category breakdown:
{category_lines}

Top stores:
{store_lines}

Monthly trend:
{monthly_lines}

Return ONLY valid JSON. No markdown. No explanation. Just raw JSON:

{{
  "summary": "3-4 sentence friendly paragraph summarizing overall spending. Mention total, top category, and one specific observation.",
  "highlights": [
    "specific positive highlight with actual numbers from the data",
    "another specific observation with actual numbers",
    "one more data-backed highlight"
  ],
  "suggestions": [
    "one specific actionable suggestion based on their actual data",
    "another practical tip referencing their actual spending pattern",
    "one more helpful suggestion"
  ],
  "report_title": "Monthly Spending Report",
  "total_spent": {round(total_spent)},
  "top_category": "{top_category}",
  "top_store": "{top_store}",
  "total_receipts": {total_receipts}
}}"""

    client = get_client()

    response = client.chat.completions.create(
        model="qwen/qwen2.5-vl-72b-instruct",
        temperature=0,
        max_tokens=1000,
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
    )

    output = response.choices[0].message.content.strip()

    if output.startswith("```"):
        output = output.replace("```json", "").replace("```", "").strip()

    return json.loads(output)