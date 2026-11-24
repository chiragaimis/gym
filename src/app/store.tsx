import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { initialData, type RecordItem } from './data'

type Data = typeof initialData
type Collection = keyof Pick<Data, 'members' | 'plans' | 'payments' | 'leads' | 'trainers' | 'expenses' | 'attendance' | 'renewals' | 'income' | 'notifications'>
type Store = Data & {
  add: (collection: Collection, item: RecordItem) => void
  update: (collection: Collection, item: RecordItem) => void
  remove: (collection: Collection, id: string) => void
  setSettings: (value: Data['settings']) => void
  reset: () => void
}

const StoreContext = createContext<Store | null>(null)
const KEY = 'fitzone-gms-v1'

export function StoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Data>(() => {
    try {
      const saved = localStorage.getItem(KEY)
      return saved ? { ...initialData, ...JSON.parse(saved) } : initialData
    } catch { return initialData }
  })
  useEffect(() => localStorage.setItem(KEY, JSON.stringify(data)), [data])

  const value = useMemo<Store>(() => ({
    ...data,
    add: (collection, item) => setData(d => ({ ...d, [collection]: [item, ...(d[collection] as RecordItem[])] })),
    update: (collection, item) => setData(d => ({ ...d, [collection]: (d[collection] as RecordItem[]).map(x => x.id === item.id ? item : x) })),
    remove: (collection, id) => setData(d => ({ ...d, [collection]: (d[collection] as RecordItem[]).filter(x => x.id !== id) })),
    setSettings: settings => setData(d => ({ ...d, settings })),
    reset: () => setData(initialData),
  }), [data])
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const value = useContext(StoreContext)
  if (!value) throw new Error('useStore must be used inside StoreProvider')
  return value
}
