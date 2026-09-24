# Vueの関数の使い方 — メモアプリで学ぶ

この資料は、現在の `App.vue`、`Edit.vue`、`List.vue` に処理を追加するための学習ガイドです。アプリ本体への機能実装は行っていません。コードは学習用の例で、既存ファイルの該当箇所に組み込んで使います。CSSはそのまま利用できます。

今回の保存先は、表示中のページのメモリです。HTTP通信やDBは使わず、再読み込みするとメモは消えます。

## 1. Vueの関数とは

Vue専用の別の言語ではなく、JavaScriptの関数をVueの画面と結び付けて使います。現在のコードの `export default` に合わせ、この資料では **Options API** の書き方に統一します。「API」はここではVueの記述方式を指し、サーバーとの通信の意味ではありません。

- `data()`：画面で使う状態を返す関数。
- `methods`：クリックなどに応じて実行する関数を定義する場所。
- `this`：そのコンポーネントのデータやメソッドにアクセスするためのもの。

次は単独で試せる小さなコンポーネントです。

```vue
<template>
  <input v-model="title" aria-label="タイトル">
  <button type="button" @click="showTitle">確認</button>
  <p>{{ message }}</p>
</template>

<script>
export default {
  name: 'FunctionPractice',
  data() {
    return { title: '', message: '' }
  },
  methods: {
    showTitle() {
      this.message = `入力したタイトル：${this.title}`
    }
  }
}
</script>
```

`v-model` が入力と `title` を連動させ、`@click` が関数を呼び出します。`message` を変更すると、その値を使う画面表示もVueが更新します。自分でDOMを書き換える必要はありません。

`methods` の関数を `showTitle: () => { ... }` と書くと、`this` がコンポーネントを指さなくなるため、上のようなメソッド記法を使います。

