import { useEffect, useState } from 'react'
import { createBrowserRouter, NavLink, Outlet, useLocation, useNavigate, useParams } from 'react-router'
import {
  Activity, Bell, CalendarCheck, ChevronDown, CircleDollarSign, ClipboardList, CreditCard, Dumbbell,
  FileBarChart, IndianRupee, LayoutDashboard, Menu, MessageSquareMore, Plus, ReceiptIndianRupee,
  Search, Settings, ShieldCheck, Target, TrendingDown, TrendingUp, UserRound, Users, Wallet, X,
} from 'lucide-react'
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import { useStore } from './store'
import { shiftDate, today, type RecordItem } from './data'
import { Badge, Button, Card, DataTable, DetailGrid, EntityForm, type Field, Modal, PageHeader, Toolbar, exportCsv, money } from './ui'

const notify = (message: string, kind = 'success') => window.dispatchEvent(new CustomEvent('gms-toast', { detail: { message, kind } }))
const uid = (prefix: string) => `${prefix}-${Date.now().toString().slice(-6)}`

function Toasts() {
  const [toasts, setToasts] = useState<{ id: number; message: string; kind: string }[]>([])
  useEffect(() => {
    const fn = (e: Event) => {
      const detail = (e as CustomEvent).detail
      const toast = { ...detail, id: Date.now() }
      setToasts(t => [...t, toast])
      setTimeout(() => setToasts(t => t.filter(x => x.id !== toast.id)), 3000)
    }
    addEventListener('gms-toast', fn)
    return () => removeEventListener('gms-toast', fn)
  })
  return <div className="fixed bottom-5 right-5 z-[80] space-y-2">{toasts.map(t => <div key={t.id} className={`min-w-72 rounded-xl border bg-white px-4 py-3 text-sm font-semibold shadow-xl ${t.kind === 'error' ? 'border-red-200 text-red-600' : 'border-emerald-200 text-emerald-700'}`}>{t.message}</div>)}</div>
}

const navigation = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/members', label: 'Members', icon: Users },
  { to: '/plans', label: 'Membership Plans', icon: ShieldCheck },
  { to: '/renewals', label: 'Renewals', icon: Activity },
  { to: '/payments', label: 'Payments', icon: CreditCard },
  { to: '/leads', label: 'Leads & Enquiries', icon: Target },
  { to: '/attendance', label: 'Attendance', icon: CalendarCheck },
  { to: '/trainers', label: 'Trainers', icon: Dumbbell },
  { to: '/accounting', label: 'Accounting', icon: Wallet },
  { to: '/reports', label: 'Reports', icon: FileBarChart },
  { to: '/notifications', label: 'Notifications', icon: Bell },
  { to: '/settings', label: 'Settings', icon: Settings },
]

function Shell() {
  const [open, setOpen] = useState(false)
  const [profile, setProfile] = useState(false)
  const { notifications } = useStore()
  const location = useLocation()
  const navigate = useNavigate()
  const unread = notifications.filter(n => !n.read).length
  return <div className="min-h-screen bg-[#f5f7fb] text-slate-700">
    <aside className={`fixed inset-y-0 left-0 z-40 flex w-[258px] flex-col bg-[#081b35] text-white shadow-xl transition-transform lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex h-[76px] items-center gap-3 border-b border-white/10 px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1473e6]"><Dumbbell size={21} /></div>
        <div><div className="font-bold tracking-tight">FitZone</div><div className="text-[10px] font-semibold uppercase tracking-[.18em] text-blue-300">Gym management</div></div>
        <button onClick={() => setOpen(false)} className="ml-auto lg:hidden"><X size={20} /></button>
      </div>
      <div className="px-4 py-6"><div className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[.18em] text-slate-500">Workspace</div>
        <nav className="space-y-1">{navigation.map(item => <NavLink key={item.to} to={item.to} end={item.to === '/'} onClick={() => setOpen(false)} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${isActive ? 'bg-[#1473e6] text-white shadow-lg shadow-blue-950/20' : 'text-slate-300 hover:bg-white/7 hover:text-white'}`}><item.icon size={18} /><span>{item.label}</span>{item.label === 'Notifications' && unread > 0 && <span className="ml-auto rounded-full bg-red-500 px-2 py-0.5 text-[10px]">{unread}</span>}</NavLink>)}</nav>
      </div>
      <div className="mt-auto m-4 rounded-xl border border-white/10 bg-white/5 p-4"><div className="mb-1 text-xs font-semibold text-blue-300">FITZONE PRO</div><div className="text-xs leading-5 text-slate-400">All systems operational. Data saved locally.</div></div>
    </aside>
    {open && <button className="fixed inset-0 z-30 bg-slate-950/50 lg:hidden" onClick={() => setOpen(false)} />}
    <div className="lg:pl-[258px]">
      <header className="sticky top-0 z-20 flex h-[76px] items-center border-b border-slate-200 bg-white/95 px-4 backdrop-blur md:px-7">
        <button className="mr-3 rounded-lg p-2 lg:hidden" onClick={() => setOpen(true)}><Menu size={21} /></button>
        <div className="relative hidden max-w-md flex-1 md:block"><Search className="absolute left-3 top-2.5 text-slate-400" size={18} /><input className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-400" placeholder="Search members, payments, leads..." onKeyDown={e => e.key === 'Enter' && navigate(`/members?q=${encodeURIComponent(e.currentTarget.value)}`)} /></div>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={() => navigate('/notifications')} className="relative rounded-xl p-2.5 text-slate-500 hover:bg-slate-100"><Bell size={20} />{unread > 0 && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />}</button>
          <button onClick={() => navigate('/settings')} className="rounded-xl p-2.5 text-slate-500 hover:bg-slate-100"><Settings size={20} /></button>
          <div className="relative ml-1"><button onClick={() => setProfile(!profile)} className="flex items-center gap-3 rounded-xl p-1.5 hover:bg-slate-50"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0b1f3a] text-sm font-bold text-white">AP</div><div className="hidden text-left sm:block"><div className="text-xs font-bold text-slate-800">Arjun Patel</div><div className="text-[10px] text-slate-400">Gym Owner</div></div><ChevronDown size={14} className="hidden sm:block" /></button>{profile && <Card className="absolute right-0 top-12 w-48 p-2"><button onClick={() => navigate('/settings')} className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-50">Profile settings</button><button onClick={() => notify('Demo session is secured locally')} className="w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50">Sign out</button></Card>}</div>
        </div>
      </header>
      <main key={location.pathname} className="mx-auto max-w-[1600px] p-4 md:p-7"><Outlet /></main>
    </div><Toasts />
  </div>
}

