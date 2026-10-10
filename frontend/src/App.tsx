import { useEffect, useMemo, useState } from "react";
import {
  Activity, ArrowDownRight, ArrowUpRight, Bell, ChevronDown, ChevronLeft, ChevronRight,
  CircleHelp, CreditCard, Download, FileText, Gauge, LayoutDashboard, LifeBuoy,
  LogOut, Menu, MoreHorizontal, Plus, Search, Settings, ShieldCheck, Sparkles,
  Users, X, Zap, Check, Clock3, Mail, RefreshCw, Building2, TrendingUp
} from "lucide-react";
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
  BarChart, Bar
} from "recharts";
import { demoDashboard, getDashboard, getInvoices, getStripeStatus, getTeam, saveDigest, updateRole } from "./lib/api";
import type { Dashboard, Invoice, Member, TenantId } from "./types";

type Page = "Overview" | "Team" | "Invoices" | "Settings";
const tenants: {id:TenantId;name:string;initials:string}[] = [
  {id:"acme",name:"Acme Studio",initials:"AS"},
  {id:"orbit",name:"Orbit Labs",initials:"OL"},
  {id:"northstar",name:"Northstar AI",initials:"NA"}
];
const money = (value:number) => new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format(value);
const compactMoney = (value:number) => value >= 1000 ? `$${(value/1000).toFixed(value>=100000?0:1)}k` : `$${value}`;
const initialsColor = (color:string) => `avatar ${color}`;

