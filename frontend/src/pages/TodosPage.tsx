import { useEffect, useState } from "react";
import TodoForm from "../components/TodoForm";
import TodoList from "../components/TodoList";
import { getTodos } from "../api/todoApi";
import type { Todo } from "../types/todo";

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    async function loadTodos() {
      try {
        setIsLoading(true);
        setLoadError(null);

        const loadedTodos = await getTodos();

        if (!isCancelled) {
          setTodos(loadedTodos);
        }
      } catch (error) {
        if (!isCancelled) {
          setLoadError(
            error instanceof Error
              ? error.message
              : "The Todos could not be loaded.",
          );
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadTodos();

    return () => {
      isCancelled = true;
    };
  }, []);

  function handleTodoCreated(todo: Todo) {
    setTodos((currentTodos) => [todo, ...currentTodos]);

    setSuccessMessage(`Todo "${todo.title}" was created successfully.`);
  }

  return (
    <main className="min-h-screen px-4 py-10">
      <section className="mx-auto w-full max-w-3xl">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-slate-900">Todo App</h1>

          <p className="mt-3 text-slate-600">
            Manage your tasks and deadlines.
          </p>
        </header>

        {successMessage && (
          <p
            role="status"
            className="mb-5 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700"
          >
            {successMessage}
          </p>
        )}

        <TodoForm onTodoCreated={handleTodoCreated} />

        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-slate-900">My Todos</h2>

            {!isLoading && !loadError && (
              <span className="rounded-full bg-slate-200 px-3 py-1 text-sm font-medium text-slate-600">
                {todos.length}
              </span>
            )}
          </div>

          {isLoading && (
            <div
              role="status"
              className="rounded-xl bg-white px-6 py-10 text-center text-slate-500 shadow-sm"
            >
              Loading Todos...
            </div>
          )}

          {!isLoading && loadError && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {loadError}
            </p>
          )}

          {!isLoading && !loadError && <TodoList todos={todos} />}
        </section>
      </section>
    </main>
  );
}
