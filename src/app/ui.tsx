import { useEffect, useState, type ReactNode } from 'react'
import { CheckCircle2, ChevronLeft, ChevronRight, Download, Eye, Pencil, Plus, Search, Trash2, X } from 'lucide-react'
import type { RecordItem } from './data'

export const money = (value: number | string = 0) => `₹${Number(value).toLocaleString('en-IN')}`
export const pretty = (value: string) => value.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())

export function Button({ children, variant = 'primary', className = '', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'danger' | 'ghost' }) {
  const styles = {
    primary: 'bg-[#1769e0] text-white hover:bg-[#0e59c5] shadow-sm',
    secondary: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50',
    danger: 'bg-red-50 text-red-600 hover:bg-red-100',
    ghost: 'text-slate-600 hover:bg-slate-100',
  }
  return <button className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:opacity-50 ${styles[variant]} ${className}`} {...props}>{children}</button>
}

export function PageHeader({ title, description, action, children }: { title: string; description: string; action?: () => void; children?: ReactNode }) {
  return <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
    <div><div className="mb-2 text-xs font-semibold text-slate-400">FitZone / {title}</div><h1 className="text-2xl font-bold tracking-tight text-[#0b1f3a]">{title}</h1><p className="mt-1 text-sm text-slate-500">{description}</p></div>
    <div className="flex flex-wrap gap-2">{children}{action && <Button onClick={action}><Plus size={17} /> Add new</Button>}</div>
  </div>
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-slate-200/80 bg-white shadow-[0_3px_12px_rgba(15,23,42,.035)] ${className}`}>{children}</div>
}