const statColors = ['blue', 'emerald', 'red', 'amber', 'indigo', 'orange', 'violet', 'cyan']
function Dashboard() {
  const store = useStore()
  const navigate = useNavigate()
  const now = new Date()
  const active = store.members.filter(m => m.status === 'Active').length
  const expired = store.members.filter(m => m.status === 'Expired' || new Date(m.endDate) < now).length
  const soon = store.members.filter(m => { const d = (new Date(m.endDate).getTime() - now.getTime()) / 864e5; return d >= 0 && d <= 15 }).length
  const received = store.payments.filter(p => p.status !== 'Refunded').reduce((s, p) => s + Number(p.paid), 0)
  const pending = store.payments.reduce((s, p) => s + Number(p.pending), 0)
  const newMonth = store.members.filter(m => new Date(m.joiningDate).getMonth() === now.getMonth()).length
  const stats = [
    ['Total Members', store.members.length, Users, '+12% this quarter'], ['Active Members', active, Activity, `${Math.round(active / store.members.length * 100)}% retention`],
    ['Expired Memberships', expired, TrendingDown, 'Needs follow-up'], ['Expiring Soon', soon, CalendarCheck, 'Next 15 days'],
    ['Total Collected', money(received), IndianRupee, 'Cash received'], ['Pending Payments', money(pending), ReceiptIndianRupee, 'Outstanding dues'],
    ['Total Leads', store.leads.length, Target, `${store.leads.filter(l => l.status === 'Converted').length} converted`], ['New This Month', newMonth, TrendingUp, 'Member registrations'],
  ] as const
  const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar']
  const revenue = months.map((month, i) => ({ month, revenue: Math.round(received * (.1 + i * .028)), expense: Math.round(store.expenses.reduce((s, e) => s + Number(e.amount), 0) * (.12 + (i % 2) * .02)) }))
  const planData = store.plans.map((p, i) => ({ name: p.name.replace(' Plan', ''), value: store.members.filter(m => m.plan === p.name).length, fill: ['#1769e0', '#15a673', '#f59e0b', '#8b5cf6', '#06b6d4', '#ef4444'][i] }))
  const quick = [
    ['Add New Member', '/members?add=1', Users], ['Create Membership', '/plans?add=1', ShieldCheck], ['Record Payment', '/payments?add=1', CreditCard],
    ['Add New Lead', '/leads?add=1', Target], ['Add Expense', '/accounting?tab=expenses&add=1', ReceiptIndianRupee],
  ] as const
  return <>
    <PageHeader title="Dashboard" description={`Welcome back, Arjun. Here’s what’s happening at FitZone today.`}><Button variant="secondary" onClick={() => navigate('/reports')}><FileBarChart size={17} />View reports</Button><Button onClick={() => navigate('/members?add=1')}><Plus size={17} />Add member</Button></PageHeader>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{stats.map(([label, value, Icon, caption], i) => <Card key={label} className="p-5"><div className="flex items-start justify-between"><div><div className="text-xs font-semibold text-slate-500">{label}</div><div className="mt-2 text-2xl font-bold tracking-tight text-[#0b1f3a]">{value}</div></div><div className={`stat-icon ${statColors[i]}`}><Icon size={20} /></div></div><div className="mt-3 text-[11px] text-slate-400">{caption}</div></Card>)}</div>
    <div className="mt-5 grid gap-5 xl:grid-cols-3">
      <Card className="p-5 xl:col-span-2"><SectionTitle title="Monthly revenue" subtitle="Revenue and operating expenses" /><div className="h-72"><ResponsiveContainer width="100%" height="100%"><AreaChart data={revenue}><defs><linearGradient id="blue" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#1769e0" stopOpacity=".25" /><stop offset="1" stopColor="#1769e0" stopOpacity="0" /></linearGradient></defs><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e8edf4" /><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} /><YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} /><Tooltip formatter={v => money(Number(v))} /><Area type="monotone" dataKey="revenue" stroke="#1769e0" strokeWidth={3} fill="url(#blue)" /><Line type="monotone" dataKey="expense" stroke="#f59e0b" /></AreaChart></ResponsiveContainer></div></Card>
      <Card className="p-5"><SectionTitle title="Plan distribution" subtitle="Members by active plan" /><div className="h-72"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={planData} dataKey="value" innerRadius={55} outerRadius={84} paddingAngle={3}>{planData.map((p, i) => <Cell key={i} fill={p.fill} />)}</Pie><Tooltip /><Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} /></PieChart></ResponsiveContainer></div></Card>
    </div>
    <div className="mt-5 grid gap-5 xl:grid-cols-3">
      <Card className="overflow-hidden xl:col-span-2"><div className="p-5"><SectionTitle title="Recent registrations" subtitle="Latest members joining the club" action={() => navigate('/members')} /></div><DataTable pageSize={5} data={store.members.slice(0, 5)} columns={[{ key: 'name', label: 'Member', render: x => <NameCell name={x.name} sub={x.id} /> }, { key: 'plan', label: 'Plan' }, { key: 'joiningDate', label: 'Joined' }, { key: 'status', label: 'Status', render: x => <Badge value={x.status} /> }]} /></Card>
      <div className="space-y-5"><Card className="p-5"><SectionTitle title="Quick actions" subtitle="Common management tasks" /><div className="mt-4 grid grid-cols-2 gap-2">{quick.map(([label, to, Icon]) => <button onClick={() => navigate(to)} key={label} className="flex min-h-24 flex-col items-start justify-between rounded-xl border border-slate-200 p-3 text-left text-xs font-semibold text-slate-700 hover:border-blue-300 hover:bg-blue-50"><Icon className="text-blue-600" size={18} />{label}</button>)}</div></Card>
      <Card className="p-5"><SectionTitle title="Renewal alerts" subtitle="Members requiring attention" action={() => navigate('/renewals')} /><div className="mt-3 space-y-3">{store.members.filter(m => new Date(m.endDate) <= new Date(shiftDate(15))).slice(0, 3).map(m => <div key={m.id} className="flex items-center gap-3"><div className="h-2 w-2 rounded-full bg-amber-500" /><div className="min-w-0 flex-1"><div className="truncate text-xs font-semibold">{m.name}</div><div className="text-[10px] text-slate-400">Ends {m.endDate}</div></div><Badge value={new Date(m.endDate) < now ? 'Expired' : 'Soon'} /></div>)}</div></Card></div>
    </div>
  </>
}

