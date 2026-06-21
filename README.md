# SmartCredit AI 🚀

## 1. Project Overview
**SmartCredit AI** is a production-grade Alternative Credit Assessment Platform designed to help banks, fintech companies, microfinance institutions, and digital lenders evaluate individuals with little or no traditional credit history. By prioritizing financial inclusion and Explainable AI (XAI), the platform generates credit scores, risk categories, and personalized loan recommendations based on alternative financial behaviors.

## 2. Problem Statement
**The Underbanked Crisis:** Billions of people globally lack a formal credit history (often referred to as "credit invisibles"). Traditional credit scoring models rely heavily on past loan performance and credit cards. Without these, individuals cannot access fair credit, leading to reliance on predatory lending. Traditional systems fail to analyze alternative data such as utility payments, income stability, and digital transaction history.

## 3. Solution
**Alternative Credit Scoring:** SmartCredit AI solves this by analyzing alternative financial data. The system consumes bank statements, SMS transaction alerts (using NLP), and user-submitted financial profiles to create a comprehensive financial footprint. Our machine learning models (XGBoost/LightGBM) output a fair credit score, while our Explainable AI (SHAP) ensures transparency, telling users *why* they received their score and *how* to improve it.

## 4. Key Features
- **Alternative Data Engine:** Parses SMS, bank statements, and user inputs to build a financial profile.
- **Credit Assessment Engine:** Generates Credit Scores (300-850), Risk Levels, and Confidence Scores.
- **Loan Recommendation Engine:** Suggests optimal loan amounts, installment plans, and approval probabilities.
- **Explainable AI (XAI):** Transparently details factors affecting the credit score.
- **Role-Based Dashboards:** Distinct interfaces for Customers, Loan Officers, and Admins.
- **Multilingual SMS Parsing:** Support for English, Urdu, and Roman Urdu transaction extraction.

## 5. System Architecture
The platform is built on a scalable, modern microservices-inspired architecture:
- **Frontend Layer:** Next.js (React) application for responsive, fast, and SEO-friendly user interfaces.
- **Backend API Layer:** FastAPI (Python) serving high-performance RESTful endpoints.
- **Database Layer:** PostgreSQL for persistent relational data, Redis for caching and rate limiting.
- **AI/ML Layer:** Dedicated Python services running Scikit-Learn/XGBoost models for real-time inference.

## 6. Folder Structure
```text
smartcredit-ai/
├── frontend/           # Next.js App Router application
├── backend/            # FastAPI backend server
├── model/              # AI/ML training and inference pipelines
├── infrastructure/     # Docker, CI/CD, and deployment scripts
├── docs/               # Architecture diagrams and API specifications
└── docker-compose.yml  # Local development orchestration
```

## 7. Tech Stack
- **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS, Recharts, Zod.
- **Backend:** FastAPI, Python 3.12, SQLAlchemy, Alembic, JWT Auth.
- **Database:** PostgreSQL, Redis.
- **AI/ML:** XGBoost, LightGBM, Scikit-Learn, SHAP, Pandas, NumPy.
- **DevOps:** Docker, Docker Compose, Nginx, GitHub Actions.

## 8. Installation Guide
**Prerequisites:**
- Docker and Docker Compose
- Node.js (v20+)
- Python (3.12+)
- Git

Clone the repository:
```bash
git clone https://github.com/your-org/smartcredit-ai.git
cd smartcredit-ai
```

## 9. Local Development Setup
The easiest way to run the entire stack locally is using Docker Compose.

```bash
# Build and start all services
docker-compose up --build
```
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Docs (Swagger):** http://localhost:8000/docs

## 10. Environment Variables
Create a `.env` file in the root directory. Example structure:
```env
# Backend & Database
DATABASE_URL=postgresql://user:password@db:5432/smartcredit
REDIS_URL=redis://redis:6379/0
SECRET_KEY=your_super_secret_jwt_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

## 11. API Documentation
The API is self-documented via OpenAPI (Swagger). Once the backend is running, visit `/docs` to see:
- `POST /auth/login` - Authenticate user
- `POST /users/register` - Create a new user
- `POST /financial-profile` - Submit alternative financial data
- `GET /assessments/{user_id}` - Retrieve AI credit assessment

## 12. Database Design
We use a relational PostgreSQL database to ensure ACID compliance. Key tables:
- **Users:** Credentials and RBAC roles.
- **FinancialProfiles:** Income, expenses, employment data.
- **Transactions:** Parsed SMS or bank statement line items.
- **Assessments:** Historical credit scores and risk flags.

## 13. AI Model Explanation
We utilize **XGBoost** for its high performance on tabular financial data.
- **Training:** The model is trained on historical features (transaction frequency, average balance, income-to-expense ratio).
- **Inference:** Fast prediction endpoints powered by FastAPI.
- **XAI:** **SHAP (SHapley Additive exPlanations)** is applied to the model outputs to break down the exact contribution of each feature to the final credit score, providing actionable feedback to the customer.

## 14. Deployment Guide
**Production Deployment:**
1. Provision a cloud instance (AWS EC2, DigitalOcean Droplet).
2. Install Docker and Docker Compose.
3. Configure `nginx.conf` in the `infrastructure/` folder for reverse proxying and SSL (Let's Encrypt).
4. Run `docker-compose -f infrastructure/docker-compose.prod.yml up -d`.

## 15. User Guide
- **Customers:** Sign up, fill out the financial profile form, and upload transaction data (or paste SMS logs). View your dashboard for your Credit Score and AI-driven improvement tips.
- **Loan Officers:** Log in to review pending applications. The dashboard highlights risk factors and SHAP explanations for transparent decision making.

## 16. Screenshots Placeholder
*(Add screenshots here once the UI is finalized)*
- `![Customer Dashboard](./docs/screenshots/customer_dashboard.png)`
- `![Loan Officer View](./docs/screenshots/loan_officer.png)`

## 17. Future Roadmap
- **Q3:** Integration with Open Banking APIs (Plaid/SaltEdge).
- **Q4:** Mobile app deployment (React Native).
- **Q1 Next Year:** Deep Learning sequence models for advanced anomaly and fraud detection in transaction streams.

## 18. Contributors Guide
We welcome contributions! Please follow these steps:
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

## 19. License
Distributed under the MIT License. See `LICENSE` for more information.
