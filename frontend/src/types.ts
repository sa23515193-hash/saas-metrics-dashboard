export type TenantId = "acme" | "orbit" | "northstar";
export type Metric = { mrr: number; mrrChange: number; revenue: number; revenueChange: number; customers: number; customersChange: number; churn: number; churnChange: number };
export type SeriesPoint = { label: string; revenue: number; customers: number };
export type Activity = { id: number; title: string; detail: string; time: string; amount: string; kind: string };
export type Dashboard = { tenant: { name: string; plan: string }; metrics: Metric; series: SeriesPoint[]; activity: Activity[]; range?: string };
export type Member = { id: string; name: string; email: string; initials: string; color: string; role: string; status: string; joined: string };
export type Invoice = { id: string; customer: string; email: string; date: string; amount: number; status: string };
