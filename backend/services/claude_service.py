import base64
import json
import os

from dotenv import load_dotenv
from openai import OpenAI
import httpx


# Load .env
load_dotenv()

API_KEY = os.getenv("OPENROUTER_API_KEY")

if not API_KEY:
    raise Exception(
        "OPENROUTER_API_KEY not found. Check your .env file."
    )


def get_client():
    return OpenAI(
        api_key=API_KEY,
        base_url="https://openrouter.ai/api/v1",
        http_client=httpx.Client(verify=False)
    )


def analyze_receipt(image_bytes: bytes, media_type: str = "image/jpeg"):

    prompt = """
You are an expert receipt analyzer.

Analyze the receipt image and return ONLY valid JSON.

{
    "store_name": "",
    "date": "",
    "total_amount": 0,
    "category": "",
    "items": [
        {
            "name": "",
            "price": 0
        }
    ],
    "summary": ""
}

Rules:
- Category must be one of:
Food
Grocery
Travel
Medicine
Electronics
Entertainment
Clothes
Other

- Return only JSON.
- No markdown.
- No explanation.
- Total amount must be numeric.
- Extract every item possible.
"""

    image_base64 = base64.b64encode(image_bytes).decode("utf-8")

    client = get_client()
    MODEL = os.getenv("AI_MODEL")

    response = client.chat.completions.create(
     model=MODEL,
     temperature=0,
     max_tokens=800,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": prompt,
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:{media_type};base64,{image_base64}"
                        },
                    },
                ],
            }
        ],
    )

    output = response.choices[0].message.content.strip()

    if output.startswith("```"):
        output = (
            output.replace("```json", "")
            .replace("```", "")
            .strip()
        )

    return json.loads(output)