参考：[状態とmethods（Vue公式）](https://vuejs.org/api/options-state.html)

## 2. ボタンから関数を呼ぶ

```vue
<!-- 引数なし -->
<button type="button" @click="saveMemo">保存</button>

<!-- 対象のIDを引数として渡す。memoはv-for内の各メモ -->
<button type="button" @click="deleteMemo(memo.id)">削除</button>
```

`@click` は `v-on:click` の省略形です。`@click="saveMemo()"` と書くこともでき、どちらもクリック時に実行します。`deleteMemo(id)` の `id` は、呼び出し元から受け取る引数です。

フォームの送信を扱う場合は `@submit.prevent="saveMemo"` と書くと、通常のページ遷移を止めて関数を実行できます。

参考：[イベントハンドリング（Vue公式）](https://vuejs.org/guide/essentials/event-handling.html)

## 3. このアプリでの役割分担

| ファイル | 役割 |
|---|---|
| `App.vue` | メモ一覧、選択中のID、入力中の値を保持し、保存・選択・削除を行う |
| `Edit.vue` | 入力欄を表示し、入力内容の変更や保存の操作を親へ伝える |
| `List.vue` | 一覧を表示し、編集・削除するメモのIDを親へ伝える |
| `Header.vue` | アプリ名などを表示する |

親から子へ値を渡す仕組みが **props**、子から親へ操作を知らせる仕組みが **emit** です。兄弟である `Edit.vue` と `List.vue` を直接操作し合う必要はありません。

```text
App.vue ── props（入力値）──→ Edit.vue
App.vue ←─ emit（入力・保存）─ Edit.vue
App.vue ── props（メモ配列）─→ List.vue
App.vue ←─ emit（編集・削除）─ List.vue
```

参考：[Props（Vue公式）](https://vuejs.org/guide/components/props)、[コンポーネントのイベント（Vue公式）](https://vuejs.org/guide/components/events.html)

## 4. App.vueに用意する状態と関数

以下の `data` と `methods` は、既存の `export default` 内の `components` と同じ階層に追加する例です。既存のimportやコンポーネント登録は残し、項目の間のカンマを忘れないでください。

```js
data() {
  return {
    memos: [],
    selectedId: null,
    nextId: 1,
    draftTitle: '',
    draftBody: '',
    errors: { title: '', body: '' }
  }
},
methods: {
  saveMemo() {
    // trim()は空白だけの入力を判定するために使用する。
    this.errors = {
      title: this.draftTitle.trim() ? '' : 'タイトルを入力してください',
      body: this.draftBody.trim() ? '' : '本文を入力してください'
    }
    if (this.errors.title || this.errors.body) return

    if (this.selectedId === null) {
      const id = this.nextId++
      this.memos.push({
        id,
        title: this.draftTitle,
        body: this.draftBody
      })
      this.selectedId = id
    } else {
      const memo = this.memos.find(item => item.id === this.selectedId)
      if (!memo) return
      memo.title = this.draftTitle
      memo.body = this.draftBody
    }
  },
  editMemo(id) {
    // 同じメモを再選択しても、入力途中の内容とエラーを保持する。
    if (id === this.selectedId) return
    const memo = this.memos.find(item => item.id === id)
    if (!memo) return

    this.selectedId = id
    this.draftTitle = memo.title
    this.draftBody = memo.body
    this.errors = { title: '', body: '' }
  },
  deleteMemo(id) {
    this.memos = this.memos.filter(item => item.id !== id)
    if (this.selectedId === id) this.startNewMemo()
  },
  startNewMemo() {
    this.selectedId = null
    this.draftTitle = ''
    this.draftBody = ''
    this.errors = { title: '', body: '' }
  }
}
```

| 関数 | 何をするか |
|---|---|
| `saveMemo()` | 未選択なら新規追加、選択中なら同じIDのメモを更新する |
| `editMemo(id)` | 保存済みの文字列を入力用の状態へコピーする |
| `deleteMemo(id)` | 対象だけを削除し、選択中なら編集欄も初期化する |
| `startNewMemo()` | 未保存の入力を破棄し、新規作成状態に戻す |

`push` は配列への追加、`find` は条件に合う最初の要素の取得、`filter` は条件に合う要素だけの新しい配列の作成です。これらはVue専用ではなくJavaScriptの機能です。

`find(item => ...)` の矢印関数は配列操作のコールバックなので問題ありません。`methods` 自体を矢印関数で定義するケースとは異なります。

保存済みメモと編集中の値を分けることで、入力中に保存済みデータが変わることを防げます。この例のタイトルと本文は文字列なので、代入するだけで分離できます。`draft = memo` のようにオブジェクトをそのまま共有する場合は同じ仕組みにはなりません。

## 5. 親と子をつなぐ

### App.vue：値を渡し、イベントを受け取る

既存の `<main>` 内の配置に、次の属性を追加します。

```vue
<Edit
  :title="draftTitle"
  :body="draftBody"
  :errors="errors"
  @update:title="draftTitle = $event"
  @update:body="draftBody = $event"
  @save="saveMemo"
  @new-memo="startNewMemo"
/>
<List :memos="memos" @edit="editMemo" @delete="deleteMemo" />
```

`:title` は `v-bind:title` の省略形で、変数の値を渡します。`title="draftTitle"` とすると変数ではなく文字列そのものになります。`$event` は子がイベントと一緒に渡した値です。

### Edit.vue：入力や保存を親に知らせる

現在の `<script>` を次のように拡張します。

```vue
<script>
export default {
  name: 'MemoEditor',
  props: {
    title: { type: String, default: '' },
    body: { type: String, default: '' },
    errors: { type: Object, required: true }
  },
  emits: ['update:title', 'update:body', 'save', 'new-memo']
}
</script>
```

既存の入力欄・ボタンに以下の属性を組み込み、エラー表示と新規作成ボタンを追加します。既存のラベルやクラスは残します。

```vue
<input id="memo-title" :value="title"
  @input="$emit('update:title', $event.target.value)">
<p v-if="errors.title" role="alert">{{ errors.title }}</p>

<textarea id="memo-body" :value="body"
  @input="$emit('update:body', $event.target.value)"></textarea>
<p v-if="errors.body" role="alert">{{ errors.body }}</p>

<button type="button" @click="$emit('save')">メモを保存</button>
<button type="button" @click="$emit('new-memo')">新規作成</button>
```

子はpropsを書き換えず、変更を親に依頼します。ここでの入力イベントの `$event` はブラウザのイベントなので、`$event.target.value` で入力文字列を取り出します。一方、親が受け取る `update:title` の `$event` は、子が送った文字列です。

最初の練習のような自分自身の `data` には `v-model` を使えますが、子で `v-model="title"` としてpropsを直接変更することは避けます。この例では値とイベントを明示して、データの流れを見えるようにしています。

### List.vue：対象のIDを親に渡す

現在の `<script>` を次のように拡張します。

```vue
<script>
export default {
  name: 'MemoList',
  props: {
    memos: { type: Array, default: () => [] }
  },
  emits: ['edit', 'delete']
}
</script>
```

固定の3件のリストを次のように置き換えます。既存の見出しやsectionは残します。

```vue
<p v-if="memos.length === 0">メモはまだありません。</p>
<ul>
  <li v-for="memo in memos" :key="memo.id">
    <span class="memo-title">{{ memo.title }}</span>
    <div class="memo-actions">
      <button type="button" @click="$emit('edit', memo.id)"
        :aria-label="memo.title + 'を編集'">編集</button>
      <button type="button" class="delete-button"
        @click="$emit('delete', memo.id)"
        :aria-label="memo.title + 'を削除'">削除</button>
    </div>
  </li>
</ul>
```

`v-for` は配列から表示を繰り返します。`:key` に一意なIDを指定すると、Vueが各項目を識別できます。タイトルは重複する可能性があるのでIDの代わりにはしません。

保存ボタンの場合の流れは「子のクリック → saveイベント → 親のsaveMemo → memosの変更 → 一覧の更新」です。保存後に一覧を取得する関数を別途呼ぶ必要はありません。

## 6. 学習・確認の順序

1. 小さな練習用コンポーネントで `data`、`methods`、`@click` を理解する。
2. 親の入力状態とEditの入力欄をつなぎ、入力が親に伝わることを確認する。
3. 保存して一覧に1件増えることを確認する。
4. 編集して保存し、件数を増やさず内容が更新されることを確認する。
5. 同じタイトルのメモを2件作り、IDで編集・削除できることを確認する。
6. 新規作成、空欄のエラー、選択中のメモの削除を確認する。

特に、次の動作を自分の言葉で説明できると理解が深まります。

- 入力しただけでは一覧のタイトルが変わらない理由。
- 編集したメモを保存し直しても、件数が増えない理由。
- 別のメモを選ぶと未保存の入力は破棄され、同じメモを選ぶと保持される理由。
- 非選択のメモを削除しても編集中の入力は残る理由。
- 再読み込みすると一覧が空になる理由。

## 7. よくあるつまずき

| 症状 | 確認すること |
|---|---|
| 関数が見つからない | `methods` の中に定義したか、名前が一致するか |
| `this` で値を取得できない | メソッドを矢印関数にしていないか |
| 子の保存ボタンが反応しない | 子の `$emit('save')` と親の `@save` が対応しているか |
| 入力するだけで保存済み内容が変わる | 入力用と保存済みのオブジェクトを共有していないか |
| 同じタイトルの別メモを消してしまう | タイトルや配列の位置ではなくIDで対象を探しているか |
| 再読み込みで消える | 今回は永続保存しない仕様なので正常 |

この資料の例を組み込むときは、`<script>` や `export default` を既存のものと二重に追加せず、一つにまとめてください。
