# Sales Lens 🔍📊

Sales Lens is a full-stack Business Intelligence (BI) and analytics platform designed to transform raw supermarket and retail transaction data into actionable, executive-ready insights. By leveraging robust data pipelines, scalable storage, and generative AI, Sales Lens processes large datasets and autogenerates smart narrative descriptions alongside interactive charts.

---

## 🚀 Key Features

*   **Advanced Data Ingestion & ETL:** Supports asynchronous processing and validation of large retail files (`.csv`, `.xlsx`).
*   **Multi-Cloud Storage & Warehousing:** Integrated seamlessly with **AWS S3** for secure staging and **Snowflake** for scalable cloud data warehousing.
*   **AI-Powered Narrative Insights:** Powered by **Google Gemini Pro** to automatically parse historical metrics and generate human-like textual analytics summaries.
*   **Interactive Analytics Dashboard:** Real-time generation of custom Key Performance Indicators (KPIs), multi-regional breakdowns, and predictive product performance charts.
*   **Smooth Export Systems:** Effortless on-demand exporting capabilities for transformed data into dynamic presentation matrices.

---

## 🛠️ Tech Stack

### Backend
*   **Framework:** Python / Django & Django REST Framework (DRF)
*   **Cloud Data Storage:** AWS S3
*   **Data Warehouse:** Snowflake Cloud Data Platform
*   **Generative AI:** Google Gemini API
*   **Utilities:** `etl_service`, `csvParser`, `excelParser`

### Frontend
*   **Build Tool & Framework:** React (Vite)
*   **Styling:** Modern CSS (Responsive Layouts)
*   **State & Routing:** React Hooks, React Router DOM
*   **Linter:** ESLint

---

## 📁 Repository Structure

```text
Sales-Lens-main/
├── Backend/                    # Django Backend Application
│   ├── analytics/              # Business intelligence logic and processing views
│   ├── sales_analytics/        # Core project configuration settings, URLs, and ASGI/WSGI
│   ├── services/               # Staging modules (S3, Snowflake, Gemini AI integrations)
│   ├── uploads/                # Database models and migration profiles for file ingestions
│   ├── manage.py               # Django administrative task script
│   └── requirements.txt        # Python library dependencies
│
├── frontend/                   # React Frontend Client (Vite)
│   ├── src/
│   │   ├── components/         # Modular layout segments, dashboard widgets, and chart engines
│   │   ├── pages/              # Static & dynamic routes (Home, Analyze, Dashboard, Uploads)
│   │   ├── services/           # Dedicated parsing functions for CSV/Excel data streams
│   │   └── utils/              # Data export format engines
│   ├── index.html
│   └── vite.config.js          # Vite build tool setup environment
│
├── sales.csv                   # Sample transaction dataset
└── sales_data.csv              # Production analytics dataset
