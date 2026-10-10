import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Stripe from "stripe";
import { dashboardData, invoicesByTenant, teamByTenant, tenants, type TenantId } from "./data.js";

dotenv.config();
const app = express();
const port = Number(process.env.PORT || 5000);
app.use(cors({ origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173" }));
app.use(express.json({ limit: "100kb" }));

const allowedTenants = new Set(Object.keys(tenants));
function tenantFromRequest(req: express.Request, res: express.Response, next: express.NextFunction) {
  const requested = String(req.header("x-tenant-id") || "acme");
  if (!allowedTenants.has(requested)) return res.status(400).json({ error: "Unknown tenant" });
  res.locals.tenantId = requested as TenantId;
  next();
}
app.use("/api", (req, res, next) => {
  if (req.path === "/health") return next();
  return tenantFromRequest(req, res, next);
});

app.get("/api/health", (_req, res) => res.json({ ok: true, service: "saas-metrics-api", mode: "demo" }));

app.get("/api/dashboard", (req, res) => {
  const tenantId = res.locals.tenantId as TenantId;
  const range = ["7d", "30d", "90d", "12m"].includes(String(req.query.range)) ? String(req.query.range) : "30d";
  res.json({ ...dashboardData[tenantId], range, updatedAt: new Date().toISOString() });
});

app.get("/api/team", (_req, res) => {
  const tenantId = res.locals.tenantId as TenantId;
  res.json({ members: teamByTenant[tenantId] });
});

app.patch("/api/team/:id/role", (req, res) => {
  const tenantId = res.locals.tenantId as TenantId;
  const role = String(req.body?.role || "");
  if (!["Owner", "Admin", "Analyst", "Member"].includes(role)) {
    return res.status(400).json({ error: "Role must be Owner, Admin, Analyst, or Member" });
  }
  const member = teamByTenant[tenantId].find((item) => item.id === req.params.id);
  if (!member) return res.status(404).json({ error: "Team member not found" });
  member.role = role;
  return res.json({ member });
});

app.get("/api/invoices", (_req, res) => {
  const tenantId = res.locals.tenantId as TenantId;
  res.json({ invoices: invoicesByTenant[tenantId] });
});

const digestSettings: Record<string, { enabled: boolean; email: string; time: string }> = {};
app.get("/api/settings/digest", (_req, res) => {
  const tenantId = res.locals.tenantId as TenantId;
  res.json(digestSettings[tenantId] || { enabled: true, email: "team@example.com", time: "08:00" });
});
app.put("/api/settings/digest", (req, res) => {
  const tenantId = res.locals.tenantId as TenantId;
  const email = String(req.body?.email || "").trim();
  const enabled = Boolean(req.body?.enabled);
  const time = String(req.body?.time || "08:00");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: "Enter a valid email address" });
  if (!/^\d{2}:\d{2}$/.test(time)) return res.status(400).json({ error: "Time must use HH:MM format" });
  digestSettings[tenantId] = { enabled, email, time };
  res.json({ settings: digestSettings[tenantId], note: "Saved in memory for this demo. Configure a scheduler and email provider for delivery." });
});

app.get("/api/integrations/stripe", (_req, res) => {
  res.json({ connected: Boolean(process.env.STRIPE_SECRET_KEY), mode: process.env.STRIPE_SECRET_KEY ? "configured" : "demo", message: process.env.STRIPE_SECRET_KEY ? "Stripe key configured; connect tenant customer mapping to load live metrics." : "Demo mode — add STRIPE_SECRET_KEY on the server to configure Stripe." });
});

// Stripe is initialized server-side only. This endpoint intentionally does not expose secrets.
app.get("/api/integrations/stripe/account", async (_req, res) => {
  if (!process.env.STRIPE_SECRET_KEY) return res.status(503).json({ error: "Stripe is not configured" });
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const account = await stripe.accounts.retrieve();
    res.json({ id: account.id, country: account.country, businessType: account.business_type });
  } catch {
    res.status(502).json({ error: "Unable to verify Stripe account configuration" });
  }
});

app.listen(port, () => console.log(`SaaS Metrics API running at http://localhost:${port}`));