export default function App() {
  const [tenant,setTenant] = useState<TenantId>("acme");
  const [page,setPage] = useState<Page>("Overview");
  const [range,setRange] = useState("30d");
  const [dashboard,setDashboard] = useState<Dashboard>(demoDashboard("acme"));
  const [team,setTeam] = useState<Member[]>([]);
  const [invoices,setInvoices] = useState<Invoice[]>([]);
  const [source,setSource] = useState<"api"|"demo">("demo");
  const [stripe,setStripe] = useState({connected:false,mode:"demo",message:"Loading integration status…"});
  const [menuOpen,setMenuOpen] = useState(false);
  const [mobileNav,setMobileNav] = useState(false);
  const [search,setSearch] = useState("");
  const [notice,setNotice] = useState("");
  const [digestEnabled,setDigestEnabled] = useState(true);
  const [digestEmail,setDigestEmail] = useState("team@example.com");
  const [digestTime,setDigestTime] = useState("08:00");
  const [saving,setSaving] = useState(false);

  async function refresh() {
    const [d,t,i,s] = await Promise.all([getDashboard(tenant,range),getTeam(tenant),getInvoices(tenant),getStripeStatus(tenant)]);
    setDashboard(d.data); setSource(d.source);
    setTeam(t.members); setInvoices(i.invoices); setStripe(s);
  }
  useEffect(() => { void refresh(); }, [tenant,range]);
  const activeTenant = tenants.find(t=>t.id===tenant)!;
  const filteredInvoices = useMemo(()=>invoices.filter(i => `${i.id} ${i.customer} ${i.status}`.toLowerCase().includes(search.toLowerCase())),[invoices,search]);
  const navItems = [
    {label:"Overview" as Page,icon:LayoutDashboard},
    {label:"Team" as Page,icon:Users},
    {label:"Invoices" as Page,icon:FileText},
    {label:"Settings" as Page,icon:Settings}
  ];
  function exportCSV() {
    const rows = [["Invoice","Customer","Email","Date","Amount USD","Status"],...invoices.map(i=>[i.id,i.customer,i.email,i.date,String(i.amount),i.status])];
    const csv = rows.map(row=>row.map(cell=>`"${String(cell).replace(/"/g,'""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8;"}));
    const a = document.createElement("a"); a.href=url; a.download=`${tenant}-invoices.csv`; a.click(); URL.revokeObjectURL(url);
    setNotice("Invoice CSV exported."); setTimeout(()=>setNotice(""),2500);
  }
  async function changeRole(id:string,role:string) {
    const ok = await updateRole(tenant,id,role);
    setTeam(prev=>prev.map(m=>m.id===id?{...m,role}:m));
    setNotice(ok?"Role updated on API.":"Role updated in preview only — start the backend to persist during this session.");
    setTimeout(()=>setNotice(""),3500);
  }
  async function saveSettings() {
    setSaving(true);
    try {
      await saveDigest(tenant,{enabled:digestEnabled,email:digestEmail,time:digestTime});
      setNotice("Digest preferences saved.");
    } catch { setNotice("Preferences updated for this preview. Start the backend to save through the API."); }
    setSaving(false); setTimeout(()=>setNotice(""),3500);
  }

  return <div className="app-shell">
    <aside className={`sidebar ${mobileNav?"sidebar-open":""}`}>
      <div className="brand"><div className="brand-mark"><Activity size={21} strokeWidth={2.7}/></div><span>pulse<span className="brand-accent">board</span></span><button className="mobile-close icon-btn" onClick={()=>setMobileNav(false)} aria-label="Close navigation"><X size={18}/></button></div>
      <div className="workspace-label">WORKSPACE</div>
      <button className="workspace-select" onClick={()=>setMenuOpen(!menuOpen)}>
        <span className="workspace-logo">{activeTenant.initials}</span><span className="workspace-copy"><strong>{activeTenant.name}</strong><small>{dashboard.tenant.plan} plan</small></span><ChevronDown size={15} className="muted"/>
      </button>
      {menuOpen && <div className="tenant-menu">{tenants.map(t=><button key={t.id} onClick={()=>{setTenant(t.id);setMenuOpen(false);setPage("Overview");}}><span className="workspace-logo small-logo">{t.initials}</span><span>{t.name}</span>{tenant===t.id&&<Check size={15} className="orange-text"/>}</button>)}</div>}
      <div className="nav-label">ANALYTICS</div>
      <nav className="main-nav">{navItems.map(item=><button key={item.label} className={`nav-item ${page===item.label?"active":""}`} onClick={()=>{setPage(item.label);setMobileNav(false);}}><item.icon size={18}/><span>{item.label}</span>{item.label==="Invoices"&&<span className="nav-count">{invoices.length}</span>}</button>)}</nav>
      <div className="sidebar-bottom">
        <div className="upgrade-card"><div className="upgrade-icon"><Sparkles size={16}/></div><strong>Unlock more insights</strong><p>Get deeper analytics and automate your workflow.</p><button onClick={()=>setNotice("You're already exploring the Scale plan preview.")}>Explore plans <ArrowUpRight size={14}/></button></div>
        <button className="nav-item help-item" onClick={()=>setNotice("Help center: support@pulseboard.demo")}><LifeBuoy size={18}/><span>Help center</span></button>
        <div className="profile"><div className="profile-avatar">SI</div><div className="profile-copy"><strong>Sawaira Ijaz</strong><small>Workspace owner</small></div><button className="icon-btn" aria-label="Profile options" onClick={()=>setNotice("Signed in as demo workspace owner.")}><MoreHorizontal size={18}/></button></div>
      </div>
    </aside>
    {mobileNav&&<button className="mobile-scrim" onClick={()=>setMobileNav(false)} aria-label="Close menu"/>}
    <main className="main-area">
      <header className="topbar">
        <div className="topbar-left"><button className="mobile-menu icon-btn" onClick={()=>setMobileNav(true)} aria-label="Open navigation"><Menu size={20}/></button><div className="breadcrumb">Workspace <ChevronRight size={14}/><strong>{page}</strong></div></div>
        <div className="topbar-actions"><div className="live-indicator"><span className="live-dot"/>{source==="api"?"API connected":"Preview mode"}</div><button className="icon-btn notification-btn" aria-label="Notifications" onClick={()=>setNotice("You're all caught up.")}><Bell size={18}/><i/></button><div className="top-divider"/><button className="top-profile" onClick={()=>setPage("Settings")}><span className="profile-avatar small-profile">SI</span><ChevronDown size={14}/></button></div>
      </header>
      <div className="content">
        {notice&&<div className="toast"><Check size={16}/>{notice}<button onClick={()=>setNotice("")} aria-label="Dismiss"><X size={14}/></button></div>}
        {page==="Overview"&&<Overview dashboard={dashboard} range={range} setRange={setRange} stripe={stripe} onGoInvoices={()=>setPage("Invoices")} onRefresh={()=>void refresh()} />}
        {page==="Team"&&<TeamPage team={team} onChangeRole={changeRole} />}
        {page==="Invoices"&&<InvoicesPage invoices={filteredInvoices} search={search} setSearch={setSearch} onExport={exportCSV} />}
        {page==="Settings"&&<SettingsPage tenant={activeTenant.name} stripe={stripe} digestEnabled={digestEnabled} setDigestEnabled={setDigestEnabled} digestEmail={digestEmail} setDigestEmail={setDigestEmail} digestTime={digestTime} setDigestTime={setDigestTime} onSave={saveSettings} saving={saving} />}
        <footer className="footer"><span>© 2026 Pulseboard, Inc.</span><span><span className="footer-status"/>{source==="api"?"All systems operational":"Demo data active"} <span className="footer-dot">·</span> Built for growing teams</span></footer>
      </div>
    </main>
  </div>;
}

function PageHeading({eyebrow,title,subtitle,actions}:{eyebrow:string;title:string;subtitle:string;actions?:React.ReactNode}) {
  return <div className="page-heading"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{subtitle}</p></div>{actions&&<div className="heading-actions">{actions}</div>}</div>;
}
function Overview({dashboard,range,setRange,stripe,onGoInvoices,onRefresh}:{dashboard:Dashboard;range:string;setRange:(s:string)=>void;stripe:{connected:boolean;mode:string;message:string};onGoInvoices:()=>void;onRefresh:()=>void}) {
  const m=dashboard.metrics;
  const cards=[
    {label:"Monthly recurring revenue",value:money(m.mrr),change:m.mrrChange,icon:CreditCard,caption:"vs. previous period",spark:[22,35,29,46,38,59,51,72]},
    {label:"Total revenue",value:money(m.revenue),change:m.revenueChange,icon:TrendingUp,caption:"vs. previous period",spark:[26,20,42,34,53,49,65,78]},
    {label:"Active customers",value:m.customers.toLocaleString(),change:m.customersChange,icon:Users,caption:"vs. previous period",spark:[18,25,31,29,44,51,56,70]},
    {label:"Monthly churn rate",value:`${m.churn.toFixed(1)}%`,change:m.churnChange,icon:Activity,caption:"vs. previous period",spark:[66,59,63,47,52,35,41,28],inverse:true}
  ];
  return <>
    <PageHeading eyebrow="MONDAY, OCTOBER 10, 2026" title="Good morning, Sawaira ✨" subtitle="Here's what's happening with your business today." actions={<><button className="btn btn-secondary" onClick={onRefresh}><RefreshCw size={15}/> Refresh</button><button className="btn btn-primary" onClick={onGoInvoices}><Plus size={16}/> View invoices</button></>}/>
    <div className="overview-toolbar"><div className="section-title"><span className="title-dot"/>Performance overview <span className="soft-label">Updated just now</span></div><div className="range-select">{["7d","30d","90d","12m"].map((r)=><button key={r} onClick={()=>setRange(r)} className={range===r?"selected":""}>{r==="7d"?"7 days":r==="30d"?"30 days":r==="90d"?"90 days":"12 months"}</button>)}</div></div>
    <div className="metric-grid">{cards.map((c,i)=><div className="metric-card" key={c.label}><div className="metric-top"><span>{c.label}</span><span className={`metric-icon metric-icon-${i}`}><c.icon size={17}/></span></div><div className="metric-value">{c.value}</div><div className="metric-bottom"><span className={`change ${c.inverse?"positive":c.change>=0?"positive":"negative"}`}>{c.change>=0?<ArrowUpRight size={14}/>:<ArrowDownRight size={14}/>} {Math.abs(c.change)}%</span><span className="metric-caption">{c.caption}</span><MiniSpark values={c.spark} inverse={!!c.inverse}/></div></div>)}</div>
    <div className="charts-grid">
      <section className="panel revenue-panel"><div className="panel-heading"><div><h2>Revenue performance</h2><p>Track your income over time</p></div><button className="icon-btn panel-menu" aria-label="Revenue chart options"><MoreHorizontal size={19}/></button></div><div className="chart-legend"><span><i className="legend-dot orange-dot"/>Revenue</span><span><i className="legend-dot muted-dot"/>Previous period</span><span className="chart-total">{compactMoney(m.revenue)} <small>total</small></span></div><div className="revenue-chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={dashboard.series} margin={{top:8,right:8,left:0,bottom:0}}><defs><linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ff7629" stopOpacity={0.25}/><stop offset="95%" stopColor="#ff7629" stopOpacity={0}/></linearGradient></defs><CartesianGrid stroke="#292a29" strokeDasharray="3 5" vertical={false}/><XAxis dataKey="label" axisLine={false} tickLine={false} tick={{fill:"#797b78",fontSize:11}} dy={10} tickFormatter={(v)=>v.replace("May ","")}/><YAxis axisLine={false} tickLine={false} tick={{fill:"#797b78",fontSize:11}} tickFormatter={compactMoney} width={43}/><Tooltip contentStyle={{background:"#1b1c1a",border:"1px solid #373835",borderRadius:10,color:"#fff"}} formatter={(v:any)=>[money(Number(v)),"Revenue"]}/><Area type="monotone" dataKey="revenue" stroke="#ff7629" strokeWidth={2.5} fill="url(#revGradient)" activeDot={{r:5,stroke:"#ff7629",strokeWidth:2,fill:"#171816"}}/></AreaChart></ResponsiveContainer></div><div className="chart-foot"><span><span className="chart-foot-dot"/> Revenue is up <b>{m.revenueChange}%</b> from last period</span><button onClick={onGoInvoices}>View transactions <ArrowUpRight size={13}/></button></div></section>
      <section className="panel customer-panel"><div className="panel-heading"><div><h2>Customer growth</h2><p>Active customer acquisition</p></div><button className="icon-btn panel-menu" aria-label="Customer chart options"><MoreHorizontal size={19}/></button></div><div className="customer-total"><strong>{m.customers.toLocaleString()}</strong><span className="change positive"><ArrowUpRight size={14}/>{m.customersChange}%</span></div><div className="customer-chart"><ResponsiveContainer width="100%" height="100%"><BarChart data={dashboard.series} margin={{top:10,right:0,left:-20,bottom:0}}><CartesianGrid stroke="#292a29" strokeDasharray="3 5" vertical={false}/><XAxis dataKey="label" axisLine={false} tickLine={false} tick={{fill:"#797b78",fontSize:10}} tickFormatter={(v)=>v.replace("May ","")}/><YAxis axisLine={false} tickLine={false} tick={{fill:"#797b78",fontSize:10}}/><Tooltip contentStyle={{background:"#1b1c1a",border:"1px solid #373835",borderRadius:10,color:"#fff"}}/><Bar dataKey="customers" fill="#ff7629" radius={[4,4,0,0]} maxBarSize={24}/></BarChart></ResponsiveContainer></div><div className="customer-footer"><span><i className="legend-dot orange-dot"/> Active customers</span><span className="muted">Last 30 days</span></div></section>
    </div>
    <div className="lower-grid"><section className="panel activity-panel"><div className="panel-heading"><div><h2>Recent activity</h2><p>The latest updates from your workspace</p></div><button className="text-link" onClick={onGoInvoices}>View all <ArrowUpRight size={14}/></button></div><div className="activity-list">{dashboard.activity.map(a=><div className="activity-row" key={a.id}><div className={`activity-icon ${a.kind}`}><span>{a.kind==="success"?<Check size={15}/>:<Users size={15}/>}</span></div><div className="activity-copy"><strong>{a.title}</strong><small>{a.detail}</small></div><div className="activity-meta">{a.amount&&<strong>{a.amount}</strong>}<small>{a.time}</small></div></div>)}</div></section><section className="panel integration-panel"><div className="panel-heading"><div><h2>Connected apps</h2><p>Your tools, all in one place</p></div><button className="icon-btn panel-menu" aria-label="Integration options"><MoreHorizontal size={19}/></button></div><div className="integration-item"><div className="integration-brand stripe-brand">S</div><div className="integration-copy"><strong>Stripe</strong><small>{stripe.connected?"Connected · Live mode":"Payments & revenue sync"}</small></div><span className={`integration-status ${stripe.connected?"connected":""}`}><i/>{stripe.connected?"Connected":"Demo"}</span></div><div className="integration-item"><div className="integration-brand mail-brand"><Mail size={17}/></div><div className="integration-copy"><strong>Email digest</strong><small>Daily metric summaries</small></div><span className="integration-status connected"><i/>Enabled</span></div><div className="integration-cta"><div><ShieldCheck size={17}/><span>{stripe.message}</span></div><button onClick={()=>window.dispatchEvent(new CustomEvent("open-settings"))}>Manage integrations <ArrowUpRight size={14}/></button></div></section></div>
  </>;
}
function MiniSpark({values,inverse}:{values:number[];inverse:boolean}) {
  const points=values.map((v,i)=>`${i*12},${30-v*.31}`).join(" ");
  return <svg className={`mini-spark ${inverse?"spark-inverse":""}`} viewBox="0 0 84 32" aria-hidden="true"><polyline points={points} fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
function TeamPage({team,onChangeRole}:{team:Member[];onChangeRole:(id:string,role:string)=>void}) {
  const [query,setQuery]=useState("");
  const members=team.filter(m=>`${m.name} ${m.email} ${m.role}`.toLowerCase().includes(query.toLowerCase()));
  return <><PageHeading eyebrow="WORKSPACE MANAGEMENT" title="Your team" subtitle="Manage your teammates, access and workspace permissions." actions={<button className="btn btn-primary" onClick={()=>alert("Invite flow is a prototype. Connect an email provider to send invitations.")}><Plus size={16}/> Invite member</button>}/><div className="team-summary"><div className="summary-tile"><span>Team members</span><strong>{team.length.toString().padStart(2,"0")}</strong></div><div className="summary-tile"><span>Active members</span><strong>{team.filter(m=>m.status==="Active").length.toString().padStart(2,"0")}</strong></div><div className="summary-tile"><span>Pending invites</span><strong>{team.filter(m=>m.status==="Invited").length.toString().padStart(2,"0")}</strong></div></div><section className="panel table-panel"><div className="table-heading"><div><h2>Members & permissions</h2><p>Roles control what each person can access.</p></div><div className="search-box"><Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search members..."/></div></div><div className="table-scroll"><table><thead><tr><th>MEMBER</th><th>ROLE</th><th>STATUS</th><th>JOINED</th><th/></tr></thead><tbody>{members.map(m=><tr key={m.id}><td><div className="member-cell"><span className={initialsColor(m.color)}>{m.initials}</span><span><strong>{m.name}</strong><small>{m.email}</small></span></div></td><td><select className="role-select" value={m.role} onChange={e=>onChangeRole(m.id,e.target.value)} aria-label={`Role for ${m.name}`}><option>Owner</option><option>Admin</option><option>Analyst</option><option>Member</option></select></td><td><span className={`status-pill ${m.status.toLowerCase()}`}><i/>{m.status}</span></td><td className="joined-cell">{m.joined}</td><td><button className="icon-btn" aria-label={`More options for ${m.name}`} onClick={()=>alert(`${m.name} · ${m.role}`)}><MoreHorizontal size={18}/></button></td></tr>)}</tbody></table>{members.length===0&&<div className="empty-state">No team members match that search.</div>}</div><div className="table-footer"><span>Showing <b>{members.length}</b> of {team.length} members</span><span className="permission-note"><ShieldCheck size={14}/> Role-based access enabled</span></div></section></>;
}
function InvoicesPage({invoices,search,setSearch,onExport}:{invoices:Invoice[];search:string;setSearch:(s:string)=>void;onExport:()=>void}) {
  const total=invoices.reduce((sum,i)=>sum+i.amount,0);
  return <><PageHeading eyebrow="BILLING & PAYMENTS" title="Invoices" subtitle="Keep track of payments and billing across your customers." actions={<><button className="btn btn-secondary" onClick={onExport}><Download size={15}/> Export CSV</button><button className="btn btn-primary" onClick={()=>alert("Invoice creation is a prototype. Connect Stripe Invoicing to issue live invoices.")}><Plus size={16}/> Create invoice</button></>}/><div className="invoice-summary"><div className="invoice-stat"><span>Total listed value</span><strong>{money(total)}</strong><small>Across filtered invoices</small></div><div className="invoice-stat"><span>Paid invoices</span><strong>{invoices.filter(i=>i.status==="Paid").length}</strong><small className="green-copy">Successfully collected</small></div><div className="invoice-stat"><span>Awaiting payment</span><strong>{invoices.filter(i=>i.status!=="Paid").length}</strong><small className="orange-copy">Needs attention</small></div></div><section className="panel table-panel"><div className="table-heading"><div><h2>All invoices</h2><p>Latest billing activity for this workspace.</p></div><div className="search-box"><Search size={16}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search invoices..."/></div></div><div className="table-scroll"><table><thead><tr><th>INVOICE</th><th>CUSTOMER</th><th>DATE</th><th>AMOUNT</th><th>STATUS</th><th/></tr></thead><tbody>{invoices.map(i=><tr key={i.id}><td><span className="invoice-id"><FileText size={15}/>{i.id}</span></td><td><span className="customer-cell"><strong>{i.customer}</strong><small>{i.email}</small></span></td><td className="joined-cell">{i.date}</td><td className="amount-cell">{money(i.amount)}</td><td><span className={`invoice-status ${i.status.toLowerCase()}`}>{i.status}</span></td><td><button className="icon-btn" aria-label={`Download ${i.id}`} onClick={()=>alert(`Invoice ${i.id} is demo data. CSV export is available.`)}><Download size={15}/></button></td></tr>)}</tbody></table>{invoices.length===0&&<div className="empty-state">No invoices found.</div>}</div><div className="table-footer"><span>{invoices.length} invoices</span><span>Currency: USD</span></div></section></>;
}
function SettingsPage({tenant,stripe,digestEnabled,setDigestEnabled,digestEmail,setDigestEmail,digestTime,setDigestTime,onSave,saving}:{tenant:string;stripe:{connected:boolean;mode:string;message:string};digestEnabled:boolean;setDigestEnabled:(b:boolean)=>void;digestEmail:string;setDigestEmail:(s:string)=>void;digestTime:string;setDigestTime:(s:string)=>void;onSave:()=>void;saving:boolean}) {
  return <><PageHeading eyebrow="PREFERENCES" title="Workspace settings" subtitle="Configure integrations and how your team receives updates."/><div className="settings-layout"><section className="panel settings-panel"><div className="settings-title"><div className="settings-icon"><Mail size={18}/></div><div><h2>Daily metric digest</h2><p>Get a concise summary of revenue and customer growth every day.</p></div></div><div className="setting-row"><div><strong>Enable daily email</strong><small>Send a dashboard snapshot to your inbox.</small></div><button className={`toggle ${digestEnabled?"on":""}`} onClick={()=>setDigestEnabled(!digestEnabled)} role="switch" aria-checked={digestEnabled}><span/></button></div><label className="field-label">Recipient email<input type="email" value={digestEmail} onChange={e=>setDigestEmail(e.target.value)} placeholder="you@company.com"/></label><label className="field-label">Delivery time<select value={digestTime} onChange={e=>setDigestTime(e.target.value)}><option value="08:00">8:00 AM</option><option value="09:00">9:00 AM</option><option value="12:00">12:00 PM</option><option value="17:00">5:00 PM</option></select></label><div className="settings-note"><Clock3 size={15}/> Scheduled time is interpreted in the workspace's configured timezone. Actual delivery requires a scheduler and email provider.</div><button className="btn btn-primary save-btn" onClick={onSave} disabled={saving}>{saving?"Saving…":<><Check size={15}/> Save preferences</>}</button></section><section className="panel settings-panel"><div className="settings-title"><div className="settings-icon stripe-brand"><CreditCard size={18}/></div><div><h2>Payment integration</h2><p>Connect Stripe to sync subscription revenue.</p></div></div><div className="stripe-connection"><div className="stripe-logo-large">S</div><div><strong>Stripe</strong><small>{stripe.connected?"Secret key detected":"Not connected to live data"}</small></div><span className={`integration-status ${stripe.connected?"connected":""}`}><i/>{stripe.connected?"Configured":"Demo mode"}</span></div><div className="settings-note"><ShieldCheck size={15}/>{stripe.message}</div><div className="settings-note"><ShieldCheck size={15}/> Add Stripe keys only to <code>backend/.env</code>. Never place secret keys in frontend code.</div><button className="btn btn-secondary full-btn" onClick={()=>alert("To configure: copy backend/.env.example to backend/.env and add your Stripe secret key.")}>View setup instructions <ArrowUpRight size={14}/></button></section><section className="panel settings-panel tenant-settings"><div className="settings-title"><div className="settings-icon"><Building2 size={18}/></div><div><h2>Workspace information</h2><p>Current tenant configuration</p></div></div><div className="tenant-info-row"><span>Workspace</span><strong>{tenant}</strong></div><div className="tenant-info-row"><span>Data isolation</span><span className="status-pill active"><i/>Tenant-scoped</span></div><div className="tenant-info-row"><span>Environment</span><strong>Local preview</strong></div><div className="settings-note"><ShieldCheck size={15}/> This prototype uses demo tenant selection. Production access should be tied to authenticated membership.</div></section></div></>;
}
