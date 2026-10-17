import os
from dotenv import load_dotenv
from openai import OpenAI
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


def chat_with_data(question: str, receipts: list) -> str:
    if not receipts:
        return "You haven't uploaded any receipts yet. Upload some to start asking questions about your spending!"

    receipt_lines = []
    for r in receipts:
        receipt_lines.append(
            f"- {r['store_name']} | {r['category']} | ₹{r['total_amount']} | {r['date']}"
        )
    receipts_text = "\n".join(receipt_lines)

    prompt = f"""You are a helpful personal finance assistant. Answer the user's question using ONLY the receipt data below. Be concise, friendly, and specific with numbers. If the answer isn't in the data, say so honestly.

Receipt data:
{receipts_text}

User question: {question}

Answer in 2-4 sentences max. Use ₹ for amounts. Be conversational, not robotic."""

    client = get_client()

    response = client.chat.completions.create(
        model="qwen/qwen2.5-vl-72b-instruct",
        temperature=0.3,
        max_tokens=300,
        messages=[
            {"role": "user", "content": prompt}
        ],
    )

    return response.choices[0].message.content.strip()