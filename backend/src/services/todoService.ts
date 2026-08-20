import TodoModel, { type TodoStatus } from "../models/Todo.js";

export type CreateTodoInput = {
  title: string;
  description?: string;
  deadline: Date;
  status?: TodoStatus;
};

export type UpdateTodoInput = {
  title?: string;
  description?: string;
  deadline?: Date;
  status?: TodoStatus;
};

export async function getTodos() {
  return TodoModel.find().sort({ createdAt: -1 });
}

export async function getTodoById(todoId: string) {
  return TodoModel.findById(todoId);
}

export async function createTodo(todoData: CreateTodoInput) {
  return TodoModel.create(todoData);
}

export async function updateTodo(todoId: string, todoData: UpdateTodoInput) {
  return TodoModel.findByIdAndUpdate(todoId, todoData, {
    new: true,
    runValidators: true,
  });
}

export async function deleteTodo(todoId: string) {
  return TodoModel.findByIdAndDelete(todoId);
}