function SectionTitle({ title, subtitle, action }: { title: string; subtitle: string; action?: () => void }) {
  return <div className="flex items-start justify-between"><div><h3 className="text-sm font-bold text-[#0b1f3a]">{title}</h3><p className="mt-1 text-xs text-slate-400">{subtitle}</p></div>{action && <button onClick={action} className="text-xs font-semibold text-blue-600">View all</button>}</div>
}
function NameCell({ name, sub }: { name: string; sub?: string }) {
  return <div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-xs font-bold text-blue-700">{name.split(' ').map(x => x[0]).join('').slice(0, 2)}</div><div><div className="font-semibold text-slate-800">{name}</div>{sub && <div className="text-[10px] text-slate-400">{sub}</div>}</div></div>
}

const memberFields: Field[] = [
  { key: 'name', label: 'Full name', required: true }, { key: 'mobile', label: 'Mobile number', required: true }, { key: 'email', label: 'Email address', type: 'email', required: true },
  { key: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female', 'Other'] }, { key: 'dob', label: 'Date of birth', type: 'date' }, { key: 'address', label: 'Address' },
  { key: 'joiningDate', label: 'Joining date', type: 'date', required: true }, { key: 'emergency', label: 'Emergency contact' }, { key: 'trainer', label: 'Assigned trainer', type: 'select', options: ['Vikram Solanki', 'Neha Sharma', 'Kunal Das', 'Priya Kulkarni', 'Manav Sethi'] },
  { key: 'plan', label: 'Membership plan', type: 'select', options: ['Monthly Plan', 'Quarterly Plan', 'Half-Yearly Plan', 'Yearly Plan', 'Premium Plan', 'Personal Training'], required: true },
  { key: 'startDate', label: 'Membership start', type: 'date', required: true }, { key: 'endDate', label: 'Membership end', type: 'date', required: true },
  { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Pending', 'Expired', 'Inactive'], required: true }, { key: 'totalPaid', label: 'Total paid', type: 'number' },
  { key: 'pending', label: 'Pending amount', type: 'number' }, { key: 'notes', label: 'Notes', type: 'textarea' },
]
const planFields: Field[] = [
  { key: 'name', label: 'Plan name', required: true }, { key: 'description', label: 'Description' }, { key: 'duration', label: 'Duration (months)', type: 'number', required: true },
  { key: 'price', label: 'Price', type: 'number', required: true }, { key: 'discount', label: 'Discount', type: 'number' }, { key: 'finalPrice', label: 'Final price', type: 'number', required: true },
  { key: 'benefits', label: 'Benefits' }, { key: 'access', label: 'Access type', type: 'select', options: ['Standard', 'All access', 'Premium', 'Personal training'] }, { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'], required: true },
]
const trainerFields: Field[] = [
  { key: 'name', label: 'Full name', required: true }, { key: 'mobile', label: 'Mobile number', required: true }, { key: 'email', label: 'Email', type: 'email', required: true },
  { key: 'specialization', label: 'Specialization', required: true }, { key: 'joiningDate', label: 'Joining date', type: 'date' }, { key: 'salary', label: 'Monthly salary', type: 'number' }, { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive', 'On Leave'], required: true },
]
const paymentFields: Field[] = [
  { key: 'memberId', label: 'Member ID', required: true }, { key: 'member', label: 'Member name', required: true }, { key: 'membershipId', label: 'Membership ID' }, { key: 'date', label: 'Payment date', type: 'date', required: true },
  { key: 'total', label: 'Total amount', type: 'number', required: true }, { key: 'discount', label: 'Discount', type: 'number' }, { key: 'paid', label: 'Paid amount', type: 'number', required: true },
  { key: 'pending', label: 'Pending amount', type: 'number' }, { key: 'method', label: 'Payment method', type: 'select', options: ['Cash', 'UPI', 'Credit Card', 'Debit Card', 'Bank Transfer'], required: true },
  { key: 'status', label: 'Payment status', type: 'select', options: ['Paid', 'Partially Paid', 'Pending', 'Refunded'], required: true }, { key: 'reference', label: 'Transaction reference' }, { key: 'notes', label: 'Notes', type: 'textarea' },
]
const leadFields: Field[] = [
  { key: 'name', label: 'Full name', required: true }, { key: 'mobile', label: 'Mobile number', required: true }, { key: 'email', label: 'Email', type: 'email' }, { key: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female', 'Other'] },
  { key: 'age', label: 'Age', type: 'number' }, { key: 'plan', label: 'Interested plan', type: 'select', options: ['Monthly Plan', 'Quarterly Plan', 'Half-Yearly Plan', 'Yearly Plan', 'Premium Plan', 'Personal Training'] },
  { key: 'source', label: 'Lead source', type: 'select', options: ['Walk-in', 'Website', 'Instagram', 'Facebook', 'Referral', 'Phone Call', 'Google Ads'] }, { key: 'enquiryDate', label: 'Enquiry date', type: 'date' },
  { key: 'followUpDate', label: 'Follow-up date', type: 'date' }, { key: 'staff', label: 'Assigned staff' }, { key: 'status', label: 'Lead status', type: 'select', options: ['New', 'Contacted', 'Interested', 'Trial Scheduled', 'Converted', 'Not Interested', 'Lost'], required: true }, { key: 'notes', label: 'Notes', type: 'textarea' },
]

type CrudProps = {
  title: string; description: string; collection: 'members' | 'plans' | 'payments' | 'leads' | 'trainers' | 'expenses' | 'income'; fields: Field[];
  columns: { key: string; label: string; render?: (x: RecordItem) => React.ReactNode }[]; statuses?: string[]; idPrefix: string;
  initial?: Partial<RecordItem>; onSave?: (item: RecordItem, old?: RecordItem | null) => void; detail?: (item: RecordItem) => React.ReactNode; extraActions?: (openAdd: () => void) => React.ReactNode;
}
function CrudPage(props: CrudProps) {
  const store = useStore()
  const data = store[props.collection] as RecordItem[]
  const [search, setSearch] = useState(new URLSearchParams(location.search).get('q') || '')
  const [filter, setFilter] = useState('')
  const [editing, setEditing] = useState<RecordItem | null>(null)
  const [viewing, setViewing] = useState<RecordItem | null>(null)
  const [adding, setAdding] = useState(new URLSearchParams(location.search).get('add') === '1')
  const filtered = data.filter(x => (!filter || x.status === filter) && Object.values(x).some(v => String(v).toLowerCase().includes(search.toLowerCase())))
  const save = (form: Partial<RecordItem>) => {
    const item: RecordItem = { ...props.initial, ...form, id: form.id || uid(props.idPrefix) }
    if (editing) store.update(props.collection, item); else store.add(props.collection, item)
    props.onSave?.(item, editing)
    setEditing(null); setAdding(false); notify(`${props.title.replace(/s$/, '')} ${editing ? 'updated' : 'created'} successfully`)
  }
  const remove = (item: RecordItem) => {
    if (!confirm(`Delete ${item.name || item.id}? This action cannot be undone.`)) return
    store.remove(props.collection, item.id); notify('Record deleted successfully')
  }
  return <>
    <PageHeader title={props.title} description={props.description} action={() => setAdding(true)}>{props.extraActions?.(() => setAdding(true))}</PageHeader>
    <Card><Toolbar search={search} setSearch={setSearch} filter={filter} setFilter={setFilter} options={props.statuses} onExport={() => exportCsv(props.collection, filtered)} /><DataTable data={filtered} columns={props.columns} onView={setViewing} onEdit={setEditing} onDelete={remove} /></Card>
    {(adding || editing) && <Modal title={editing ? `Edit ${props.title.replace(/s$/, '')}` : `Add ${props.title.replace(/s$/, '')}`} onClose={() => { setAdding(false); setEditing(null) }} wide><EntityForm fields={props.fields} initial={editing || props.initial} onCancel={() => { setAdding(false); setEditing(null) }} onSubmit={save} /></Modal>}
    {viewing && <Modal title={`${viewing.name || viewing.id} details`} onClose={() => setViewing(null)} wide>{props.detail ? props.detail(viewing) : <DetailGrid item={viewing} />}</Modal>}
  </>
}

function Members() {
  const navigate = useNavigate()
  return <CrudPage title="Members" description="Manage member profiles, memberships, balances and activity." collection="members" fields={memberFields} idPrefix="MEM"
    initial={{ joiningDate: today(), startDate: today(), status: 'Active', totalPaid: 0, pending: 0 }}
    statuses={['Active', 'Expired', 'Pending', 'Inactive']}
    columns={[{ key: 'name', label: 'Member', render: x => <NameCell name={x.name} sub={x.id} /> }, { key: 'mobile', label: 'Contact' }, { key: 'plan', label: 'Plan' }, { key: 'endDate', label: 'Expires' }, { key: 'pending', label: 'Due', render: x => <span className={x.pending ? 'font-semibold text-red-600' : ''}>{money(x.pending)}</span> }, { key: 'status', label: 'Status', render: x => <Badge value={x.status} /> }]}
    detail={x => <div><div className="mb-5 flex items-center gap-4 rounded-2xl bg-[#0b1f3a] p-5 text-white"><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500 text-lg font-bold">{x.name.split(' ').map((n: string) => n[0]).join('')}</div><div><h3 className="font-bold">{x.name}</h3><p className="text-xs text-blue-200">{x.id} · {x.plan}</p></div><div className="ml-auto"><Badge value={x.status} /></div></div><DetailGrid item={x} /><div className="mt-6 grid gap-4 md:grid-cols-3">{['Payment history', 'Renewal history', 'Attendance history'].map((t, i) => <Card className="p-4" key={t}><h4 className="text-xs font-bold">{t}</h4><div className="mt-3 text-2xl font-bold text-[#0b1f3a]">{[money(x.totalPaid), '2 records', '14 visits'][i]}</div><p className="mt-1 text-[11px] text-slate-400">Lifetime activity</p></Card>)}</div></div>}
    extraActions={() => <Button variant="secondary" onClick={() => navigate('/renewals')}><Activity size={16} />Renew membership</Button>} />
}
function Plans() {
  const store = useStore()
  return <CrudPage title="Membership Plans" description="Build flexible packages and control gym access." collection="plans" fields={planFields} idPrefix="PLN" initial={{ discount: 0, status: 'Active' }} statuses={['Active', 'Inactive']}
    columns={[{ key: 'name', label: 'Plan', render: x => <NameCell name={x.name} sub={`${x.duration} month${x.duration > 1 ? 's' : ''}`} /> }, { key: 'access', label: 'Access' }, { key: 'price', label: 'List price', render: x => money(x.price) }, { key: 'discount', label: 'Discount', render: x => money(x.discount) }, { key: 'finalPrice', label: 'Final price', render: x => <b className="text-[#0b1f3a]">{money(x.finalPrice)}</b> }, { key: 'status', label: 'Status', render: x => <Badge value={x.status} /> }]}
    detail={x => <><DetailGrid item={x} /><div className="mt-5 rounded-xl bg-blue-50 p-4 text-sm text-blue-800">{store.members.filter(m => m.plan === x.name).length} members are currently assigned to this plan.</div></>} />
}

function Payments() {
  const store = useStore()
  const save = (item: RecordItem, old?: RecordItem | null) => {
    const due = Math.max(0, Number(item.total) - Number(item.discount || 0) - Number(item.paid))
    item.pending = due; item.status = item.status === 'Refunded' ? 'Refunded' : due === 0 ? 'Paid' : Number(item.paid) > 0 ? 'Partially Paid' : 'Pending'
    const member = store.members.find(m => m.id === item.memberId)
    if (member) {
      const delta = Number(item.paid) - Number(old?.paid || 0)
      store.update('members', { ...member, totalPaid: Math.max(0, Number(member.totalPaid) + delta), pending: Math.max(0, Number(member.pending) - delta) })
    }
    store.add('notifications', { id: uid('NOT'), title: 'Payment received', message: `${money(item.paid)} received from ${item.member}`, type: 'success', read: false, date: today() })
  }
  return <CrudPage title="Payments" description="Track collections, partial payments, refunds and receipts." collection="payments" fields={paymentFields} idPrefix="PAY"
    initial={{ date: today(), discount: 0, paid: 0, pending: 0, method: 'UPI', status: 'Paid' }} onSave={save}
    statuses={['Paid', 'Partially Paid', 'Pending', 'Refunded']}
    columns={[{ key: 'id', label: 'Payment ID' }, { key: 'member', label: 'Member', render: x => <NameCell name={x.member} sub={x.memberId} /> }, { key: 'date', label: 'Date' }, { key: 'paid', label: 'Paid', render: x => <b>{money(x.paid)}</b> }, { key: 'pending', label: 'Pending', render: x => money(x.pending) }, { key: 'method', label: 'Method' }, { key: 'status', label: 'Status', render: x => <Badge value={x.status} /> }]}
    detail={x => <><DetailGrid item={x} /><div className="mt-5 flex justify-end gap-2"><Button variant="secondary" onClick={() => window.print()}><ClipboardList size={16} />Print receipt</Button><Button onClick={() => { const w = window.open('', '_blank'); w?.document.write(`<h1>FitZone Fitness Club</h1><h2>Payment Receipt ${x.id}</h2><p>Member: ${x.member}</p><p>Paid: ${money(x.paid)}</p><p>Date: ${x.date}</p>`); w?.print() }}><ReceiptIndianRupee size={16} />Generate receipt</Button></div></>} />
}

function Leads() {
  const store = useStore()
  const navigate = useNavigate()
  const [kanban, setKanban] = useState(false)
  const convert = (lead: RecordItem) => {
    if (lead.status === 'Converted') return notify('Lead is already converted', 'error')
    store.add('members', { id: uid('MEM'), name: lead.name, mobile: lead.mobile, email: lead.email, gender: lead.gender, dob: '', address: '', joiningDate: today(), emergency: '', trainer: lead.staff, plan: lead.plan || 'Monthly Plan', startDate: today(), endDate: shiftDate(30), status: 'Active', totalPaid: 0, pending: 1500, notes: `Converted from ${lead.id}` })
    store.update('leads', { ...lead, status: 'Converted', history: [...(lead.history || []), { date: today(), note: 'Converted to member' }] })
    notify('Lead converted and member profile created')
    navigate('/members')
  }
  if (kanban) {
    const statuses = ['New', 'Contacted', 'Interested', 'Trial Scheduled', 'Converted', 'Lost']
    return <><PageHeader title="Lead Pipeline" description="Visualise enquiries across your conversion funnel."><Button variant="secondary" onClick={() => setKanban(false)}>Table view</Button></PageHeader><div className="grid gap-4 overflow-x-auto lg:grid-cols-3 xl:grid-cols-6">{statuses.map(status => <div key={status} className="min-w-56"><div className="mb-3 flex items-center justify-between text-xs font-bold text-slate-600"><span>{status}</span><span className="rounded-full bg-slate-200 px-2 py-0.5">{store.leads.filter(l => l.status === status).length}</span></div><div className="space-y-3">{store.leads.filter(l => l.status === status).map(l => <Card className="p-4" key={l.id}><NameCell name={l.name} sub={l.source} /><p className="mt-3 text-xs text-slate-500">{l.mobile}</p><p className="mt-1 text-[10px] text-slate-400">Follow up: {l.followUpDate}</p>{status !== 'Converted' && <button onClick={() => convert(l)} className="mt-3 text-xs font-semibold text-blue-600">Convert member</button>}</Card>)}</div></div>)}</div></>
  }
  return <CrudPage title="Leads & Enquiries" description="Manage enquiries, follow-ups and your conversion pipeline." collection="leads" fields={leadFields} idPrefix="LEAD" initial={{ enquiryDate: today(), followUpDate: shiftDate(2), status: 'New', history: [] }} statuses={['New', 'Contacted', 'Interested', 'Trial Scheduled', 'Converted', 'Not Interested', 'Lost']}
    columns={[{ key: 'name', label: 'Lead', render: x => <NameCell name={x.name} sub={x.id} /> }, { key: 'mobile', label: 'Contact' }, { key: 'source', label: 'Source' }, { key: 'plan', label: 'Interested plan' }, { key: 'followUpDate', label: 'Follow-up' }, { key: 'status', label: 'Status', render: x => <Badge value={x.status} /> }]}
    detail={x => <><DetailGrid item={x} exclude={['history']} /><h4 className="mt-5 text-sm font-bold">Follow-up history</h4><div className="mt-2 space-y-2">{(x.history || []).map((h: any, i: number) => <div key={i} className="rounded-xl bg-slate-50 p-3 text-xs"><b>{h.date}</b> — {h.note}</div>)}</div>{x.status !== 'Converted' && <Button className="mt-5" onClick={() => convert(x)}>Convert to member</Button>}</>}
    extraActions={() => <Button variant="secondary" onClick={() => setKanban(true)}><LayoutDashboard size={16} />Kanban board</Button>} />
}

function Trainers() {
  const store = useStore()
  return <CrudPage title="Trainers" description="Manage your coaching team, assignments and performance." collection="trainers" fields={trainerFields} idPrefix="TRN" initial={{ joiningDate: today(), status: 'Active' }} statuses={['Active', 'Inactive', 'On Leave']}
    columns={[{ key: 'name', label: 'Trainer', render: x => <NameCell name={x.name} sub={x.id} /> }, { key: 'specialization', label: 'Specialization' }, { key: 'mobile', label: 'Contact' }, { key: 'salary', label: 'Salary', render: x => money(x.salary) }, { key: 'status', label: 'Status', render: x => <Badge value={x.status} /> }]}
    detail={x => <><DetailGrid item={x} /><div className="mt-5 grid grid-cols-2 gap-4"><Card className="p-4"><div className="text-xs text-slate-400">Assigned members</div><div className="mt-2 text-2xl font-bold text-[#0b1f3a]">{store.members.filter(m => m.trainer === x.name).length}</div></Card><Card className="p-4"><div className="text-xs text-slate-400">Performance score</div><div className="mt-2 text-2xl font-bold text-emerald-600">92%</div></Card></div></>} />
}

function Attendance() {
  const store = useStore()
  const [member, setMember] = useState('')
  const [date, setDate] = useState(today())
  const [search, setSearch] = useState('')
  const mark = () => {
    const m = store.members.find(x => x.id === member)
    if (!m) return notify('Select a member first', 'error')
    if (store.attendance.some(a => a.memberId === member && a.date === date && !a.checkOut)) return notify('Member already has an open check-in today', 'error')
    store.add('attendance', { id: uid('ATT'), memberId: m.id, member: m.name, date, checkIn: new Date().toTimeString().slice(0, 5), checkOut: '' }); notify('Member checked in')
  }
  const checkout = (a: RecordItem) => { store.update('attendance', { ...a, checkOut: new Date().toTimeString().slice(0, 5) }); notify('Check-out recorded') }
  const filtered = store.attendance.filter(a => (!date || a.date === date) && a.member.toLowerCase().includes(search.toLowerCase()))
  return <><PageHeader title="Attendance" description="Track check-ins, sessions and member visit frequency." /><div className="grid gap-5 xl:grid-cols-4"><Card className="p-5"><SectionTitle title="Mark attendance" subtitle="Record a member check-in" /><div className="mt-5 space-y-4"><label className="block text-xs font-semibold">Member<select className="input mt-1.5" value={member} onChange={e => setMember(e.target.value)}><option value="">Select member</option>{store.members.filter(m => m.status === 'Active').map(m => <option key={m.id} value={m.id}>{m.name} · {m.id}</option>)}</select></label><label className="block text-xs font-semibold">Date<input className="input mt-1.5" type="date" value={date} onChange={e => setDate(e.target.value)} /></label><Button className="w-full" onClick={mark}><CalendarCheck size={17} />Check in member</Button></div><div className="mt-5 rounded-xl bg-emerald-50 p-4"><div className="text-xs font-semibold text-emerald-700">Today’s attendance</div><div className="mt-1 text-2xl font-bold text-emerald-800">{store.attendance.filter(a => a.date === today()).length}</div></div></Card><Card className="overflow-hidden xl:col-span-3"><Toolbar search={search} setSearch={setSearch} /><DataTable data={filtered} columns={[{ key: 'member', label: 'Member', render: x => <NameCell name={x.member} sub={x.memberId} /> }, { key: 'date', label: 'Date' }, { key: 'checkIn', label: 'Check-in' }, { key: 'checkOut', label: 'Check-out', render: x => x.checkOut || <button className="font-semibold text-blue-600" onClick={() => checkout(x)}>Check out</button> }, { key: 'session', label: 'Session', render: x => <Badge value={x.checkOut ? 'Completed' : 'In gym'} /> }]} onDelete={x => confirm('Delete this attendance record?') && store.remove('attendance', x.id)} /></Card></div></>
}

function Renewals() {
  const store = useStore()
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<RecordItem | null>(null)
  const fields: Field[] = [{ key: 'memberId', label: 'Member ID', required: true }, { key: 'member', label: 'Member name', required: true }, { key: 'newPlan', label: 'New membership plan', type: 'select', options: store.plans.filter(p => p.status === 'Active').map(p => p.name), required: true }, { key: 'startDate', label: 'Renewal start', type: 'date', required: true }, { key: 'discount', label: 'Renewal discount', type: 'number' }, { key: 'method', label: 'Payment method', type: 'select', options: ['Cash', 'UPI', 'Credit Card', 'Debit Card', 'Bank Transfer'], required: true }]
  const save = (form: Partial<RecordItem>) => {
    const member = store.members.find(m => m.id === form.memberId)
    const plan = store.plans.find(p => p.name === form.newPlan)
    if (!member || !plan) return notify('Valid member and plan are required', 'error')
    const start = new Date(form.startDate); start.setMonth(start.getMonth() + Number(plan.duration)); const end = start.toISOString().slice(0, 10)
    const amount = Math.max(0, Number(plan.finalPrice) - Number(form.discount || 0))
    store.add('renewals', { id: uid('REN'), memberId: member.id, member: member.name, oldPlan: member.plan, newPlan: plan.name, startDate: form.startDate, endDate: end, amount, discount: Number(form.discount || 0), status: 'Completed' })
    store.update('members', { ...member, plan: plan.name, startDate: form.startDate, endDate: end, status: 'Active', totalPaid: Number(member.totalPaid) + amount, pending: 0 })
    store.add('payments', { id: uid('PAY'), memberId: member.id, member: member.name, membershipId: `MS-${member.id}`, date: today(), total: amount, discount: Number(form.discount || 0), paid: amount, pending: 0, method: form.method, status: 'Paid', reference: uid('REN-TXN'), notes: 'Membership renewal' })
    setOpen(false); setSelected(null); notify('Membership renewed and payment recorded')
  }
  const due = store.members.filter(m => new Date(m.endDate) <= new Date(shiftDate(15)))
  return <><PageHeader title="Membership Renewals" description="Protect retention with a complete, non-destructive renewal history." action={() => setOpen(true)} /><div className="mb-5 grid gap-4 sm:grid-cols-3"><MiniStat label="Expiring in 7 days" value={due.filter(m => new Date(m.endDate) >= new Date() && new Date(m.endDate) <= new Date(shiftDate(7))).length} tone="amber" /><MiniStat label="Expiring in 15 days" value={due.filter(m => new Date(m.endDate) >= new Date()).length} tone="blue" /><MiniStat label="Expired memberships" value={due.filter(m => new Date(m.endDate) < new Date()).length} tone="red" /></div><Card className="overflow-hidden"><DataTable data={due} columns={[{ key: 'name', label: 'Member', render: x => <NameCell name={x.name} sub={x.id} /> }, { key: 'plan', label: 'Current plan' }, { key: 'endDate', label: 'End date' }, { key: 'pending', label: 'Outstanding', render: x => money(x.pending) }, { key: 'status', label: 'Status', render: x => <Badge value={new Date(x.endDate) < new Date() ? 'Expired' : 'Expiring soon'} /> }, { key: 'renew', label: '', render: x => <Button className="!px-3 !py-1.5" onClick={() => { setSelected(x); setOpen(true) }}>Renew</Button> }]} /></Card><Card className="mt-5 overflow-hidden"><div className="p-5"><SectionTitle title="Renewal history" subtitle="Previous records are preserved for auditability" /></div><DataTable data={store.renewals} columns={[{ key: 'id', label: 'Renewal ID' }, { key: 'member', label: 'Member' }, { key: 'oldPlan', label: 'Previous plan' }, { key: 'newPlan', label: 'New plan' }, { key: 'startDate', label: 'Start' }, { key: 'endDate', label: 'End' }, { key: 'amount', label: 'Amount', render: x => money(x.amount) }]} /></Card>{open && <Modal title="Renew membership" onClose={() => { setOpen(false); setSelected(null) }}><EntityForm fields={fields} initial={{ memberId: selected?.id || '', member: selected?.name || '', newPlan: selected?.plan || '', startDate: selected ? shiftDate(1) : today(), discount: 0, method: 'UPI' }} onSubmit={save} onCancel={() => setOpen(false)} submitLabel="Renew & record payment" /></Modal>}</>
}
function MiniStat({ label, value, tone }: { label: string; value: number | string; tone: string }) {
  const tones: Record<string, string> = { amber: 'text-amber-600', blue: 'text-blue-600', red: 'text-red-600', emerald: 'text-emerald-600' }
  return <Card className="p-5"><div className={`text-xs font-semibold ${tones[tone] || 'text-blue-600'}`}>{label}</div><div className="mt-2 text-3xl font-bold text-[#0b1f3a]">{value}</div></Card>
}

const expenseFields: Field[] = [{ key: 'category', label: 'Expense category', type: 'select', options: ['Rent', 'Electricity', 'Staff Salaries', 'Equipment Purchases', 'Equipment Maintenance', 'Marketing Expenses', 'Cleaning Expenses', 'Other Expenses'], required: true }, { key: 'description', label: 'Description', required: true }, { key: 'amount', label: 'Amount', type: 'number', required: true }, { key: 'date', label: 'Expense date', type: 'date', required: true }, { key: 'method', label: 'Payment method', type: 'select', options: ['Cash', 'UPI', 'Credit Card', 'Debit Card', 'Bank Transfer'] }, { key: 'vendor', label: 'Vendor name' }, { key: 'receipt', label: 'Receipt reference' }, { key: 'notes', label: 'Notes', type: 'textarea' }]
const incomeFields: Field[] = [{ key: 'category', label: 'Income category', type: 'select', options: ['Personal Training Income', 'Other Income'], required: true }, { key: 'description', label: 'Description', required: true }, { key: 'amount', label: 'Amount', type: 'number', required: true }, { key: 'date', label: 'Payment date', type: 'date', required: true }, { key: 'method', label: 'Payment method', type: 'select', options: ['Cash', 'UPI', 'Credit Card', 'Debit Card', 'Bank Transfer'] }, { key: 'reference', label: 'Reference number' }]
function Accounting() {
  const store = useStore()
  const params = new URLSearchParams(location.search)
  const [tab, setTab] = useState(params.get('tab') || 'overview')
  const paymentIncome = store.payments.filter(p => p.status !== 'Refunded').reduce((s, p) => s + Number(p.paid), 0)
  const otherIncome = store.income.reduce((s, x) => s + Number(x.amount), 0)
  const expense = store.expenses.reduce((s, x) => s + Number(x.amount), 0)
  const pending = store.payments.reduce((s, x) => s + Number(x.pending), 0)
  const chart = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'].map((m, i) => ({ month: m, income: Math.round((paymentIncome + otherIncome) * (.1 + i * .02)), expense: Math.round(expense * (.12 + (i % 2) * .025)) }))
  if (tab === 'expenses') return <><PageHeader title="Expenses" description="Record and categorise every operating expense."><Button variant="secondary" onClick={() => setTab('overview')}>Financial overview</Button></PageHeader><CrudPage title="" description="" collection="expenses" fields={expenseFields} idPrefix="EXP" initial={{ date: today(), method: 'UPI' }} columns={[{ key: 'id', label: 'Expense ID' }, { key: 'category', label: 'Category' }, { key: 'description', label: 'Description' }, { key: 'vendor', label: 'Vendor' }, { key: 'date', label: 'Date' }, { key: 'amount', label: 'Amount', render: x => <b className="text-red-600">{money(x.amount)}</b> }]} /></>
  if (tab === 'income') return <><PageHeader title="Other Income" description="Record non-membership income without double-counting payment records."><Button variant="secondary" onClick={() => setTab('overview')}>Financial overview</Button></PageHeader><CrudPage title="" description="" collection="income" fields={incomeFields} idPrefix="INC" initial={{ date: today(), method: 'UPI' }} columns={[{ key: 'id', label: 'Income ID' }, { key: 'category', label: 'Category' }, { key: 'description', label: 'Description' }, { key: 'date', label: 'Date' }, { key: 'method', label: 'Method' }, { key: 'amount', label: 'Amount', render: x => <b className="text-emerald-600">{money(x.amount)}</b> }]} /></>
  return <><PageHeader title="Financial Overview" description="Real-time cash flow, dues and profitability without double-counting."><Button variant="secondary" onClick={() => setTab('income')}><Plus size={16} />Other income</Button><Button onClick={() => setTab('expenses')}><Plus size={16} />Add expense</Button></PageHeader><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><MiniStat label="Cash received" value={money(paymentIncome + otherIncome)} tone="emerald" /><MiniStat label="Operating expenses" value={money(expense)} tone="red" /><MiniStat label="Net profit" value={money(paymentIncome + otherIncome - expense)} tone="blue" /><MiniStat label="Pending dues" value={money(pending)} tone="amber" /></div><div className="mt-5 grid gap-5 xl:grid-cols-3"><Card className="p-5 xl:col-span-2"><SectionTitle title="Income vs expenses" subtitle="Six-month performance" /><div className="h-80"><ResponsiveContainer width="100%" height="100%"><BarChart data={chart}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e8edf4" /><XAxis dataKey="month" axisLine={false} tickLine={false} /><YAxis axisLine={false} tickLine={false} /><Tooltip formatter={v => money(Number(v))} /><Legend /><Bar dataKey="income" fill="#1769e0" radius={[6, 6, 0, 0]} /><Bar dataKey="expense" fill="#f59e0b" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div></Card><Card className="p-5"><SectionTitle title="Income composition" subtitle="Actual cash received" /><div className="mt-5 space-y-5">{[['Membership payments', paymentIncome, 'bg-blue-500'], ['Other income', otherIncome, 'bg-emerald-500']].map(([n, v, c]) => <div key={String(n)}><div className="flex justify-between text-xs"><span>{n}</span><b>{money(Number(v))}</b></div><div className="mt-2 h-2 rounded-full bg-slate-100"><div className={`h-2 rounded-full ${c}`} style={{ width: `${Math.max(5, Number(v) / (paymentIncome + otherIncome) * 100)}%` }} /></div></div>)}</div><div className="mt-6 rounded-xl bg-amber-50 p-4 text-xs leading-5 text-amber-800">Membership payments are sourced directly from Payments and never duplicated as manual income.</div></Card></div></>
}

function Reports() {
  const store = useStore()
  const [type, setType] = useState('Member Registration Report')
  const [start, setStart] = useState(shiftDate(-365))
  const [end, setEnd] = useState(today())
  const reports: Record<string, RecordItem[]> = {
    'Member Registration Report': store.members, 'Active vs Expired Members': store.members, 'Membership Sales Report': store.payments,
    'Membership Renewal Report': store.renewals, 'Payment Collection Report': store.payments, 'Pending Dues Report': store.members.filter(m => m.pending > 0),
    'Leads Conversion Report': store.leads, 'Attendance Report': store.attendance, 'Income and Expense Report': [...store.income, ...store.expenses],
    'Profit and Loss Report': [...store.income, ...store.expenses],
  }
  const rows = reports[type]
  const cols = Object.keys(rows[0] || {}).filter(k => typeof rows[0]?.[k] !== 'object').slice(0, 6).map(k => ({ key: k, label: k.replace(/([A-Z])/g, ' $1') }))
  return <><PageHeader title="Reports" description="Analyse performance and export operational data for any period."><Button onClick={() => exportCsv(type.toLowerCase().replace(/ /g, '-'), rows)}><FileBarChart size={16} />Export CSV</Button></PageHeader><Card className="mb-5 p-4"><div className="grid gap-4 md:grid-cols-3"><label className="text-xs font-semibold">Report type<select className="input mt-1.5" value={type} onChange={e => setType(e.target.value)}>{Object.keys(reports).map(r => <option key={r}>{r}</option>)}</select></label><label className="text-xs font-semibold">From date<input className="input mt-1.5" type="date" value={start} onChange={e => setStart(e.target.value)} /></label><label className="text-xs font-semibold">To date<input className="input mt-1.5" type="date" value={end} onChange={e => setEnd(e.target.value)} /></label></div></Card><div className="mb-4 grid gap-4 sm:grid-cols-3"><MiniStat label="Records in report" value={rows.length} tone="blue" /><MiniStat label="Report period" value={`${Math.ceil((new Date(end).getTime() - new Date(start).getTime()) / 864e5)} days`} tone="emerald" /><MiniStat label="Generated" value={today()} tone="amber" /></div><Card className="overflow-hidden"><div className="border-b border-slate-100 p-5"><SectionTitle title={type} subtitle={`${start} to ${end}`} /></div><DataTable data={rows} columns={cols} /></Card></>
}

function Notifications() {
  const store = useStore()
  const markAll = () => { store.notifications.forEach(n => store.update('notifications', { ...n, read: true })); notify('All notifications marked as read') }
  return <><PageHeader title="Notifications" description="Stay ahead of expiries, dues, follow-ups and member activity."><Button variant="secondary" onClick={markAll}>Mark all as read</Button></PageHeader><Card className="divide-y divide-slate-100">{store.notifications.map(n => <div key={n.id} className={`flex gap-4 p-5 ${n.read ? '' : 'bg-blue-50/40'}`}><div className={`mt-1 h-10 w-10 shrink-0 rounded-xl ${n.type === 'success' ? 'bg-emerald-100 text-emerald-600' : n.type === 'danger' ? 'bg-red-100 text-red-600' : n.type === 'warning' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'} flex items-center justify-center`}><Bell size={18} /></div><div className="flex-1"><div className="text-sm font-bold text-slate-800">{n.title}</div><div className="mt-1 text-xs text-slate-500">{n.message}</div><div className="mt-2 text-[10px] text-slate-400">{n.date}</div></div><div className="flex items-center gap-2">{!n.read && <button onClick={() => store.update('notifications', { ...n, read: true })} className="text-xs font-semibold text-blue-600">Mark read</button>}<button onClick={() => store.remove('notifications', n.id)} className="p-2 text-slate-400 hover:text-red-600"><X size={17} /></button></div></div>)}</Card></>
}

function SettingsPage() {
  const store = useStore()
  const [form, setForm] = useState(store.settings)
  const save = (e: React.FormEvent) => { e.preventDefault(); store.setSettings(form); notify('Settings saved successfully') }
  return <><PageHeader title="Settings" description="Configure your gym profile, billing and reminders." /><form onSubmit={save}><div className="grid gap-5 xl:grid-cols-3"><div className="space-y-2">{['Gym profile', 'Membership settings', 'Payment settings', 'Notification settings', 'User profile'].map((x, i) => <button type="button" key={x} className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left text-sm font-semibold ${i === 0 ? 'border-blue-200 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-600'}`}><UserRound size={17} />{x}</button>)}</div><Card className="p-6 xl:col-span-2"><div className="flex items-center gap-4 border-b border-slate-100 pb-5"><div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0b1f3a] text-white"><Dumbbell /></div><div><h3 className="font-bold text-[#0b1f3a]">Gym profile</h3><p className="text-xs text-slate-400">Business information shown on receipts and reports</p></div></div><div className="mt-5 grid gap-4 md:grid-cols-2">{[['gymName', 'Gym name'], ['location', 'Address / location'], ['phone', 'Contact number'], ['email', 'Email address'], ['currency', 'Currency'], ['gst', 'GST percentage']].map(([k, label]) => <label key={k} className="text-xs font-semibold">{label}<input className="input mt-1.5" type={k === 'gst' ? 'number' : 'text'} value={(form as any)[k]} onChange={e => setForm({ ...form, [k]: k === 'gst' ? Number(e.target.value) : e.target.value })} /></label>)}</div><div className="mt-6 border-t border-slate-100 pt-5"><h4 className="text-sm font-bold">Notification preferences</h4><div className="mt-4 space-y-3">{[['expiryReminders', 'Membership expiry reminders'], ['paymentReminders', 'Pending payment reminders']].map(([k, label]) => <label key={k} className="flex items-center justify-between rounded-xl bg-slate-50 p-4 text-sm font-semibold"><span>{label}</span><input type="checkbox" checked={(form as any)[k]} onChange={e => setForm({ ...form, [k]: e.target.checked })} className="h-4 w-4 accent-blue-600" /></label>)}</div></div><div className="mt-6 flex justify-end"><Button type="submit">Save changes</Button></div></Card></div></form></>
}

function NotFound() { const navigate = useNavigate(); return <div className="flex min-h-[60vh] flex-col items-center justify-center"><div className="text-7xl font-bold text-blue-100">404</div><h1 className="mt-4 text-xl font-bold">Page not found</h1><Button className="mt-5" onClick={() => navigate('/')}>Return to dashboard</Button></div> }

export const router = createBrowserRouter([{
  path: '/', Component: Shell, children: [
    { index: true, Component: Dashboard }, { path: 'members', Component: Members }, { path: 'plans', Component: Plans },
    { path: 'renewals', Component: Renewals }, { path: 'payments', Component: Payments }, { path: 'leads', Component: Leads },
    { path: 'attendance', Component: Attendance }, { path: 'trainers', Component: Trainers }, { path: 'accounting', Component: Accounting },
    { path: 'reports', Component: Reports }, { path: 'notifications', Component: Notifications }, { path: 'settings', Component: SettingsPage },
    { path: '*', Component: NotFound },
  ],
}])
