<template>
  <section class="memo-list" aria-labelledby="list-heading">
    <div class="list-heading">
      <h2 id="list-heading">保存したメモ</h2>
      <span class="memo-count">{{ memos.length }}件</span>
    </div>
    <div v-if="memos.length === 0" class="empty-state">
      <p>メモはまだありません</p>
      <small>タイトルと本文を入力して、最初のメモを保存しましょう。</small>
    </div>
    <ul tabindex="0" aria-label="保存したメモ一覧">
      <li v-for="memo in memos" :key="memo.id">
        <div class="memo-summary">
          <span class="memo-title">{{ memo.title }}</span>
          <p class="memo-preview">{{ memo.content }}</p>
        </div>
        <div class="memo-actions">
          <button
            type="button"
            :aria-label="memo.title + 'を編集'"
            @click="$emit('edit', memo.id)"
          >
            編集
          </button>
          <button
            type="button"
            class="delete-button"
            :aria-label="memo.title + 'を削除'"
            @click="confirmDelete(memo)"
            >
              削除
          </button>
        </div>
      </li>
    </ul>
  </section>
</template>
<style scoped>
.memo-list { display: flex; flex-direction: column; overflow: hidden; padding: 28px; background: #fff; border: 1px solid #dfe5dc; border-radius: 18px; box-shadow: 0 8px 28px #20382908; }
.list-heading { display: flex; flex-shrink: 0; justify-content: space-between; align-items: center; gap: 12px; margin-bottom: 20px; }
.list-heading h2 { margin: 0; }
.memo-count { color: #586778; font-size: 13px; background: #f0f4ee; padding: 5px 10px; border-radius: 20px; }
.empty-state { min-height: 0; overflow-y: auto; padding: 32px 12px; text-align: center; color: #586778; }
.empty-state p { font-weight: 600; }
.empty-state small { line-height: 1.8; display: block; }
.memo-summary { flex: 1 1 100%; min-width: 0; }
.memo-title { font-weight: 600; }
.memo-preview { margin: 8px 0 0; color: #64736a; font-size: 13px; line-height: 1.7; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow: hidden; overflow-wrap: anywhere; white-space: pre-wrap; }
h2 { margin: 0 0 16px; font-size: 20px; }
ul { flex: 1; min-height: 0; overflow-y: auto; overscroll-behavior: contain; scrollbar-gutter: stable; list-style: none; margin: 0; padding: 4px; }
ul:focus-visible { outline: 2px solid #356348; outline-offset: -2px; border-radius: 6px; }
li { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px; padding: 16px 0; border-bottom: 1px solid #e6ebef; }
li:last-child { border-bottom: 0; padding-bottom: 0; }
.memo-title { min-width: 0; overflow-wrap: anywhere; line-height: 1.6; }
.memo-actions { display: flex; flex-wrap: wrap; margin-left: auto; gap: 8px; }
button { padding: 8px 14px; border: 1px solid #cbd6ca; border-radius: 8px; color: #356348; background: #f3f7f1; font-size: 13px; }
button:hover { background: #e6eee3; }
.delete-button { color: #a83232; background: #fff; border-color: #e0bbbb; }
.delete-button:hover { background: #fff0f0; }
@media (max-width: 380px) {
  li { flex-wrap: wrap; }
  .memo-actions { margin-left: auto; }
}
</style>
<script>
import { db } from '../DB/database.js'
export default {
  name: 'MemoList',
  emits: ['edit'],
  data() {
    return {
      memos: []
    }
  },
  async mounted() {
    await this.loadMemos()
  },
  methods: {
    async loadMemos() {
      try {
        this.memos = await db.memos.toArray()
        console.log(this.memos)
      } catch (error) {
        console.error('メモの取得に失敗しました', error)
      }
    },
    async confirmDelete(memo) {
      const confirmed = window.confirm(
        '「${memo.title}」を削除しますか？'
      )

      if (!confirmed) return

      try {
        await db.memos.delete(memo.id)
        await this.loadMemos()
      } catch (error) {
        console.error('メモの削除に失敗しました',error)
        alert('メモを削除できませんでした')
      }
    }
  }
}
</script>
