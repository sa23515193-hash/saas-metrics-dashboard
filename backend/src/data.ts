export type TenantId = "acme" | "orbit" | "northstar";

export const tenants: Record<TenantId, { name: string; plan: string }> = {
  acme: { name: "Acme Studio", plan: "Scale" },
  orbit: { name: "Orbit Labs", plan: "Growth" },
  northstar: { name: "Northstar AI", plan: "Enterprise" }
};

const makeSeries = (factor: number) => [
  { label: "May 01", revenue: Math.round(18200 * factor), customers: Math.round(410 * factor) },
  { label: "May 05", revenue: Math.round(21900 * factor), customers: Math.round(438 * factor) },
  { label: "May 09", revenue: Math.round(20400 * factor), customers: Math.round(462 * factor) },
  { label: "May 13", revenue: Math.round(27100 * factor), customers: Math.round(487 * factor) },
  { label: "May 17", revenue: Math.round(25300 * factor), customers: Math.round(511 * factor) },
  { label: "May 21", revenue: Math.round(31900 * factor), customers: Math.round(543 * factor) },
  { label: "May 25", revenue: Math.round(34700 * factor), customers: Math.round(572 * factor) },
  { label: "May 30", revenue: Math.round(38240 * factor), customers: Math.round(608 * factor) }
];

export const dashboardData: Record<TenantId, any> = {
  acme: {
    tenant: tenants.acme,
    metrics: {
      mrr: 48290, mrrChange: 12.8, revenue: 128430, revenueChange: 18.4,
      customers: 2486, customersChange: 8.2, churn: 2.4, churnChange: -0.6
    },
    series: makeSeries(1),
    activity: [
      { id: 1, title: "Annual plan purchased", detail: "Olivia Martin · Pro plan", time: "2 min ago", amount: "+$1,200", kind: "success" },
      { id: 2, title: "New workspace member", detail: "Noah Williams joined Design", time: "18 min ago", amount: "", kind: "neutral" },
      { id: 3, title: "Invoice paid", detail: "INV-2026-1042 · Horizon Co.", time: "41 min ago", amount: "+$840", kind: "success" },
      { id: 4, title: "Subscription renewed", detail: "Parker Group · Business", time: "1 hr ago", amount: "+$299", kind: "success" }
    ]
  },
  orbit: {
    tenant: tenants.orbit,
    metrics: { mrr: 31750, mrrChange: 9.6, revenue: 89320, revenueChange: 14.1, customers: 1642, customersChange: 6.7, churn: 3.1, churnChange: -0.2 },
    series: makeSeries(0.72),
    activity: [
      { id: 1, title: "Subscription upgraded", detail: "Ava Thompson · Team plan", time: "5 min ago", amount: "+$480", kind: "success" },
      { id: 2, title: "New customer added", detail: "Vertex Digital", time: "24 min ago", amount: "", kind: "neutral" },
      { id: 3, title: "Invoice paid", detail: "INV-2026-0811 · Blue Peak", time: "56 min ago", amount: "+$620", kind: "success" }
    ]
  },
  northstar: {
    tenant: tenants.northstar,
    metrics: { mrr: 92640, mrrChange: 21.3, revenue: 241880, revenueChange: 25.7, customers: 5730, customersChange: 11.4, churn: 1.2, churnChange: -0.8 },
    series: makeSeries(2.1),
    activity: [
      { id: 1, title: "Enterprise contract signed", detail: "Atlas Systems · Annual", time: "3 min ago", amount: "+$12,000", kind: "success" },
      { id: 2, title: "New customer added", detail: "Meridian Analytics", time: "12 min ago", amount: "", kind: "neutral" },
      { id: 3, title: "Invoice paid", detail: "INV-2026-2208 · Kinetic", time: "33 min ago", amount: "+$2,400", kind: "success" }
    ]
  }
};

