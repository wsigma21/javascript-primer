import { element } from "./html-util.js"

export class TodoItemView {
  /**
   * `todoItem`に対するTodoアイテムのHTML要素を作成して返す
   * @param { todoItemModel } todoItem
   * @param { funciton({id:number, isCompleted:boolean})} onUpdateTodo チェックボックスの更新イベントリスナー
   * @param { function({id:number})} onDeleteTodo 削除ボタンのクリックイベントリスナー
   * @returns {Element}
   */
  createElement(todoItem, { onUpdateTodo, onDeleteTodo }) {
    const todoItemElement = todoItem.isCompleted
      ? element`<li><input type="checkbox" class="checkbox" checked>
          <s>${todoItem.title}</s>
          <button class="delete">×</button>
        </li>`
      : element`<li><input type="checkbox" class="checkbox">
          ${todoItem.title}
          <button class="delete">×</button>
        </li>`;
    // チェックボックスがトグルした時のイベントにリスナー関数を登録
    const inputeCheckboxElement = todoItemElement.querySelector(".checkbox");
    inputeCheckboxElement.addEventListener("change", () => {
      // 指定したTodoアイテムの完了状態を反転させる
      onUpdateTodo({
        id: todoItem.id,
        isCompleted: !todoItem.isCompleted
      });
    });
    // 削除ボタンがクリックされたときにTodoListItemからアイテムを削除する
    const deleteButtonElement = todoItemElement.querySelector(".delete");
    deleteButtonElement.addEventListener("click", () => {
      onDeleteTodo({
        id: todoItem.id
      });
    });
    // 作成したTodoアイテムのHTML要素を返す
    return todoItemElement;
  }
}