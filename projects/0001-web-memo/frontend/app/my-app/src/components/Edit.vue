<template>
  <section class="memo-editor" aria-labelledby="editor-heading">
    <h2 id="editor-heading">メモの編集</h2>
    <!-- 入力と保存の処理は、Vueの学習で追加します。 -->
    <div class="field">
      <input
        v-model="title"
        aria-label="タイトル"
        placeholder="例：今日の学習メモ">
    </div>
    <div class="field">
      <label for="memo-body">本文</label>
      <textarea
        id="memo-body"
        v-model="content"
        rows="8"
        placeholder="メモしたいことを入力してください"
      ></textarea>
    </div>
    <div class="editor-actions">
      <button
        type="button"
        class="save-button"
        @click="saveMemo"
        >
          メモを保存
        </button>
        <button
          type="button"
          class="save-button"
          @click="startNewMemo"
          >
            新規作成
        </button>
    </div>
  </section>
</template>
<style scoped>
.memo-editor { padding: 24px; background: #fff; border: 1px solid #dce3e8; border-radius: 12px; }
h2 { margin: 0 0 24px; font-size: 20px; }
.field { display: grid; gap: 8px; margin-bottom: 20px; }
label { font-weight: 600; font-size: 14px; }
input, textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #aab8c5;
  border-radius: 6px;
  color: #243447;
  background: #fff;
}
input::placeholder, textarea::placeholder { color: #64748b; }
textarea { resize: vertical; min-height: 160px; line-height: 1.7; }
.editor-actions { display: flex; justify-content: flex-end; }
.save-button { padding: 11px 20px; border: 1px solid #245d9b; border-radius: 6px; background: #245d9b; color: #fff; }
.save-button:hover { background: #1c4b7e; }
</style>
<script>
export default {
  name: 'MemoEditor',
  emits: ['saved'],
  data() {
    return {
      title: '',
      content: '',
      selectedMemoId: null
    }
  },
  methods: {
    async saveMemo() {
      if (!this.title.trim() || !this.content.trim()) {
        alert('タイトルと本文を入力してください')
        return
      }

      const now = new Date()
      
      try {
        if (this.selectedMemoId === null) {
          this.selectedMemoId = await db.memos.add({
            title: this.title,
            content: this.content,
            createdAt: now,
            updatedAt: now
          })
        } else {
          const updateCount = await db.memos.update(
            this.selectedMemoId,
            {
              title: this.title,
              content: this.content,
              updatedAt: now
            }
          )

          if (updateCount === 0) {
            alert('更新するメモが見つかりません')
            return
          }
        }

        this.$emit('saved')
        const savedMemo = await db.memos.get(this.selectedMemoId)
        console.log('DBから読み直したメモ:', savedMemo)
        alert('メモを保存しました')
      } catch (error) {
        console.error('メモの保存に失敗しました', error)
        alert('メモを保存できませんでした')
      }
    },
    async loadMemo(id) {
      if (this.selectedMemoId === id) return

      try {
        const memo = await db.memos.get(id)

        if (!memo) {
          alert('メモが見つかりません')
          return
        }

        this.selectedMemoId = memo.id
        this.title = memo.title
        this.content = memo.content
      }catch (error) {
        console.error('メモの取得に失敗しました', error)
        alert('メモを読み込めませんでした')
      }
    },
    startNewMemo() {
      this.selectedMemoId = null
      this.title = ''
      this.content = ''
    }
  }
}
import { db } from '../DB/database.js'
</script>
