# 🧾 SmartSpend — High Level Architecture

> **AI-Powered Receipt Analyzer & Budget Predictor**  
> Built with FastAPI · React · Gemini AI · PostgreSQL · Docker · AWS EC2

---

## 📌 Project Overview

SmartSpend is a full-stack AI-powered personal finance application that eliminates manual expense tracking. Users simply upload a photo of any receipt — printed, handwritten, or digital — and the system automatically extracts, categorizes, stores, and analyzes spending data using Google Gemini's Vision AI.

| Attribute        | Detail                                      |
|------------------|---------------------------------------------|
| **Type**         | Full-Stack Web Application                  |
| **AI Model**     | Google Gemini 2.0 Flash (via OpenRouter)    |
| **Database**     | PostgreSQL 16                               |
| **Deployment**   | AWS EC2 (Ubuntu 24.04) + Docker Compose     |
| **Frontend**     | React 18 + Vite + TailwindCSS               |
| **Backend**      | Python 3.11 + FastAPI + SQLAlchemy          |

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER (Browser)                           │
└───────────────────────────┬─────────────────────────────────────┘
                            │ HTTP :80
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    AWS EC2 Instance                             │
│                (t2.micro · Ubuntu 24.04)                        │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              Docker Compose Network                      │   │
│  │                                                          │   │
│  │   ┌─────────────┐    /api/*    ┌─────────────────┐      │   │
│  │   │   Nginx     │ ──────────▶  │  FastAPI        │      │   │
│  │   │   :80       │             │  Backend :8000   │      │   │
│  │   │   (Reverse  │             │  (Python 3.11)   │      │   │
│  │   │    Proxy)   │             └────────┬────────┘      │   │
│  │   │             │                      │                │   │
│  │   │   React     │             ┌────────▼────────┐      │   │
│  │   │   Frontend  │             │  PostgreSQL 16   │      │   │
│  │   │   (Static)  │             │  (smartspend db) │      │   │
│  │   └─────────────┘             └─────────────────┘      │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS (REST)
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                   OpenRouter AI Gateway                         │
│              → Google Gemini 2.0 Flash                         │
│         (Vision OCR · Text Generation · Analysis)              │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🧩 Component Breakdown

### 1. 👤 Client Layer
- **Browser / Mobile** — User interacts with SmartSpend via any modern browser
- Uploads receipt photos (JPG, PNG, PDF)
- Views dashboard, charts, insights, history
- Chats with AI about their spending

### 2. ⚛️ Frontend (React + Vite + TailwindCSS)
| File | Purpose |
|------|---------|
| `DashboardPage.jsx` | KPI cards, pie chart, bar chart, time filters |
| `InsightsPage.jsx` | AI predictions + chat interface |
| `HistoryPage.jsx` | Receipt grid, category filter, search |
| `Dashboard.jsx` | Charts (Recharts) + category breakdown |
| `UploadReceipt.jsx` | File picker + upload trigger |
| `ChatBox.jsx` | Real-time AI chat with spending data |
| `Prediction.jsx` | Next month forecast cards |
| `MonthlySummary.jsx` | AI-generated report modal |
| `ReceiptHistory.jsx` | Searchable receipt grid with detail popup |
| `Navbar.jsx` | 3-page navigation (Dashboard · Insights · History) |

**Time filters:** 7D / 1M / 3M / 6M / 1Y / All  
**Charts:** Recharts (PieChart + BarChart)

### 3. 🔀 Nginx Reverse Proxy
- Serves React static build on **port 80**
- Proxies `/api/*` requests → FastAPI backend on port 8000
- Handles React Router (SPA) with `try_files` fallback
- Corporate-network friendly — only port 80 exposed publicly

```nginx
location /api/ {
    proxy_pass http://backend:8000/;
}
location / {
    try_files $uri $uri/ /index.html;
}
```

### 4. ⚡ FastAPI Backend (Python 3.11)

| Route | Method | Purpose |
|-------|--------|---------|
| `/` | GET | Health check |
| `/receipts/upload` | POST | Upload image → AI extraction → DB save |
| `/receipts/` | GET | All receipts |
| `/receipts/history` | GET | Filtered history (by category) |
| `/receipts/summary` | GET | AI monthly summary report |
| `/receipts/predict` | GET | AI next-month prediction |
| `/receipts/chat` | POST | Chat with spending data |

**Services:**
```
services/
├── claude_service.py     → Gemini Vision: receipt image → structured JSON
├── prediction_service.py → Spending history → next month forecast
├── summary_service.py    → Monthly AI report generation
└── chat_service.py       → Natural language Q&A on spending data
```

### 5. 🤖 AI Layer (Gemini 2.0 Flash via OpenRouter)

SmartSpend has **3 AI touchpoints:**

#### Touchpoint 1 — Vision OCR (Receipt Reading)
```
Receipt Photo (base64)
        ↓
Gemini Vision API
        ↓
{
  "store_name": "DMart",
  "category": "Grocery",
  "total_amount": 1240.00,
  "date": "2026-07-01",
  "items": [{"name": "Milk", "price": 60}],
  "summary": "Grocery shopping at DMart"
}
```

#### Touchpoint 2 — AI Chat
```
User: "How much did I spend on food last month?"
        ↓
Gemini reads actual receipt data
        ↓
"You spent ₹6,800 on food last month across 12 receipts."
```

#### Touchpoint 3 — Prediction + Report
```
Historical spend data (category-wise, month-wise)
        ↓
Gemini analyzes trends
        ↓
{
  "predictions": [{"category": "Food", "predicted_amount": 7200, "trend": "up"}],
  "insights": ["Food spending rises on weekends..."],
  "suggestions": ["Set a ₹6000 food budget..."]
}
```

**OpenRouter config (company laptop SSL bypass):**
```python
http_client = httpx.Client(verify=False)
```

### 6. 🗄️ Database (PostgreSQL 16)

**Connection:** SQLAlchemy ORM via `psycopg2-binary`

**Schema:**
```sql
CREATE TABLE receipts (
    id           SERIAL PRIMARY KEY,
    store_name   VARCHAR,
    category     VARCHAR,      -- Food/Grocery/Clothes/Travel/Medicine/Electronics/Entertainment/Other
    total_amount FLOAT,
    date         VARCHAR,
    items        TEXT,         -- JSON array: [{"name": "...", "price": 0.00}]
    image_path   VARCHAR,
    created_at   TIMESTAMP DEFAULT NOW()
);
```

**Categories:**
`Food` · `Grocery` · `Clothes` · `Travel` · `Medicine` · `Electronics` · `Entertainment` · `Other`

---

## 🐳 Docker Architecture

```
docker-compose.yml
├── backend   (smartspend-backend)
│   ├── FROM python:3.11-slim
│   ├── COPY requirements.txt + pip install
│   ├── EXPOSE 8000 (internal only)
│   └── CMD uvicorn main:app --host 0.0.0.0 --port 8000
│
├── frontend  (smartspend-frontend)
│   ├── Stage 1: FROM node:20-alpine → npm install → npm run build
│   ├── Stage 2: FROM nginx:alpine → copy dist/ → nginx.conf
│   └── EXPOSE 80 (public)
│
└── db        (postgres:16)
    ├── POSTGRES_DB: smartspend
    ├── POSTGRES_USER: postgres
    └── Volume: pgdata (persistent)
```

**Docker network:** All 3 containers on `smartspend_default` bridge network. Backend accessible as `http://backend:8000` from within network.

---

## ☁️ AWS Deployment

```
AWS Account (Free Tier)
└── Region: us-east-1
    └── EC2 Instance: smartspend-server
        ├── AMI: Ubuntu Server 24.04 LTS
        ├── Type: t2.micro (Free Tier)
        ├── Key Pair: smartspend-key.pem
        ├── Public IP: 3.90.104.103
        └── Security Group: smartspend-sg
            ├── Port 22   → SSH (My IP only)
            ├── Port 80   → HTTP (0.0.0.0/0) ← Main entry point
            ├── Port 5432 → PostgreSQL (0.0.0.0/0)
            └── Port 8000 → FastAPI (0.0.0.0/0)
```

**Deployment flow:**
```
Local Code Change
      ↓
git push origin main
      ↓
SSH into EC2
      ↓
git pull origin main
      ↓
docker compose up --build -d
      ↓
Live at http://3.90.104.103
```

---

## 🔄 Request Flow — Receipt Upload (End to End)

```
1. User selects receipt photo on browser
          ↓
2. React sends POST multipart/form-data → http://3.90.104.103/api/receipts/upload
          ↓
3. Nginx proxies to FastAPI backend:8000
          ↓
4. FastAPI reads image bytes → converts to base64
          ↓
5. Sends to Gemini 2.0 Flash Vision via OpenRouter
          ↓
6. Gemini returns structured JSON
   {"store_name": "...", "category": "...", "total_amount": ..., "items": [...]}
          ↓
7. FastAPI saves to PostgreSQL via SQLAlchemy
          ↓
8. Returns success response to frontend
          ↓
9. React re-fetches receipts → Dashboard auto-updates
   Charts refresh · Category totals update · Recent receipts list updates
```

---

## 📦 Tech Stack Summary

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend Framework | React | 18 |
| Build Tool | Vite | 5 |
| Styling | TailwindCSS | 3 |
| Charts | Recharts | 2 |
| HTTP Client | Axios | 1 |
| Routing | React Router DOM | 6 |
| Backend Framework | FastAPI | 0.115 |
| Language | Python | 3.11 |
| ORM | SQLAlchemy | 2 |
| DB Driver | psycopg2-binary | 2.9 |
| AI Client | google-generativeai | 0.8 |
| HTTP (AI) | httpx | 0.27 |
| Server | Uvicorn | 0.30 |
| Web Server | Nginx | Alpine |
| Database | PostgreSQL | 16 |
| Containerization | Docker + Compose | 29 |
| Cloud | AWS EC2 | t2.micro |
| AI Model | Gemini 2.0 Flash | via OpenRouter |
| Source Control | GitHub | - |

---

## ✨ Key Features

| Feature | Description | AI? |
|---------|-------------|-----|
| 📸 Receipt OCR | Upload any receipt → auto extract all data | ✅ Gemini Vision |
| 🏷️ Smart Categorization | Context-aware — knows "DMart" = Grocery | ✅ Gemini |
| 📊 Spending Dashboard | KPI cards, pie chart, bar chart |
| ⏱️ Time Filters | 7D / 1M / 3M / 6M / 1Y / All |
| 💬 AI Chat | Ask questions about your spending in plain language | ✅ Gemini |
| 🔮 Prediction | Next month forecast per category with reasoning | ✅ Gemini |
| 📋 Monthly Report | One-click AI financial summary with suggestions | ✅ Gemini |
| 🧾 Receipt History | Grid view with category filter, search, detail popup |

---

## 🗂️ Project Structure

```
smartspend/
├── backend/
│   ├── routes/
│   │   └── receipts.py          # All API endpoints
│   ├── services/
│   │   ├── claude_service.py    # Gemini Vision — receipt reading
│   │   ├── prediction_service.py# AI spend prediction
│   │   ├── summary_service.py   # AI monthly report
│   │   └── chat_service.py      # AI chat with data
│   ├── database.py              # SQLAlchemy models + DB connection
│   ├── main.py                  # FastAPI app entry point
│   ├── Dockerfile               # Python 3.11-slim container
│   ├── .dockerignore
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── UploadReceipt.jsx
│   │   │   ├── ChatBox.jsx
│   │   │   ├── Prediction.jsx
│   │   │   ├── MonthlySummary.jsx
│   │   │   └── ReceiptHistory.jsx
│   │   ├── pages/
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── InsightsPage.jsx
│   │   │   └── HistoryPage.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── nginx.conf               # Reverse proxy config
│   └── Dockerfile               # Multi-stage: Node build → Nginx serve
└── docker-compose.yml           # 3-service orchestration
```

---

## 👨‍💻 Author

**Pawan Mehta**  


---

*SmartSpend — Zero manual entry. Just click a photo.*
