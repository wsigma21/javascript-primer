// ユニークなIDを管理する変数
let todoIdx = 0;

export class TodoItemModel {
  /** @type {number} TodoアイテムのID */
  id;
  /** @type {string} Todoアイテムのタイトル */
  title;
  /** @type {string} Todoアイテムが完了済みならばtrue, そうでなければfalse */
  isCompleted;

  /**
   * @param {{ title: string, completed: boolean }}
   */
  constructor({ title, isCompleted }) {
    // idは連番となり、インスタンスごとに異なるものとする
    this.id = todoIdx++;
    this.title = title;
    this.isCompleted = isCompleted;
  }
}