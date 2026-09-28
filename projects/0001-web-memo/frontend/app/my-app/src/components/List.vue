<template>
  <section class="memo-list" aria-labelledby="list-heading">
    <h2 id="list-heading">保存したメモ</h2>
    <!-- 固定のサンプルです。一覧表示・編集・削除の処理は後から追加します。 -->
    <ul>
      <li v-for="memo in memos" :key="memo.id">
        <span class="memo-title">{{ memo.title }}</span>
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
.memo-list { padding: 24px; background: #fff; border: 1px solid #dce3e8; border-radius: 12px; }
h2 { margin: 0 0 16px; font-size: 20px; }
ul { list-style: none; margin: 0; padding: 0; }
li { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px; padding: 16px 0; border-bottom: 1px solid #e6ebef; }
li:last-child { border-bottom: 0; padding-bottom: 0; }
.memo-title { min-width: 0; overflow-wrap: anywhere; line-height: 1.6; }
.memo-actions { display: flex; flex-wrap: wrap; margin-left: auto; gap: 8px; }
button { padding: 8px 12px; border: 1px solid #b6c6d6; border-radius: 6px; color: #245d9b; background: #f5f9fd; }
button:hover { background: #e7eff8; }
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
