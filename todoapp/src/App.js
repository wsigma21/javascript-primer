import { TodoListModel } from "./model/TodoListModel.js";
import { TodoItemModel } from "./model/TodoItemModel.js";
import { element, render } from "./view/html-util.js";

export class App {
  // TodoListModelの初期化
  #todoListModel = new TodoListModel();

  mount() {
    const formElement = document.querySelector('#js-form');
    const inputElement = document.querySelector('#js-form-input');
    const containerElement = document.querySelector('#js-todo-list');
    const todoItemCountElement = document.querySelector('#js-todo-count');
    // TodoListModelの状態が更新されたら表示を更新する
    this.#todoListModel.onChange(() => {
      // TodoリストをまとめるList要素
      const todoListElement = element`<ul></ul>`;
      // それぞれのTodoItem要素をTodoList Element以下へ追加する
      const todoItems = this.#todoListModel.getTodoItems();
      todoItems.forEach(item => {
        // 完了済みならchecked属性をつけ、未完了ならchecked属性を外す
        // input要素にはcheckboxクラスをつける
        const todoItemElement = item.isCompleted
          ? element`<li><input type="checkbox" class="checkbox" checked><s>${item.title}</s></li>`
          : element`<li><input type="checkbox" class="checkbox">${item.title}</li>`;
        todoListElement.appendChild(todoItemElement);
        // チェックボックスがトグルした時のイベントにリスナー関数を登録
        const inputeCheckboxElement = todoItemElement.querySelector(".checkbox");
        inputeCheckboxElement.addEventListener("change", () => {
          // 指定したTodoアイテムの完了状態を反転させる
          this.#todoListModel.updateTodo({
            id: item.id,
            isCompleted: !item.isCompleted
          });
        });
        todoListElement.appendChild(todoItemElement);
      });
      // コンテナ要素の中身をTodoリストをまとめるList要素で上書きする
      render(todoListElement, containerElement);
      // アイテム数の表示を更新
      todoItemCountElement.textContent = `Todoアイテム数:${this.#todoListModel.getTotalCount()}`;
    });
    // フォームを送信したら、新しいTodoItem Modelを追加する
    formElement.addEventListener("submit", (event) => {
      event.preventDefault();
      // 新しいTodoItemをTodoListへ追加する
      this.#todoListModel.addTodo(new TodoItemModel({
        title: inputElement.value,
        isCompleted: false
      }));
      inputElement.value = "";
    });
  }
}