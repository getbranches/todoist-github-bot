export type ID = string | number;

export interface AddTodo {
  externalId: ID;
  title: string;
}

export interface Todo {
  id: string;
  externalId: ID;
  title: string;
}

export interface SynchronizeFunctions {
  addTodo(issue: AddTodo): void;
  completeTodo(issueId: ID): void;
  removeTodo(issueId: ID): void;
  updateTodo(issue: Todo): void;
}
