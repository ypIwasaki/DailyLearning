<template>
  <section class="memo-editor" aria-labelledby="editor-heading">
    <div class="section-heading">
      <h2 id="editor-heading">{{ selectedMemoId === null ? '新しいメモ' : 'メモの編集' }}</h2>
      <span class="mode-badge">{{ selectedMemoId === null ? '新規作成' : '編集中' }}</span>
    </div>
    <div class="field">
      <label for="memo-title">タイトル</label>
      <input
        id="memo-title"
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
          class="new-button"
          @click="startNewMemo"
          >
            新規作成
        </button>
    </div>
  </section>
</template>
<style scoped>
.memo-editor { padding: 32px; background: #fff; border: 1px solid #dfe5dc; border-radius: 18px; box-shadow: 0 8px 28px #20382908; }
.section-heading { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 28px; }
.section-heading h2 { margin: 0; }
.mode-badge { flex-shrink: 0; padding: 5px 10px; border-radius: 20px; background: #eaf2eb; color: #356348; font-size: 12px; }
h2 { margin: 0 0 24px; font-size: 20px; }
.field { display: grid; gap: 8px; margin-bottom: 20px; }
label { font-weight: 600; font-size: 14px; }
input, textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #cbd6ca;
  border-radius: 8px;
  color: #243447;
  background: #fff;
}
input::placeholder, textarea::placeholder { color: #64748b; }
textarea { resize: vertical; min-height: 300px; line-height: 1.8; }
.editor-actions { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 12px; padding-top: 8px; }
.save-button, .new-button { padding: 12px 20px; border-radius: 8px; font-weight: 600; }
.save-button { border: 1px solid #356348; background: #356348; color: #fff; }
.save-button:hover { background: #284d37; }
.new-button { order: -1; border: 1px solid #cbd6ca; background: #fff; color: #356348; }
.new-button:hover { background: #f0f5ef; }
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
