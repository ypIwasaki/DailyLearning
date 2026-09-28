import Dexie, { type EntityTable } from 'dexie'

export interface Memo {
  id?: number
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
}

const db = new Dexie('MemoDatabase') as Dexie & {
  memos: EntityTable<Memo, 'id'>
}

db.version(1).stores({
  memos: '++id, title, createdAt, updatedAt'
})

export { db }