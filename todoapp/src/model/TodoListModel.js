import { EventEmitter } from "../EventEmitter.js";

export class TodoListModel extends EventEmitter {
  #items;
  /**
   * @param { TodoItemModel[] } [items] 初期アイテム一覧（デフォルトはからの配列）
   */
  constructor(items = []) {
    super();
    this.#items = items;
  }

  /**
   * TodoItemの合計個数を返す
   * @returns {number}
   */
  getTotalCount() {
    return this.#items.length;
  }

  /**
   * 表示できるTodoItemの配列を返す
   * @returns {TodoItemModel[]}
   */
  getTodoItems() {
    return this.#items;
  }

  /**
   * TodoListの状態が更新された時に呼び出されるリスナー関数を登録する
   * @param {Function} listener
   */
  onChange(listener) {
    this.addEventListener("change", listener);
  }

  /**
   * 状態が変更された時に呼ぶ。登録済みのリスナー関数を呼び出す
   */
  emitChange() {
    this.emit("change");
  }

  /**
   * TodoItemを追加する
   * @param { TodoItemModel } todoItem
   */
  addTodo(todoItem) {
    this.#items.push(todoItem);
    this.emitChange();
  }

  /**
   * 指定したidのTodoItemのisCompletedを更新する
   * @param {{ id:number, isCompleted: boolean }}
   */
  updateTodo({ id, isCompleted }) {
    // idが一致するTodo Itemを探し、あったら完了状態の値を更新
    const todoItem = this.#items.find(todo => todo.id === id);
    if (!todoItem) {
      return
    }
    todoItem.isCompleted = isCompleted;
    this.emitChange();
  }

  deleteTodo({ id }) {
    // idに一致しないTodoItemだけを残すことで、idに一致するTodoItemを削除する
    this.#items = this.#items.filter(todo =>{
      return todo.id != id;
    });
    this.emitChange();
  }
}