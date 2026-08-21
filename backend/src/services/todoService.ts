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

export async function getTodos(userId: string) {
  return TodoModel.find({ user: userId }).sort({ createdAt: -1 });
}

export async function getTodoById(todoId: string, userId: string) {
  return TodoModel.findOne({ _id: todoId, user: userId });
}

export async function createTodo(userId: string, todoData: CreateTodoInput) {
  return TodoModel.create({ ...todoData, user: userId });
}

export async function updateTodo( todoId: string, userId: string, todoData: UpdateTodoInput) {
  return TodoModel.findOneAndUpdate({ _id: todoId, user: userId }, todoData, {
    new: true,
    runValidators: true,
  });
}

export async function deleteTodo(todoId: string, userId: string) {
  return TodoModel.findOneAndDelete({ _id: todoId, user: userId });
}
