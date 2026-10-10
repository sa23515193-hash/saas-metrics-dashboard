import type { Dashboard, Invoice, Member, TenantId } from "../types";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const factors: Record<TenantId, number> = { acme: 1, orbit: 0.72, northstar: 2.1 };
const tenantInfo: Record<TenantId, { name: string; plan: string }> = {
  acme: { name: "Acme Studio", plan: "Scale" },
  orbit: { name: "Orbit Labs", plan: "Growth" },
  northstar: { name: "Northstar AI", plan: "Enterprise" }
};

export const demoDashboard = (tenant: TenantId): Dashboard => {
  const f = factors[tenant];
  return {
    tenant: tenantInfo[tenant],
    metrics: { mrr: Math.round(48290*f), mrrChange: tenant==="northstar"?21.3:tenant==="orbit"?9.6:12.8, revenue: Math.round(128430*f), revenueChange: tenant==="northstar"?25.7:tenant==="orbit"?14.1:18.4, customers: Math.round(2486*f), customersChange: 8.2, churn: tenant==="northstar"?1.2:tenant==="orbit"?3.1:2.4, churnChange: -0.6 },
    series: [
      {label:"May 01",revenue:Math.round(18200*f),customers:Math.round(410*f)},
      {label:"May 05",revenue:Math.round(21900*f),customers:Math.round(438*f)},
      {label:"May 09",revenue:Math.round(20400*f),customers:Math.round(462*f)},
      {label:"May 13",revenue:Math.round(27100*f),customers:Math.round(487*f)},
      {label:"May 17",revenue:Math.round(25300*f),customers:Math.round(511*f)},
      {label:"May 21",revenue:Math.round(31900*f),customers:Math.round(543*f)},
      {label:"May 25",revenue:Math.round(34700*f),customers:Math.round(572*f)},
      {label:"May 30",revenue:Math.round(38240*f),customers:Math.round(608*f)}
    ],
    activity: [
      {id:1,title:"Annual plan purchased",detail:"Olivia Martin · Pro plan",time:"2 min ago",amount:"+$1,200",kind:"success"},
      {id:2,title:"New workspace member",detail:"Noah Williams joined Design",time:"18 min ago",amount:"",kind:"neutral"},
      {id:3,title:"Invoice paid",detail:"INV-2026-1042 · Horizon Co.",time:"41 min ago",amount:"+$840",kind:"success"},
      {id:4,title:"Subscription renewed",detail:"Parker Group · Business",time:"1 hr ago",amount:"+$299",kind:"success"}
    ]
  };
};

