# Sales Lens

AI-powered analytics dashboard for CSV and Excel business data visualization.

---

## Overview

Sales Lens is a futuristic analytics platform where users can:

- Upload CSV and Excel files
- Process datasets through an AI backend
- Visualize analytics in interactive dashboards
- Export reports as PDF
- Export KPI summaries as CSV
- View AI-generated business insights

Frontend built using:

- React
- Vite
- Tailwind CSS
- Recharts
- Framer Motion

---

# Features

## File Upload & Analysis

- Drag & drop CSV/XLSX upload
- File validation
- CSV parsing using PapaParse
- Excel parsing using ExcelJS
- Backend API integration

---

## Dashboard Analytics

Interactive charts powered by Recharts:

- Revenue trend line chart
- Top products/categories bar chart
- Regional breakdown pie chart
- Month-over-month comparison chart
- KPI scorecards
- AI narrative summary

---

## Export System

- Export full dashboard as PDF
- Export KPI table as CSV
- Dashboard screenshot rendering using html2canvas
- PDF generation using jsPDF

---

# Tech Stack

## Frontend

- React
- Vite
- Tailwind CSS
- React Router DOM
- Framer Motion
- Recharts
- Lucide React

## File Processing

- PapaParse
- ExcelJS

## Export Utilities

- jsPDF
- html2canvas

---

# Folder Structure

```bash
src/
│
├── api/
├── services/
├── utils/
├── hooks/
├── data/
│
├── routes/
│   └── AppRoutes.jsx
│
├── components/
│   ├── dashboard/
│   ├── layout/
│   └── ui/
│
├── pages/
│   ├── Home.jsx
│   ├── About.jsx
│   ├── Features.jsx
│   ├── Analyze.jsx
│   ├── Contact.jsx
│   └── Dashboard.jsx
│
├── App.jsx
└── main.jsx
```

---

# Installation

## Clone Repository

```bash
git clone <your-repository-url>
```

---

## Navigate Into Project

```bash
cd frontend
```

---

## Install Dependencies

```bash
npm install
```

---

# Run Development Server

```bash
npm run dev
```

---

# Production Build

```bash
npm run build
```

---

# Backend API

Frontend expects backend API at:

```bash
VITE_API_URL
```

Expected request:

```json
{
  "fileName": "sales.csv",
  "data": []
}
```

---

# Dashboard Loading Flow

```text
Upload File
   ↓
Parse CSV / Excel
   ↓
Navigate Dashboard
   ↓
Dashboard Sends Backend Request
   ↓
Loading State
   ↓
Backend Response
   ↓
Render Charts & KPIs
```

---

# Environment Variables

Create `.env` file if needed:

```env
VITE_API_URL=http://a.example.com
```

---

# Security Notes

- Only CSV and Excel files are accepted
- File size validation included
- No backend secrets stored in frontend
- `.env` ignored from Git

---

# Future Improvements

- Authentication system
- Multi-file analysis
- Real-time analytics
- AI forecasting
- Advanced filtering
- Saved reports
- User workspace system

---

# License

MIT License

---

# Author

Built with React + Tailwind + Vite
by Sales Lens