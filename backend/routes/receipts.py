from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db, Receipt
from services.claude_service import analyze_receipt
import json
from services.summary_service import generate_monthly_summary
from services.chat_service import chat_with_data
from pydantic import BaseModel
from services.prediction_service import generate_prediction
from datetime import datetime, timedelta
import traceback



class ChatRequest(BaseModel):
    question: str

router = APIRouter(prefix="/receipts", tags=["receipts"])

import traceback

@router.post("/upload")
async def upload_receipt(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    try:
        image_bytes = await file.read()
        media_type = file.content_type or "image/jpeg"

        extracted = analyze_receipt(image_bytes, media_type)

        receipt = Receipt(
            store_name=extracted.get("store_name", "Unknown"),
            category=extracted.get("category", "Other"),
            total_amount=float(extracted.get("total_amount", 0)),
            date=extracted.get("date", ""),
            items=json.dumps(extracted.get("items", [])),
            image_path=file.filename,
        )

        db.add(receipt)
        db.commit()
        db.refresh(receipt)

        return {
            "success": True,
            "receipt_id": receipt.id,
            "extracted": extracted,
        }

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=str(e),
        )


@router.get("/")
def get_receipts(period: str = "ALL", db: Session = Depends(get_db)):
    query = db.query(Receipt)

    now = datetime.utcnow()

    if period == "7D":
        from_date = now - timedelta(days=7)
        query = query.filter(Receipt.date >= from_date.strftime("%Y-%m-%d"))
    elif period == "1M":
        from_date = now - timedelta(days=30)
        query = query.filter(Receipt.date >= from_date.strftime("%Y-%m-%d"))
    elif period == "3M":
        from_date = now - timedelta(days=90)
        query = query.filter(Receipt.date >= from_date.strftime("%Y-%m-%d"))
    elif period == "1Y":
        from_date = now - timedelta(days=365)
        query = query.filter(Receipt.date >= from_date.strftime("%Y-%m-%d"))

    receipts = query.order_by(Receipt.created_at.desc()).all()

    return [
        {
            "id"          : r.id,
            "store_name"  : r.store_name,
            "category"    : r.category,
            "total_amount": r.total_amount,
            "date"        : r.date,
            "items"       : json.loads(r.items) if r.items else [],
            "created_at"  : str(r.created_at),
        }
        for r in receipts
    ]


@router.get("/predict")
def predict_spending(period: str = "ALL", db: Session = Depends(get_db)):
    query = db.query(Receipt)
    now = datetime.utcnow()

    if period == "7D":
        from_date = now - timedelta(days=7)
        query = query.filter(Receipt.date >= from_date.strftime("%Y-%m-%d"))
    elif period == "1M":
        from_date = now - timedelta(days=30)
        query = query.filter(Receipt.date >= from_date.strftime("%Y-%m-%d"))
    elif period == "3M":
        from_date = now - timedelta(days=90)
        query = query.filter(Receipt.date >= from_date.strftime("%Y-%m-%d"))
    elif period == "1Y":
        from_date = now - timedelta(days=365)
        query = query.filter(Receipt.date >= from_date.strftime("%Y-%m-%d"))

    receipts = query.all()
    data = [
        {
            "category"    : r.category,
            "total_amount": r.total_amount,
            "date"        : r.date,
        }
        for r in receipts
    ]
    try:
        result = generate_prediction(data)
        return result
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=str(e),
        )


@router.post("/chat")
def chat(request: ChatRequest, db: Session = Depends(get_db)):
    receipts = db.query(Receipt).all()
    data = [
        {
            "store_name": r.store_name,
            "category": r.category,
            "total_amount": r.total_amount,
            "date": r.date,
        }
        for r in receipts
    ]
    try:
        answer = chat_with_data(request.question, data)
        return {"answer": answer}
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=str(e),
        )


@router.get("/summary")
def monthly_summary(db: Session = Depends(get_db)):
    receipts = db.query(Receipt).all()
    data = [
        {
            "store_name" : r.store_name,
            "category"   : r.category,
            "total_amount": r.total_amount,
            "date"       : r.date,
        }
        for r in receipts
    ]
    try:
        result = generate_monthly_summary(data)
        return result
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=str(e),
        )


@router.get("/history")
def get_history(category: str = None, db: Session = Depends(get_db)):
    query = db.query(Receipt)
    if category and category != "All":
        query = query.filter(Receipt.category == category)
    receipts = query.order_by(Receipt.created_at.desc()).all()
    return [
        {
            "id"          : r.id,
            "store_name"  : r.store_name,
            "category"    : r.category,
            "total_amount": r.total_amount,
            "date"        : r.date,
            "items"       : json.loads(r.items) if r.items else [],
            "image_path"  : r.image_path,
            "created_at"  : str(r.created_at),
        }
        for r in receipts
    ]