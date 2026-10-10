# SaaS Metrics Dashboard

A modern full-stack SaaS analytics dashboard built with **React, TypeScript, Vite, Node.js, and Express**. It provides a centralized interface for monitoring business performance, reviewing customer metrics, managing invoices, and viewing team information.

## Features

* **Revenue Analytics:** Visualize revenue trends and key business performance indicators.
* **Customer Metrics:** Review customer and subscription-related statistics.
* **Interactive Dashboard:** Explore analytics with a clean, responsive interface.
* **Multi-Tenant Demo:** Switch between sample SaaS organizations.
* **Team Management:** View team members and update supported roles.
* **Invoice Management:** Review invoice records and export data as CSV.
* **Settings Interface:** Explore dashboard preferences and email digest settings.
* **Stripe Demo Status:** View the sample payment integration status.
* **REST API:** Access dashboard, team, invoice, and settings endpoints through Express.
* **Demo Mode:** The frontend can display sample data when the backend is unavailable.
* **Modern UI:** Dark dashboard design with orange accents, charts, and responsive layouts.

## Tech Stack

### Frontend

* React
* TypeScript
* Vite
* Recharts
* CSS

### Backend

* Node.js
* Express
* TypeScript
* REST API

## Project Structure

```text
saas-metrics-dashboard/
├── backend/
│   ├── src/
│   │   ├── data.ts
│   │   └── index.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── styles.css
│   │   ├── types.ts
│   │   └── lib/
│   │       └── api.ts
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── package.json
├── .gitignore
└── README.md
```

## Prerequisites

Install the following before running the project:

* Node.js LTS
* npm
* Visual Studio Code (recommended)

## Installation

### 1. Download the repository

Download or clone the project and open the root folder in Visual Studio Code.

### 2. Install dependencies

Open a terminal in the root project directory and run:

```bash
npm install
npm run install:all
```

### 3. Start the frontend

```bash
npm run dev:frontend
```

Open the local URL shown in your terminal. The default Vite address is usually:

`http://localhost:5173`

The frontend includes demo fallback data so you can preview the dashboard without starting the API.

### 4. Start the backend

Open a second terminal in the root project directory and run:

```bash
npm run dev:backend
```

The backend is configured to run on port `5000` by default.

Check the API health endpoint:

`http://localhost:5000/api/health`

## API Overview

The Express backend provides endpoints for:

* Health checks
* Tenant-specific dashboard metrics
* Team member and role management
* Invoice records
* Email digest settings
* Stripe integration demo status

Tenant-aware requests use the `x-tenant-id` header. Sample tenant IDs include `acme`, `orbit`, and `northstar`.

## Demo Data and Integrations

This project currently uses sample data and in-memory state for demonstration purposes. Data changes may reset when the backend restarts.

The Stripe status and email digest features demonstrate dashboard/API workflows; they do not constitute a fully configured live Stripe integration or a scheduled email delivery service. No production database or live payment processing is configured by default.

## Future Improvements

* Integrate a persistent database such as PostgreSQL or MongoDB.
* Add authentication and role-based access control.
* Connect Stripe using secure server-side credentials and webhooks.
* Implement scheduled email reports.
* Add automated tests and production deployment configuration.

## Purpose

This project demonstrates full-stack development skills, REST API integration, dashboard UI development, data visualization, tenant-aware sample data, and frontend fallback handling.

## Author

**Sawaira Ijaz**
Computer Science Undergraduate & Researcher

## License

This project is intended for educational and portfolio demonstration purposes. Add a formal license if you plan to distribute it for reuse.
