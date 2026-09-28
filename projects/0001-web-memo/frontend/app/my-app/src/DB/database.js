import Dexie from 'dexie'

const db = new Dexie('MemoDatabase')

db.version(1).stores({
  memos: '++id, title, createdAt, updatedAt'
})

export { db }
