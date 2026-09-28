<template>
  <Header/>
  <main>
    <Edit ref="memoEditor" @saved="refreshMemos"/>
    <List ref="memoList" @edit="editMemo"/>
  </main>
</template>

<script>
import Header from './components/Header.vue'
import Edit from './components/Edit.vue'
import List from './components/List.vue'

// memo: ページは一つだが、機能ごとに表示や処理の記述を分けたいため、componentsを表示部分で3つに分割
export default {
  name: 'App',
  methods: {
    async refreshMemos() {
      await this.$refs.memoList.loadMemos()
    },
    async editMemo(id) {
      await this.$refs.memoEditor.loadMemo(id)
    }
  },
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
body { margin: 0; background: #f3f5f0; }
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
  padding: 40px 24px;
}
#app > header { flex-shrink: 0; }
main {
  display: grid;
  grid-template-columns: minmax(0, 3fr) minmax(280px, 2fr);
  grid-template-rows: minmax(0, 1fr);
  align-items: stretch;
  flex: 1;
  min-height: 0;
  gap: 24px;
  margin-top: 24px;
}
main > section { min-width: 0; min-height: 0; }
main > .memo-editor { overflow-y: auto; overscroll-behavior: contain; }
@media (max-width: 760px) {
  #app { padding: 24px 16px; }
  main { grid-template-columns: 1fr; grid-template-rows: minmax(0, 1fr) minmax(0, 1fr); gap: 20px; margin-top: 24px; }
  main > section { padding: 20px; }
}
input, textarea, button { font: inherit; }
button { cursor: pointer; }
button { transition: background-color .15s ease, border-color .15s ease; }
button:focus-visible, input:focus-visible, textarea:focus-visible {
  outline: 3px solid #2878bd;
  outline-offset: 3px;
}
</style>
