<div align="center">

# 🧾 SmartSpend

### AI-Powered Personal Finance Platform

**Upload a receipt. Let AI handle the rest.**

A production-oriented full-stack application built with **React/Vite** and **Python FastAPI**, containerized with **Docker** and deployed on **AWS** (S3 · CloudFront · ALB · ECS Fargate · ECR · CloudWatch).

[![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?logo=react&logoColor=white)](#-tech-stack)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi&logoColor=white)](#-tech-stack)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-4169E1?logo=postgresql&logoColor=white)](#-tech-stack)
[![Docker](https://img.shields.io/badge/Container-Docker-2496ED?logo=docker&logoColor=white)](#-docker)
[![AWS](https://img.shields.io/badge/Cloud-AWS-FF9900?logo=amazonaws&logoColor=white)](#-aws-deployment)
[![Status](https://img.shields.io/badge/Status-Active%20Development-brightgreen)](#-roadmap)

[**🌐 Live Demo**](#) · [**🏗 Architecture**](#-architecture) · [**📚 Documentation**](#-documentation) · [**🗺 Roadmap**](#-roadmap)

</div>

---

## 📖 Table of Contents

1. [Overview](#-overview)
2. [Application Preview](#-application-preview)
3. [Highlights](#-highlights)
4. [Features](#-features)
5. [Architecture](#-architecture)
6. [Request Lifecycle](#-request-lifecycle)
7. [Tech Stack](#-tech-stack)
8. [Project Structure](#-project-structure)
9. [API Reference](#-api-reference)
10. [Local Development](#-local-development)
11. [Docker](#-docker)
12. [Testing](#-testing)
13. [AWS Deployment](#-aws-deployment)
14. [Terraform (Infrastructure as Code)](#-terraform-infrastructure-as-code)
15. [CI/CD](#-cicd)
16. [Security](#-security)
17. [Observability](#-observability)
18. [Engineering Journey](#-engineering-journey)
19. [Roadmap](#-roadmap)
20. [Documentation](#-documentation)
21. [Contributors](#-contributors)

---

## 🎯 Overview

SmartSpend turns a photo of a receipt into structured financial data. Users upload a printed, handwritten, or multilingual receipt; a Vision AI model extracts the merchant, date, line items, total and category; the data is stored in PostgreSQL and surfaced through an interactive analytics dashboard.

Beyond the product itself, SmartSpend is an **end-to-end engineering project** that demonstrates the full delivery lifecycle:

```text
Development → Testing → Docker → AWS → Terraform → CI/CD → Monitoring
```

> **Credibility over decoration.** Every claim in this README maps to code, configuration, or a working deployment. Items still being built are clearly marked **🚧 In Progress** or **⏳ Planned**.

---

## 🖼 Application Preview

> Replace the placeholders below with real screenshots from the deployed app (crop browser/account details first).

| Dashboard | Receipt Upload |
|:---:|:---:|
| ![Dashboard](docs/screenshots/dashboard.png) | ![Receipt Upload](docs/screenshots/receipt-upload.png) |

| Analytics | Receipt History |
|:---:|:---:|
| ![Analytics](docs/screenshots/analytics.png) | ![Receipt History](docs/screenshots/receipt-history.png) |

---

## ✨ Highlights

- 🤖 **AI receipt understanding**: Vision models extract structured JSON from receipt images
- ⚛️ **React/Vite** frontend with Tailwind CSS and Recharts
- ⚡ **FastAPI** backend served by Uvicorn
- 🐘 **PostgreSQL** persistence via SQLAlchemy
- 🐳 **Dockerized** backend, images versioned in **Amazon ECR**
- ☁️ **ECS Fargate** runtime behind an **Application Load Balancer** with `/health` target checks
- 🌍 **S3 + CloudFront** static delivery, with `/api/*` routed to the backend
- 📈 **CloudWatch** runtime logs
- 🧪 Automated tests, Terraform, and CI/CD *(in progress, see [status](#-roadmap))*

---

## 🚀 Features

### 📸 AI Receipt Scanner
- Upload printed, handwritten, or multilingual receipts
- AI extracts **store name, purchase date, items, total amount, and category**
- No manual data entry

### 📊 Expense Dashboard
- Total expenses and total receipts
- Spending by category
- Monthly spending trends
- Recent transactions
- Interactive charts

### 📂 Receipt History
- Browse all uploaded receipts
- Search by merchant
- Filter by category
- View item-level details

### 🤖 AI Financial Insights — 🚧 In Progress
- Monthly spending summary
- Highest spending category
- Personalized recommendations
- Spending pattern analysis

### 🔮 Expense Prediction — ⏳ Planned
- Monthly expense forecast
- Category-wise forecasts
- Spending trend analysis

### 💬 AI Financial Assistant — ⏳ Planned
Ask questions in natural language:
- *"How much did I spend this month?"*
- *"Show my food expenses."*
- *"Which store do I visit most?"*
- *"What was my biggest purchase?"*

---

## 🏗 Architecture

### Deployed AWS Topology

```mermaid
flowchart LR
    U([👤 User / Browser]) -->|HTTPS| CF[Amazon CloudFront]

    CF -->|"/* static"| S3[(Amazon S3<br/>React/Vite build)]
    CF -->|"/api/*"| ALB[Application Load Balancer]

    ALB -->|healthy targets only<br/>GET /health| ECS

    subgraph ECS[Amazon ECS Fargate]
        API[FastAPI + Uvicorn<br/>Docker container]
    end

    ECR[(Amazon ECR<br/>versioned images)] -.->|image pull| ECS
    API -->|SQLAlchemy| PG[(PostgreSQL<br/>Amazon EC2)]
    API -->|Vision request| OR[OpenRouter<br/>Vision Models]
    API -.->|logs| CW[Amazon CloudWatch Logs]
```

**Why this design?**
The frontend and backend evolve and deploy **independently**. Static assets are served from S3 through CloudFront's edge network, while API traffic follows a separate path to a containerized backend. The ALB only routes to tasks that pass `/health`, so a bad release never receives normal traffic.

### Application Flow

```mermaid
flowchart TD
    A[User uploads receipt image] --> B[FastAPI backend]
    B --> C[OpenRouter Vision AI]
    C --> D[Structured JSON:<br/>store · date · items · total · category]
    D --> E[(PostgreSQL)]
    E --> F[Dashboard & Analytics]
    F --> G[AI Insights & Predictions<br/>🚧 in progress]
```

---

## 🔁 Request Lifecycle

How a browser action becomes a database operation:

```mermaid
sequenceDiagram
    autonumber
    participant B as Browser (React)
    participant CF as CloudFront
    participant ALB as ALB
    participant API as FastAPI (ECS Fargate)
    participant AI as OpenRouter Vision
    participant DB as PostgreSQL

    B->>CF: POST /api/receipts/upload (image)
    CF->>ALB: Forward /api/* request
    ALB->>API: Route to healthy task
    API->>AI: Send image for extraction
    AI-->>API: Structured JSON
    API->>DB: INSERT receipt + items
    DB-->>API: Saved record
    API-->>ALB: JSON response
    ALB-->>CF: Response
    CF-->>B: Response → UI updates
```

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Backend | Python FastAPI + Uvicorn |
| AI | OpenRouter Vision Models |
| Database | PostgreSQL |
| ORM | SQLAlchemy |
| Containerization | Docker & Docker Compose |
| Static Delivery | Amazon S3 + Amazon CloudFront |
| Compute | Amazon ECS on Fargate |
| Load Balancing | Application Load Balancer |
| Image Registry | Amazon ECR |
| Observability | Amazon CloudWatch Logs |
| IaC | Terraform *(🚧 in progress)* |
| CI/CD | GitHub Actions *(🚧 in progress)* |

---

## 📁 Project Structure

```text
smartspend/
├── frontend/                 # React + Vite application
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── .env.example
│
├── backend/                  # FastAPI application
│   ├── routes/               # API route handlers
│   ├── services/             # Business logic & AI integration
│   ├── models/               # SQLAlchemy models
│   ├── tests/                # Backend tests
│   ├── main.py               # App entrypoint
│   ├── database.py           # DB engine & session
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
│
├── infrastructure/
│   └── terraform/            # IaC (added as it becomes functional)
│
├── .github/workflows/        # CI/CD (added as workflows start passing)
│
├── docs/
│   ├── screenshots/
│   ├── diagrams/
│   ├── deployment/
│   └── adr/                  # Architecture Decision Records
│
├── docker-compose.yml        # Local orchestration
└── README.md
```

---

## 🔌 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Service info |
| `GET` | `/health` | Health check (used by ALB target group) |
| `POST` | `/receipts/upload` | Upload a receipt image for AI extraction |
| `GET` | `/receipts` | List all receipts |

> In production, browser calls go through CloudFront as `/api/*`.
> Endpoints for AI chat, predictions, budgeting, and insights are under development.
> Interactive docs are available locally at `http://localhost:8000/docs` (Swagger UI).

---

## 💻 Local Development

### Prerequisites
- Node.js 18+
- Python 3.10+
- PostgreSQL (local or Docker)
- An [OpenRouter](https://openrouter.ai) API key

### 1. Clone

```bash
git clone https://github.com/Pawan2030/smartspend.git
cd smartspend
```

### 2. Backend

```bash
cd backend
python -m venv .venv

# macOS / Linux
source .venv/bin/activate
# Windows (PowerShell)
.venv\Scripts\Activate.ps1

pip install -r requirements.txt
cp .env.example .env        # then edit values
uvicorn main:app --reload
```

`backend/.env`:

```env
OPENROUTER_API_KEY=your_api_key_here
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/smartspend
```

Backend runs at **http://localhost:8000**.

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env        # then edit values
npm run dev
```

Frontend runs at **http://localhost:5173**.

---

## 🐳 Docker

Run the full stack locally:

```bash
docker compose up --build
```

Build and run only the backend image:

```bash
docker build -t smartspend-backend ./backend
docker run -p 8000:8000 --env-file backend/.env smartspend-backend
```

---

## 🧪 Testing

> 🚧 **Status: In progress.** Commands below are the target workflow; they will be confirmed here once the suite is in place.

| Layer | Coverage target |
|---|---|
| Backend unit tests | Calculations, transformations, validation |
| Backend API tests | Route status codes, validation, error paths |
| Database tests | Persistence against an isolated test DB / dependency override |
| Frontend component tests | Rendering and interaction of critical components |
| Integration tests | Frontend ↔ backend contracts |
| Smoke tests | `/health` + one read and one write path after deployment |

```bash
# Backend
cd backend
pytest -v
pytest --cov            # after coverage is configured

# Frontend (use the scripts defined in package.json)
cd frontend
npm test
```

---

## ☁️ AWS Deployment

### What is deployed

| Component | Service |
|---|---|
| Frontend hosting | Amazon S3 |
| CDN / HTTPS entry point | Amazon CloudFront |
| API routing | CloudFront `/api/*` → Application Load Balancer |
| Backend runtime | Amazon ECS on Fargate |
| Image registry | Amazon ECR |
| Health validation | ALB target group on `/health` |
| Database | PostgreSQL on Amazon EC2 |
| Logs | Amazon CloudWatch Logs |

### Backend release flow

```mermaid
flowchart LR
    A[FastAPI code change] --> B[docker build]
    B --> C[Versioned image]
    C --> D[(Push to ECR)]
    D --> E[New ECS task revision]
    E --> F[ECS service deployment]
    F --> G{ALB /health<br/>passes?}
    G -->|yes| H[Receives traffic]
    G -->|no| I[Old task keeps serving]
    H --> J[Verify in CloudWatch]
```

### Frontend release flow

```mermaid
flowchart LR
    A[React change] --> B[Vite production build]
    B --> C[dist/]
    C --> D[Sync to S3]
    D --> E[CloudFront invalidation]
    E --> F[UI + API smoke test]
```

```bash
# Frontend release (example)
cd frontend
npm run build
aws s3 sync dist/ s3://<your-bucket> --delete
aws cloudfront create-invalidation --distribution-id <ID> --paths "/*"
```

```bash
# Backend release (example)
docker build -t smartspend-backend ./backend
docker tag smartspend-backend:latest <account>.dkr.ecr.<region>.amazonaws.com/smartspend-backend:<version>
docker push <account>.dkr.ecr.<region>.amazonaws.com/smartspend-backend:<version>
# then register a new ECS task revision and update the service
```

> Replace `<...>` placeholders with your own values. Never commit real account IDs, bucket names, or distribution IDs if you consider them sensitive.

---

## 🏗 Terraform (Infrastructure as Code)

> 🚧 **Status: In progress.** The current AWS environment was built manually and iteratively. Terraform is the next layer, for repeatability and reviewable infrastructure changes.

**Target structure:**

```text
infrastructure/terraform/
├── providers.tf
├── versions.tf
├── variables.tf
├── outputs.tf
├── main.tf
└── modules/
    ├── networking/
    ├── ecr/
    ├── ecs/
    ├── alb/
    ├── frontend-s3/
    ├── cloudfront/
    ├── iam/
    └── monitoring/
```

**Quality gates:**

```bash
terraform fmt -check
terraform validate
terraform plan
```

- No `*.tfstate` or secret `*.tfvars` in Git
- Outputs expose useful identifiers, never secrets

---

## 🔄 CI/CD

> 🚧 **Status: In progress.** This is the target pipeline, not a claim about current workflows. Badges will be added only once workflows are passing.

```mermaid
flowchart TD
    A[Pull Request / Push] --> B[GitHub Actions]
    B --> C[Frontend]
    B --> D[Backend]
    C --> C1[npm ci] --> C2[test + build] --> C3[S3 sync] --> C4[CloudFront invalidation]
    D --> D1[pytest] --> D2[docker build] --> D3[image scan] --> D4[push to ECR] --> D5[deploy to ECS]
    C4 --> E[Post-deploy smoke test]
    D5 --> E
```

| Stage | Behaviour |
|---|---|
| **Pull requests** | Lint, tests, frontend build, Docker build, Terraform fmt/validate/plan where safe |
| **Main branch** | Publish approved artifacts and deploy only after quality gates pass |
| **Post-deploy** | Verify `/health` and one API workflow; fail visibly on error |

---

## 🔐 Security

| Practice | Implementation |
|---|---|
| Secrets | Never committed. Use `.env` locally (git-ignored) and `.env.example` with placeholders only |
| Cloud credentials | Local AWS credential chain or CI secret store |
| Database URL | Placeholder in docs; real value via environment |
| Terraform | `*.tfstate` and secret `*.tfvars` git-ignored |
| Containers | Dependency hardening in progress following security findings |
| Scanning | Expanded image/dependency scanning planned in CI |

**Recommended `.gitignore` entries:**

```gitignore
.env
.env.*
!.env.example
*.tfstate
*.tfstate.*
*.tfvars
.terraform/
node_modules/
__pycache__/
.venv/
dist/
```

> ⚠️ If any credential was ever exposed during development, **rotate it** before making the repository public. Removing a secret in a later commit does not remove it from Git history.

---

## 📈 Observability

- **Health:** ALB target group checks `GET /health`
- **Logs:** Container output streamed to Amazon CloudWatch Logs
- **Planned:** Alarms and alerting beyond basic health checks and logs

---

## 🧭 Engineering Journey

Real problems solved on the way from local code to a working cloud deployment:

- Prepared the FastAPI backend, Dockerfile, and environment-based configuration
- Set up a Docker/WSL2 toolchain, built the image, and pushed it to ECR
- Configured ECS Fargate and an ALB target group using `/health`
- Debugged security-group rules so the target could become healthy
- Built the Vite frontend, synced assets to S3, and delivered them via CloudFront
- Added CloudFront `/api/*` routing so frontend calls reached the ALB/backend instead of the static S3 origin
- Validated the full **CloudFront → ALB → ECS/FastAPI → PostgreSQL** flow end to end
- Began hardening container dependencies after security findings, and am now adding tests, Terraform, and CI/CD

---

## 🗺 Roadmap

### ✅ Completed
- [x] React/Vite frontend
- [x] FastAPI backend
- [x] AI receipt extraction (Vision models)
- [x] PostgreSQL integration
- [x] Dockerized backend + Amazon ECR image flow
- [x] ECS Fargate deployment
- [x] ALB with `/health` checks
- [x] S3 + CloudFront frontend delivery
- [x] CloudFront `/api/*` backend routing
- [x] CloudWatch runtime logs

### 🚧 In Progress
- [ ] Expense dashboard polish, interactive charts, receipt history
- [ ] Automated backend and frontend tests
- [ ] Terraform infrastructure representation
- [ ] GitHub Actions CI/CD
- [ ] AI financial insights

### ⏳ Planned
- [ ] AI financial assistant (natural-language queries)
- [ ] Expense prediction
- [ ] Budget tracking
- [ ] JWT authentication & multi-user support
- [ ] Email reports & PDF/Excel export
- [ ] Monitoring and alerting beyond basic logs
- [ ] Expanded security scanning and quality gates

### 💡 Future Ideas
- OCR confidence score
- Duplicate receipt detection
- Multi-language support
- Mobile application
- Voice-based expense assistant

---

## 📚 Documentation

| Document | Purpose |
|---|---|
| `docs/architecture.md` | Components, boundaries, request flows |
| `docs/deployment/aws.md` | AWS services, update flows, smoke checks |
| `docs/testing.md` | Test strategy, fixtures, commands |
| `docs/terraform.md` | IaC structure and environments |
| `docs/cicd.md` | Pipeline triggers, stages, deployment policy |
| `docs/security.md` | Public-repo hardening and secret management |
| `docs/adr/` | Architecture Decision Records |

**Planned ADRs**
- ADR-001: React/Vite as the frontend build model
- ADR-002: FastAPI packaged in Docker and run on ECS Fargate
- ADR-003: CloudFront as a single browser entry point with `/api/*` routing
- ADR-004: Migrating from manual AWS setup toward Terraform

---

## 👨‍💻 Contributors

**Pawan Mehta**

---

<div align="center">

**SmartSpend**: built to learn, built to ship, built to be verified.

⭐ If you find this project interesting, consider giving it a star.

</div>