export const teamByTenant: Record<TenantId, any[]> = {
  acme: [
    { id: "u1", name: "Olivia Martin", email: "olivia@acmestudio.com", initials: "OM", color: "peach", role: "Owner", status: "Active", joined: "Jan 12, 2025" },
    { id: "u2", name: "Noah Williams", email: "noah@acmestudio.com", initials: "NW", color: "purple", role: "Admin", status: "Active", joined: "Mar 04, 2025" },
    { id: "u3", name: "Ava Thompson", email: "ava@acmestudio.com", initials: "AT", color: "green", role: "Analyst", status: "Active", joined: "Apr 22, 2025" },
    { id: "u4", name: "Liam Chen", email: "liam@acmestudio.com", initials: "LC", color: "blue", role: "Member", status: "Invited", joined: "Jun 09, 2025" }
  ],
  orbit: [
    { id: "u1", name: "Ethan Brooks", email: "ethan@orbitlabs.com", initials: "EB", color: "peach", role: "Owner", status: "Active", joined: "Feb 11, 2025" },
    { id: "u2", name: "Mia Patel", email: "mia@orbitlabs.com", initials: "MP", color: "purple", role: "Admin", status: "Active", joined: "Apr 18, 2025" },
    { id: "u3", name: "Lucas Kim", email: "lucas@orbitlabs.com", initials: "LK", color: "green", role: "Member", status: "Active", joined: "May 26, 2025" }
  ],
  northstar: [
    { id: "u1", name: "Sophia Reed", email: "sophia@northstar.ai", initials: "SR", color: "peach", role: "Owner", status: "Active", joined: "Dec 02, 2024" },
    { id: "u2", name: "Mason Wright", email: "mason@northstar.ai", initials: "MW", color: "purple", role: "Admin", status: "Active", joined: "Jan 16, 2025" },
    { id: "u3", name: "Isabella Flores", email: "isabella@northstar.ai", initials: "IF", color: "green", role: "Analyst", status: "Active", joined: "Feb 08, 2025" }
  ]
};

export const invoicesByTenant: Record<TenantId, any[]> = {
  acme: [
    { id: "INV-2026-1042", customer: "Horizon Co.", email: "finance@horizon.co", date: "Oct 08, 2026", amount: 840, status: "Paid" },
    { id: "INV-2026-1041", customer: "Parker Group", email: "accounts@parker.io", date: "Oct 07, 2026", amount: 1299, status: "Paid" },
    { id: "INV-2026-1040", customer: "Northwind Studio", email: "billing@northwind.com", date: "Oct 06, 2026", amount: 420, status: "Pending" },
    { id: "INV-2026-1039", customer: "Pixel & Co.", email: "hello@pixelco.design", date: "Oct 04, 2026", amount: 299, status: "Overdue" },
    { id: "INV-2026-1038", customer: "Atlas Creative", email: "pay@atlascreative.co", date: "Oct 02, 2026", amount: 640, status: "Paid" }
  ],
  orbit: [
    { id: "INV-2026-0811", customer: "Blue Peak", email: "billing@bluepeak.com", date: "Oct 08, 2026", amount: 620, status: "Paid" },
    { id: "INV-2026-0810", customer: "Vertex Digital", email: "accounts@vertex.dev", date: "Oct 06, 2026", amount: 390, status: "Pending" },
    { id: "INV-2026-0809", customer: "NexaWorks", email: "finance@nexaworks.com", date: "Oct 03, 2026", amount: 850, status: "Paid" }
  ],
  northstar: [
    { id: "INV-2026-2208", customer: "Kinetic", email: "billing@kinetic.ai", date: "Oct 08, 2026", amount: 2400, status: "Paid" },
    { id: "INV-2026-2207", customer: "Atlas Systems", email: "ap@atlas.systems", date: "Oct 07, 2026", amount: 12000, status: "Paid" },
    { id: "INV-2026-2206", customer: "Meridian Analytics", email: "pay@meridian.io", date: "Oct 03, 2026", amount: 1800, status: "Pending" }
  ]
};
