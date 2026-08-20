import type { CreateTodoData, Todo, UpdateTodoData } from "../types/todo";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001/api";

type ApiErrorResponse = {
  message?: string;
  errors?: string[];
};

async function apiRequest<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const data = (await response.json()) as T | ApiErrorResponse;

  if (!response.ok) {
    const errorData = data as ApiErrorResponse;

    const errorMessage =
      errorData.errors?.join(", ") ?? errorData.message ?? "The request failed";

    throw new Error(errorMessage);
  }

  return data as T;
}

export async function getTodos(): Promise<Todo[]> {
  return apiRequest<Todo[]>("/todos");
}

export async function getTodoById(todoId: string): Promise<Todo> {
  return apiRequest<Todo>(`/todos/${todoId}`);
}

export async function createTodo(todoData: CreateTodoData): Promise<Todo> {
  return apiRequest<Todo>("/todos", {
    method: "POST",
    body: JSON.stringify(todoData),
  });
}

export async function updateTodo(
  todoId: string,
  todoData: UpdateTodoData,
): Promise<Todo> {
  return apiRequest<Todo>(`/todos/${todoId}`, {
    method: "PUT",
    body: JSON.stringify(todoData),
  });
}

export async function deleteTodo(todoId: string): Promise<void> {
  return apiRequest<void>(`/todos/${todoId}`, {
    method: "DELETE",
  });
}