const demoTeam: Record<TenantId, Member[]> = {
  acme: [
    {id:"u1",name:"Olivia Martin",email:"olivia@acmestudio.com",initials:"OM",color:"peach",role:"Owner",status:"Active",joined:"Jan 12, 2025"},
    {id:"u2",name:"Noah Williams",email:"noah@acmestudio.com",initials:"NW",color:"purple",role:"Admin",status:"Active",joined:"Mar 04, 2025"},
    {id:"u3",name:"Ava Thompson",email:"ava@acmestudio.com",initials:"AT",color:"green",role:"Analyst",status:"Active",joined:"Apr 22, 2025"},
    {id:"u4",name:"Liam Chen",email:"liam@acmestudio.com",initials:"LC",color:"blue",role:"Member",status:"Invited",joined:"Jun 09, 2025"}
  ],
  orbit: [
    {id:"u1",name:"Ethan Brooks",email:"ethan@orbitlabs.com",initials:"EB",color:"peach",role:"Owner",status:"Active",joined:"Feb 11, 2025"},
    {id:"u2",name:"Mia Patel",email:"mia@orbitlabs.com",initials:"MP",color:"purple",role:"Admin",status:"Active",joined:"Apr 18, 2025"},
    {id:"u3",name:"Lucas Kim",email:"lucas@orbitlabs.com",initials:"LK",color:"green",role:"Member",status:"Active",joined:"May 26, 2025"}
  ],
  northstar: [
    {id:"u1",name:"Sophia Reed",email:"sophia@northstar.ai",initials:"SR",color:"peach",role:"Owner",status:"Active",joined:"Dec 02, 2024"},
    {id:"u2",name:"Mason Wright",email:"mason@northstar.ai",initials:"MW",color:"purple",role:"Admin",status:"Active",joined:"Jan 16, 2025"},
    {id:"u3",name:"Isabella Flores",email:"isabella@northstar.ai",initials:"IF",color:"green",role:"Analyst",status:"Active",joined:"Feb 08, 2025"}
  ]
};
const demoInvoices: Record<TenantId, Invoice[]> = {
  acme: [
    {id:"INV-2026-1042",customer:"Horizon Co.",email:"finance@horizon.co",date:"Oct 08, 2026",amount:840,status:"Paid"},
    {id:"INV-2026-1041",customer:"Parker Group",email:"accounts@parker.io",date:"Oct 07, 2026",amount:1299,status:"Paid"},
    {id:"INV-2026-1040",customer:"Northwind Studio",email:"billing@northwind.com",date:"Oct 06, 2026",amount:420,status:"Pending"},
    {id:"INV-2026-1039",customer:"Pixel & Co.",email:"hello@pixelco.design",date:"Oct 04, 2026",amount:299,status:"Overdue"},
    {id:"INV-2026-1038",customer:"Atlas Creative",email:"pay@atlascreative.co",date:"Oct 02, 2026",amount:640,status:"Paid"}
  ],
  orbit: [
    {id:"INV-2026-0811",customer:"Blue Peak",email:"billing@bluepeak.com",date:"Oct 08, 2026",amount:620,status:"Paid"},
    {id:"INV-2026-0810",customer:"Vertex Digital",email:"accounts@vertex.dev",date:"Oct 06, 2026",amount:390,status:"Pending"},
    {id:"INV-2026-0809",customer:"NexaWorks",email:"finance@nexaworks.com",date:"Oct 03, 2026",amount:850,status:"Paid"}
  ],
  northstar: [
    {id:"INV-2026-2208",customer:"Kinetic",email:"billing@kinetic.ai",date:"Oct 08, 2026",amount:2400,status:"Paid"},
    {id:"INV-2026-2207",customer:"Atlas Systems",email:"ap@atlas.systems",date:"Oct 07, 2026",amount:12000,status:"Paid"},
    {id:"INV-2026-2206",customer:"Meridian Analytics",email:"pay@meridian.io",date:"Oct 03, 2026",amount:1800,status:"Pending"}
  ]
};

async function request<T>(path: string, tenant: TenantId, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", "x-tenant-id": tenant, ...(init?.headers || {}) }
  });
  if (!response.ok) throw new Error(`API request failed (${response.status})`);
  return response.json() as Promise<T>;
}
export async function getDashboard(tenant: TenantId, range: string): Promise<{data: Dashboard; source: "api"|"demo"}> {
  try { return { data: await request<Dashboard>(`/dashboard?range=${range}`, tenant), source: "api" }; }
  catch { return { data: demoDashboard(tenant), source: "demo" }; }
}
export async function getTeam(tenant: TenantId): Promise<{members: Member[]; source: "api"|"demo"}> {
  try { const result = await request<{members:Member[]}>("/team", tenant); return {...result,source:"api"}; }
  catch { return {members: demoTeam[tenant], source:"demo"}; }
}
export async function updateRole(tenant: TenantId, id: string, role: string): Promise<boolean> {
  try { await request(`/team/${id}/role`, tenant, {method:"PATCH",body:JSON.stringify({role})}); return true; } catch { return false; }
}
export async function getInvoices(tenant: TenantId): Promise<{invoices: Invoice[]; source: "api"|"demo"}> {
  try { const result = await request<{invoices:Invoice[]}>("/invoices", tenant); return {...result,source:"api"}; }
  catch { return {invoices: demoInvoices[tenant], source:"demo"}; }
}
export async function getStripeStatus(tenant: TenantId): Promise<{connected:boolean;mode:string;message:string}> {
  try { return await request("/integrations/stripe", tenant); }
  catch { return {connected:false,mode:"demo",message:"Backend unavailable — showing demo data."}; }
}
export async function saveDigest(tenant: TenantId, settings: {enabled:boolean;email:string;time:string}) {
  return request("/settings/digest", tenant, {method:"PUT",body:JSON.stringify(settings)});
}
