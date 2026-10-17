# 🧾 SmartSpend — AI-Powered Personal Finance Assistant

> **Upload a receipt. Let AI handle the rest.**

SmartSpend is an AI-powered expense tracking application that simplifies personal finance management by automatically extracting, categorizing, and analyzing receipt data. Users simply upload a receipt image, and AI converts it into structured expense information, enabling intelligent spending analysis and financial insights.

> 🚧 **Project Status:** Under Active Development

---

# ✨ Key Features

## 📸 AI Receipt Scanner

- Upload printed, handwritten, or multilingual receipts
- AI extracts:
  - Store Name
  - Purchase Date
  - Purchased Items
  - Total Amount
  - Expense Category
- Automatic receipt parsing using Vision AI
- No manual data entry required

---

## 📊 Expense Dashboard

Monitor your expenses with interactive analytics.

Current dashboard includes:

- Total Expenses
- Total Receipts
- Expense Categories
- Monthly Spending Trends
- Recent Transactions
- Interactive Charts

---

## 🤖 AI Financial Insights *(In Progress)*

Generate intelligent spending insights based on historical expenses.

Examples:

- Monthly spending summary
- Highest spending category
- Personalized recommendations
- Spending pattern analysis

---

## 🔮 Expense Prediction *(Planned)*

Predict future expenses using historical spending data.

Planned features:

- Monthly expense prediction
- Category-wise forecasts
- Spending trend analysis

---

## 💬 AI Financial Assistant *(Planned)*

Ask questions in natural language.

Example queries:

- How much did I spend this month?
- Show my food expenses.
- Which store do I visit most?
- What was my biggest purchase?

---

## 📂 Receipt History

- View all uploaded receipts
- Search by merchant
- Filter by category
- View item-wise details

---

# 🛠 Tech Stack

| Layer | Technology |
|--------|------------|
| Frontend | React + Vite |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Backend | FastAPI |
| AI | OpenRouter Vision Models |
| Database | PostgreSQL |
| ORM | SQLAlchemy |
| Containerization | Docker & Docker Compose |
| Reverse Proxy | Nginx |
| Deployment | AWS EC2 |

---

# ⚙️ System Workflow

```text
                 User
                   │
                   ▼
          Upload Receipt Image
                   │
                   ▼
          FastAPI Backend API
                   │
                   ▼
          OpenRouter Vision AI
                   │
                   ▼
      Extract Structured JSON
                   │
                   ▼
           PostgreSQL Database
                   │
                   ▼
     Dashboard & Analytics Layer
                   │
                   ▼
         AI Insights & Predictions
```

---

# 📁 Project Structure

```text
smartspend/
│
├── backend/
│   ├── routes/
│   ├── services/
│   ├── database.py
│   ├── main.py
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── Dockerfile
│   └── nginx.conf
│
├── docker-compose.yml
└── README.md
```

---

# 🔌 API Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/` | Health Check |
| POST | `/receipts/upload` | Upload Receipt |
| GET | `/receipts` | Get All Receipts |

> Additional endpoints for AI Chat, Predictions, Budgeting, and Insights are currently under development.

---

# 🚀 Getting Started

## Clone Repository

```bash
git clone https://pscode.lioncloud.net/sdecraft/trainings/leading-w-psai-products/batch-19/smartspend.git

cd smartspend
```

---

## Backend Setup

Create a `.env` file inside `backend/`

```env
OPENROUTER_API_KEY=your_api_key

DATABASE_URL=postgresql://postgres:password@localhost:5432/smartspend
```

Install dependencies

```bash
pip install -r requirements.txt
```

Run the backend

```bash
uvicorn main:app --reload
```

---

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

## Run with Docker

```bash
docker compose up --build
```

---

# 📈 Development Roadmap

## ✅ Phase 1 (Completed)

- AI Receipt Upload
- Vision-based Receipt Extraction
- PostgreSQL Integration
- FastAPI REST APIs
- Dockerized Backend

---

## 🚧 Phase 2 (In Progress)

- Expense Dashboard
- Interactive Charts
- Receipt History
- Expense Categories

---

## ⏳ Phase 3

- AI Financial Assistant
- Monthly Spending Insights
- Personalized Recommendations
- Expense Prediction

---

## ⏳ Phase 4

- Budget Tracking
- JWT Authentication
- Multi-user Support
- Email Reports
- PDF Export

---

# 🌟 Future Enhancements

- OCR Confidence Score
- Duplicate Receipt Detection
- Multi-language Support
- Mobile Application
- Cloud Storage Integration
- Excel & PDF Export
- Voice-based Expense Assistant

---

# 👨‍💻 Contributors

**Akanksha Upare & Pawan Mehta**

---

# ⭐ Highlights

- AI-powered receipt understanding
- Automatic expense categorization
- PostgreSQL database integration
- FastAPI REST architecture
- Dockerized deployment
- Cloud-ready architecture
- Interactive analytics dashboard
- Built with scalable backend architecture
- Under active development with planned AI features

---

# 🚧 Project Status

**Current Status:** **Actively Under Development** 🚀

SmartSpend is currently under active development. Core functionalities such as AI-powered receipt extraction, PostgreSQL integration, and the backend infrastructure are implemented. Additional features, including AI-powered financial insights, expense prediction, conversational assistant, budgeting, and advanced analytics, are being developed and will be added in upcoming releases.

---