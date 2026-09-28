<template>
  <header class="app-header">
    <div>
      <h1>Webメモ</h1>
      <p>思いついたことを、ひとつずつ。</p>
    </div>
    <div class="app-info">
      <span>あなたの小さなノート</span>
    </div>
  </header>
</template>
<style scoped>
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  padding-bottom: 24px;
  border-bottom: 1px solid #dce3e8;
}
h1 { margin: 0; font-size: 30px; letter-spacing: .04em; color: #284d37; }
p { margin: 8px 0 0; color: #586778; }
.app-info { display: grid; gap: 6px; color: #586778; font-size: 14px; }
</style>
<script>
export default { name: 'MemoHeader' }
</script>
