<template>
  <section class="memo-editor" aria-labelledby="editor-heading">
    <h2 id="editor-heading">メモの編集</h2>
    <!-- 入力と保存の処理は、Vueの学習で追加します。 -->
    <div class="field">
      <input v-model="title" aria-label="タイトル" placeholder="例：今日の学習メモ">
    </div>
    <div class="field">
      <label for="memo-body">本文</label>
      <textarea id="memo-body" rows="8" placeholder="メモしたいことを入力してください"></textarea>
    </div>
    <div class="editor-actions">
      <button type="button" class="save-button">メモを保存</button>
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
export default { name: 'MemoEditor' }
</script>
