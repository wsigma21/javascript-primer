import { element, render } from "./view/html-util.js";

export class App {
  constructor() {
    console.log("App initialized");
  }

  mount() {
    const formElement = document.querySelector('#js-form');
    const inputElement = document.querySelector('#js-form-input');
    const containerElement = document.querySelector('#js-todo-list');
    const todoItemCountElement = document.querySelector('#js-todo-count');
    // TodoリストをまとめるList要素
    const todoListElement = element`<ul></ul>`;
    console.log("todoListElement=", todoListElement);
    // Todoアイテム数
    let todoItemCount = 0;
    formElement.addEventListener("submit", (event) => {
      // submitイベントの本来の動作を止める
      event.preventDefault();
      
      // 入力されたアイテムをDom Nodeに変換してからリストに追加
      const todoItemElement = element`<li>${inputElement.value}</li>`;
      todoListElement.appendChild(todoItemElement);
      console.log("todoListElement=",todoListElement);
      render(todoListElement, containerElement);

      // アイテム数を増やす
      todoItemCount++;
      todoItemCountElement.textContent = `Todoアイテム数:${todoItemCount}`;
      inputElement.value = "";
    });
  }
}