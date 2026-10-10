# SaaS Metrics Dashboard

A polished black-and-orange SaaS analytics dashboard with a **separate React frontend and Express backend** in one repository. Run them locally on separate ports: the frontend on `http://localhost:5173` and API on `http://localhost:5000`.

## Features
- Responsive dashboard with revenue, MRR, active customers, churn and growth metrics
- Interactive revenue and customer-growth charts
- Date-range filter and workspace/tenant switcher
- Team member table with role badges and role updates
- Invoice list and downloadable CSV export
- Stripe connection status panel and demo revenue data
- Daily email digest settings UI and API endpoint
- Tenant-scoped API data: tenant is selected via `x-tenant-id`; the API only returns records for that tenant
- Frontend works in **demo mode** if the backend is not running, so you can preview the UI immediately
- One repository contains both apps; frontend files are under `frontend/`, backend files under `backend/`

## Requirements
- Node.js 18+ (Node 20 LTS recommended)
- npm

## Run locally
Open a terminal in the project root:

```bash
npm install
npm run install:all
npm run dev
```

Then open `http://localhost:5173`. The API health endpoint is `http://localhost:5000/api/health`.

If you prefer separate terminals:
```bash
cd backend
npm install
npm run dev
```
In another terminal:
```bash
cd frontend
npm install
npm run dev
```

## Environment variables
Copy `backend/.env.example` to `backend/.env` if you want to configure optional integrations.

- `PORT=5000`
- `FRONTEND_ORIGIN=http://localhost:5173`
- `STRIPE_SECRET_KEY=` optional; never put secret keys in frontend code
- `STRIPE_WEBHOOK_SECRET=` optional
- `RESEND_API_KEY=` optional email provider key
- `FROM_EMAIL=` optional verified sender address

Without Stripe or email credentials, the app uses seeded demo data and marks those integrations as demo/unconfigured. This avoids blocking local preview.

## Architecture
- `frontend/`: Vite + React + TypeScript + Recharts
- `backend/`: Express REST API with tenant-scoped sample data and safe input validation
- `frontend/src/lib/api.ts`: API client; automatically falls back to seeded demo data if API is unavailable
- `backend/src/data.ts`: demo tenants, metrics, invoices and team data

## Important implementation notes and tradeoffs
1. **Multi-tenancy demo:** tenant identity is selected using a header and validated against a server-side allow-list. Every tenant-specific route scopes its data by that tenant ID. This demonstrates tenant isolation, but production applications must derive tenant identity from a verified session/JWT, not trust a user-controlled header.
2. **Authentication:** the current build is a reviewable prototype and does not include production authentication. Do not expose it publicly with real customer data until authentication, authorization and tenant membership checks are added.
3. **Stripe:** the integration panel and server configuration are included. Live Stripe revenue requires a valid server-side secret key, webhook verification, and mapping Stripe customers/events to tenants. Demo metrics are displayed when credentials are absent.
4. **Daily email:** digest preferences are stored in-memory in this prototype and a backend endpoint is provided. A persistent database and scheduler (e.g. cron/queue) plus a verified email provider are needed for reliable scheduled delivery.
5. **Persistence:** team role changes and digest settings are in-memory and reset when the backend restarts. Add PostgreSQL/Prisma or another database for production persistence.
6. **Invoices:** CSV export is implemented client-side; invoice PDF generation and Stripe invoice synchronization can be added for a production deployment.

## API routes
- `GET /api/health`
- `GET /api/dashboard?range=30d`
- `GET /api/team`
- `PATCH /api/team/:id/role`
- `GET /api/invoices`
- `GET /api/settings/digest`
- `PUT /api/settings/digest`
- `GET /api/integrations/stripe`

All tenant-specific requests use `x-tenant-id` (demo tenants: `acme`, `orbit`, `northstar`).

## Deploy
Deploy frontend and backend separately if desired, even though they share one repository. Configure the frontend `VITE_API_URL` to your deployed API URL. Configure the API CORS origin to your frontend domain. GitHub Pages can host the frontend static build, but the Express backend requires a Node-capable host (e.g. Render, Railway, Fly.io or a VPS); GitHub Pages cannot run the backend.

## License
MIT for this starter project.