export function Badge({ value }: { value: string }) {
  const v = value.toLowerCase()
  const cls = v.includes('active') || v === 'paid' || v.includes('completed') || v.includes('converted') ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/10'
    : v.includes('pending') || v.includes('partial') || v.includes('soon') || v.includes('leave') || v.includes('trial') ? 'bg-amber-50 text-amber-700 ring-amber-600/10'
    : v.includes('expired') || v.includes('lost') || v.includes('refund') || v.includes('inactive') ? 'bg-red-50 text-red-700 ring-red-600/10'
    : 'bg-blue-50 text-blue-700 ring-blue-600/10'
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${cls}`}>{value}</span>
}

export function Modal({ title, children, onClose, wide = false }: { title: string; children: ReactNode; onClose: () => void; wide?: boolean }) {
  useEffect(() => { const fn = (e: KeyboardEvent) => e.key === 'Escape' && onClose(); addEventListener('keydown', fn); return () => removeEventListener('keydown', fn) }, [onClose])
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#061225]/55 p-4 backdrop-blur-[2px]" onMouseDown={e => e.target === e.currentTarget && onClose()}>
    <div className={`max-h-[92vh] w-full overflow-auto rounded-2xl bg-white shadow-2xl ${wide ? 'max-w-4xl' : 'max-w-2xl'}`}>
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-5"><h2 className="text-lg font-bold text-[#0b1f3a]">{title}</h2><button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X size={20} /></button></div>
      <div className="p-6">{children}</div>
    </div>
  </div>
}

export type Field = { key: string; label: string; type?: 'text' | 'number' | 'date' | 'select' | 'textarea' | 'email'; options?: string[]; required?: boolean; placeholder?: string }

export function EntityForm({ fields, initial, onSubmit, onCancel, submitLabel = 'Save record' }: { fields: Field[]; initial?: Partial<RecordItem> | null; onSubmit: (data: Partial<RecordItem>) => void; onCancel: () => void; submitLabel?: string }) {
  const [form, setForm] = useState<Record<string, any>>(initial || {})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const next: Record<string, string> = {}
    fields.forEach(f => { if (f.required && !String(form[f.key] ?? '').trim()) next[f.key] = `${f.label} is required` })
    setErrors(next)
    if (Object.keys(next).length) return
    onSubmit(form)
  }
  return <form onSubmit={submit}>
    <div className="grid gap-4 md:grid-cols-2">{fields.map(f => <label key={f.key} className={f.type === 'textarea' ? 'md:col-span-2' : ''}>
      <span className="mb-1.5 block text-xs font-semibold text-slate-600">{f.label}{f.required && <span className="text-red-500"> *</span>}</span>
      {f.type === 'select' ? <select value={form[f.key] ?? ''} onChange={e => setForm({ ...form, [f.key]: e.target.value })} className="input"><option value="">Select {f.label.toLowerCase()}</option>{f.options?.map(o => <option key={o}>{o}</option>)}</select>
        : f.type === 'textarea' ? <textarea rows={3} value={form[f.key] ?? ''} onChange={e => setForm({ ...form, [f.key]: e.target.value })} className="input" placeholder={f.placeholder} />
        : <input type={f.type || 'text'} value={form[f.key] ?? ''} onChange={e => setForm({ ...form, [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value })} className="input" placeholder={f.placeholder || f.label} />}
      {errors[f.key] && <span className="mt-1 block text-xs text-red-500">{errors[f.key]}</span>}
    </label>)}</div>
    <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-5"><Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button><Button type="submit"><CheckCircle2 size={17} />{submitLabel}</Button></div>
  </form>
}

export function DataTable({ data, columns, onView, onEdit, onDelete, pageSize = 8 }: { data: RecordItem[]; columns: { key: string; label: string; render?: (item: RecordItem) => ReactNode }[]; onView?: (i: RecordItem) => void; onEdit?: (i: RecordItem) => void; onDelete?: (i: RecordItem) => void; pageSize?: number }) {
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState('')
  const sorted = [...data].sort((a, b) => sort ? String(a[sort] ?? '').localeCompare(String(b[sort] ?? ''), undefined, { numeric: true }) : 0)
  const pages = Math.max(1, Math.ceil(sorted.length / pageSize))
  const rows = sorted.slice((Math.min(page, pages) - 1) * pageSize, Math.min(page, pages) * pageSize)
  return <div className="overflow-hidden">
    <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left"><thead><tr className="border-b border-slate-200 bg-slate-50/80">{columns.map(c => <th key={c.key} onClick={() => setSort(c.key)} className="cursor-pointer px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">{c.label}</th>)}{(onView || onEdit || onDelete) && <th className="px-5 py-3.5 text-right text-[11px] font-bold uppercase tracking-wider text-slate-500">Actions</th>}</tr></thead>
      <tbody>{rows.map(item => <tr key={item.id} className="border-b border-slate-100 last:border-0 hover:bg-blue-50/30">{columns.map(c => <td key={c.key} className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">{c.render ? c.render(item) : item[c.key]}</td>)}{(onView || onEdit || onDelete) && <td className="px-5 py-3 text-right"><div className="flex justify-end gap-1">{onView && <button title="View" onClick={() => onView(item)} className="icon-btn"><Eye size={16} /></button>}{onEdit && <button title="Edit" onClick={() => onEdit(item)} className="icon-btn"><Pencil size={16} /></button>}{onDelete && <button title="Delete" onClick={() => onDelete(item)} className="icon-btn hover:!bg-red-50 hover:!text-red-600"><Trash2 size={16} /></button>}</div></td>}</tr>)}</tbody></table></div>
    {!rows.length && <div className="p-12 text-center text-sm text-slate-400">No records match your filters.</div>}
    <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4 text-xs text-slate-500"><span>Showing {rows.length} of {data.length} records</span><div className="flex items-center gap-2"><button className="icon-btn" disabled={page <= 1} onClick={() => setPage(p => p - 1)}><ChevronLeft size={16} /></button><span>Page {Math.min(page, pages)} of {pages}</span><button className="icon-btn" disabled={page >= pages} onClick={() => setPage(p => p + 1)}><ChevronRight size={16} /></button></div></div>
  </div>
}

export function Toolbar({ search, setSearch, filter, setFilter, options = [], onExport }: { search: string; setSearch: (v: string) => void; filter?: string; setFilter?: (v: string) => void; options?: string[]; onExport?: () => void }) {
  return <div className="flex flex-col gap-3 border-b border-slate-100 p-4 md:flex-row md:items-center">
    <div className="relative flex-1"><Search className="absolute left-3 top-2.5 text-slate-400" size={17} /><input className="input !py-2 !pl-9" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search records..." /></div>
    {setFilter && <select className="input !w-auto !py-2" value={filter} onChange={e => setFilter(e.target.value)}><option value="">All statuses</option>{options.map(o => <option key={o}>{o}</option>)}</select>}
    {onExport && <Button variant="secondary" onClick={onExport}><Download size={16} />Export CSV</Button>}
  </div>
}

export function exportCsv(name: string, rows: RecordItem[]) {
  if (!rows.length) return
  const keys = Object.keys(rows[0]).filter(k => typeof rows[0][k] !== 'object')
  const csv = [keys.join(','), ...rows.map(r => keys.map(k => `"${String(r[k] ?? '').replace(/"/g, '""')}"`).join(','))].join('\n')
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = `${name}.csv`; a.click(); URL.revokeObjectURL(a.href)
}

export function DetailGrid({ item, exclude = [] }: { item: RecordItem; exclude?: string[] }) {
  return <div className="grid gap-4 sm:grid-cols-2">{Object.entries(item).filter(([k, v]) => !exclude.includes(k) && typeof v !== 'object').map(([k, v]) => <div key={k} className="rounded-xl bg-slate-50 p-3"><div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{pretty(k)}</div><div className="mt-1 break-words text-sm font-semibold text-slate-700">{String(v || '—')}</div></div>)}</div>
}
