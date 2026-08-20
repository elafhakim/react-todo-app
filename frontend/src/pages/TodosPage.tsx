import { useEffect, useState } from "react";
import TodoForm from "../components/TodoForm";
import TodoList from "../components/TodoList";
import { deleteTodo, getTodos } from "../api/todoApi";
import type { Todo } from "../types/todo";

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoToEdit, setTodoToEdit] = useState<Todo | null>(null);
  const [deletingTodoId, setDeletingTodoId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
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
    setActionError(null);
    setSuccessMessage(`Todo "${todo.title}" was created successfully.`);
  }

  function handleEdit(todo: Todo) {
    setTodoToEdit(todo);
    setActionError(null);
    setSuccessMessage(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function handleTodoUpdated(updatedTodo: Todo) {
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo._id === updatedTodo._id ? updatedTodo : todo,
      ),
    );

    setTodoToEdit(null);
    setActionError(null);
    setSuccessMessage(`Todo "${updatedTodo.title}" was updated successfully.`);
  }

  function handleCancelEdit() {
    setTodoToEdit(null);
    setActionError(null);
  }

  async function handleDelete(todo: Todo) {
    const shouldDelete = window.confirm(
      `Do you really want to delete "${todo.title}"?`,
    );

    if (!shouldDelete) {
      return;
    }

    try {
      setDeletingTodoId(todo._id);
      setActionError(null);
      setSuccessMessage(null);

      await deleteTodo(todo._id);

      setTodos((currentTodos) =>
        currentTodos.filter((currentTodo) => currentTodo._id !== todo._id),
      );

      if (todoToEdit?._id === todo._id) {
        setTodoToEdit(null);
      }

      setSuccessMessage(`Todo "${todo.title}" was deleted successfully.`);
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "The Todo could not be deleted.",
      );
    } finally {
      setDeletingTodoId(null);
    }
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

        {actionError && (
          <p
            role="alert"
            className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {actionError}
          </p>
        )}

        <TodoForm
          key={todoToEdit?._id ?? "create-todo"}
          todoToEdit={todoToEdit}
          onTodoCreated={handleTodoCreated}
          onTodoUpdated={handleTodoUpdated}
          onCancelEdit={handleCancelEdit}
        />

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

          {!isLoading && !loadError && (
            <TodoList
              todos={todos}
              deletingTodoId={deletingTodoId}
              onEdit={handleEdit}
              onDelete={(todo) => {
                void handleDelete(todo);
              }}
            />
          )}
        </section>
      </section>
    </main>
  );
}
