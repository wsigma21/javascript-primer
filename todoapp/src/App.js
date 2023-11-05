import { TodoListModel } from "./model/TodoListModel.js";
import { TodoItemModel } from "./model/TodoItemModel.js";
import { TodoListView } from "./view/TodoListView.js";
import { render } from "./view/html-util.js";

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
      const todoItems = this.#todoListModel.getTodoItems();
      const todoListView = new TodoListView();
      const todoListElement = todoListView.createElement(todoItems, {
        // Todoアイテムが更新イベントを発生した時に呼ばれるリスナー関数
        onUpdateTodo: ({id, isCompleted}) => {
            this.#todoListModel.updateTodo({ id, isCompleted });
        },
        // Todoアイテムが削除イベントを発生した時に呼ばれるリスナー関する
        onDeleteTodo: ({ id }) => {
          this.#todoListModel.deleteTodo({ id });
        }
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