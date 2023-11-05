import { TodoListModel } from "./model/TodoListModel.js";
import { TodoItemModel } from "./model/TodoItemModel.js";
import { TodoListView } from "./view/TodoListView.js";
import { render } from "./view/html-util.js";

export class App {
  #todoListView = new TodoListView();
  #todoListModel = new TodoListModel([]);

  formElement;
  formInputElement;
  todoCountElement;
  todoListContainerElement;

  // 紐付けするHTML要素を引数として受け取る
  constructor({ formElement, formInputElement, todoCountElement, todoListContainerElement }) {
    this.formElement = formElement;
    this.formInputElement = formInputElement;
    this.todoCountElement = todoCountElement;
    this.todoListContainerElement = todoListContainerElement;
  }

  /**
   * Todoを追加するときに呼ばれるリスナー関数
   * リスナー関数をプライベートフィールド + Arrow Functionで定義することで、`this`は必ずクラスのインスタンスを示す
   * @param {string} title
   */
  #handleAdd = (title) => {
    this.#todoListModel.addTodo(new TodoItemModel({ title, isCompleted: false}));
  }
  
  /**
   * Todoの状態を更新したときに呼ばれるリスナー関数
   * @param {{ id:number, isCompleted: boolean }}
   */
  #handleUpdate = ({ id, isComplated }) => {
    this.#todoListModel.updateTodo({ id, isComplated });
  }

  /**
   * Todoを削除したときに呼ばれるリスナー関数
   * @param {{ id: number }}
   */
  #handleDelete = ({ id }) => {
    this.#todoListModel.deleteTodo({ id });
  }

  /**
   * フォームを送信時に呼ばれるリスナー関数
   * @param {Event} event
   */
  #handleSubmit = (event) => {
    event.preventDefault();
    const inputElement = this.formInputElement;
    // 新しいTodoItemをTodoListへ追加する
    this.#handleAdd(inputElement.value);
    inputElement.value = "";
  }

  /**
   * TodoListViewが変更したときに呼ばれるリスナー関数
   */
  #handleChange = () => {
    const todoCountElemnet = this.todoCountElement;
    const todoListContainerElement = this.todoListContainerElement;
    const todoItems = this.#todoListModel.getTodoItems();
    const todoListElement = this.#todoListView.createElement(todoItems, {
      // Appに定義したリスナー関数を呼び出す
      onUpdateTodo: ({id, isCompleted}) => {
          this.#handleUpdate({id, isComplated});
      },
      onDeleteTodo: ({ id }) => {
        this.#handleDelete({ id });
      }
    });
    // コンテナ要素の中身をTodoリストをまとめるList要素で上書きする
    render(todoListElement, todoListContainerElement);
    // アイテム数の表示を更新
    todoCountElemnet.textContent = `Todoアイテム数:${this.#todoListModel.getTotalCount()}`;
  }

  /**
   * アプリとDOMの紐付けを登録する関数
   */
  mount() {
    // TodoListModelの状態が更新されたら表示を更新する
    this.#todoListModel.onChange(this.#handleChange);
    // フォームを送信したら、新しいTodoItem Modelを追加する
    this.formElement.addEventListener("submit", this.#handleSubmit);
  }

  /**
   * アプリとDOMの紐付けを解除する関数
   */
  unmount() {
    this.#todoListModel.offChange(this.#handleChange);
    this.formElement.removeEventListener("submit", this.#handleSubmit);
  }
}