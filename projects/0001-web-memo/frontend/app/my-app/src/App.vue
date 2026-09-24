<template>
  <Header/>
  <main>
    <Edit/>
    <List/>
  </main>
</template>

<script>
import Header from './components/Header.vue'
import Edit from './components/Edit.vue'
import List from './components/List.vue'

// memo: ページは一つだが、機能ごとに表示や処理の記述を分けたいため、componentsを表示部分で3つに分割
export default {
  name: 'App',
  components: {
    Header, // memo: アプリの情報を表示
    Edit, // memo:メモの編集・登録画面
    List // memo: 登録したメモの一覧表示、削除・選択画面
  }
}
</script>

<style>
* { box-sizing: border-box; }
html, body { height: 100%; overflow: hidden; }
body { margin: 0; background: #f4f6f8; }
#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans JP', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #243447;
  display: flex;
  flex-direction: column;
  height: 100vh;
  height: 100dvh;
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 16px;
}
#app > header { flex-shrink: 0; }
main {
  display: grid;
  grid-template-columns: minmax(0, 3fr) minmax(0, 2fr);
  flex: 1;
  min-height: 0;
  gap: 24px;
  margin-top: 24px;
}
main > section { min-width: 0; min-height: 0; overflow: auto; }
@media (max-width: 600px) {
  #app { padding: 12px 8px; }
  main { gap: 8px; margin-top: 12px; }
  main > section { padding: 12px; }
}
input, textarea, button { font: inherit; }
button { cursor: pointer; }
button:focus-visible, input:focus-visible, textarea:focus-visible {
  outline: 3px solid #2878bd;
  outline-offset: 3px;
}
</style>
