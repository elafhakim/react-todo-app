export type TodoStatus = "open" | "completed";

export type Todo = {
  _id: string;
  title: string;
  description?: string;
  deadline: string;
  status: TodoStatus;
  createdAt: string;
  updatedAt: string;
};

export type CreateTodoData = {
  title: string;
  description?: string;
  deadline: string;
  status?: TodoStatus;
};

export type UpdateTodoData = {
  title?: string;
  description?: string;
  deadline?: string;
  status?: TodoStatus;
};
