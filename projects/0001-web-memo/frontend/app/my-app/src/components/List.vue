<template>
  <section class="memo-list" aria-labelledby="list-heading">
    <h2 id="list-heading">保存したメモ</h2>
    <!-- 固定のサンプルです。一覧表示・編集・削除の処理は後から追加します。 -->
    <ul>
      <li>
        <span class="memo-title">今日の学習メモ</span>
        <div class="memo-actions">
          <button type="button" aria-label="今日の学習メモを編集">編集</button>
          <button type="button" class="delete-button" aria-label="今日の学習メモを削除">削除</button>
        </div>
      </li>
      <li>
        <span class="memo-title">買い物リスト</span>
        <div class="memo-actions">
          <button type="button" aria-label="買い物リストを編集">編集</button>
          <button type="button" class="delete-button" aria-label="買い物リストを削除">削除</button>
        </div>
      </li>
      <li>
        <span class="memo-title">週末にやりたいこと</span>
        <div class="memo-actions">
          <button type="button" aria-label="週末にやりたいことを編集">編集</button>
          <button type="button" class="delete-button" aria-label="週末にやりたいことを削除">削除</button>
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
export default { name: 'MemoList' }
</script>
