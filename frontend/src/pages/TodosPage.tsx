import { useEffect, useState } from "react";
import TodoForm from "../components/todo/TodoForm";
import TodoList from "../components/todo/TodoList";
import { deleteTodo, getTodos, updateTodo } from "../api/todoApi";
import type { Todo } from "../types/todo";
import DeleteTodoModal from "../components/todo/DeleteTodoModal";
import TodoPagination from "../components/todo/TodoPagination";

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoToEdit, setTodoToEdit] = useState<Todo | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deletingTodoId, setDeletingTodoId] = useState<string | null>(null);
  const [updatingTodoId, setUpdatingTodoId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [todoToDelete, setTodoToDelete] = useState<Todo | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const totalPages = Math.max(1, Math.ceil(todos.length / pageSize));
  const activePage = Math.min(currentPage, totalPages);

  const firstTodoIndex = (activePage - 1) * pageSize;
  const visibleTodos = todos.slice(firstTodoIndex, firstTodoIndex + pageSize);

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

  useEffect(() => {
    if (!isFormOpen) {
      return;
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeForm();
      }
    }

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isFormOpen]);

  function openCreateForm() {
    setTodoToEdit(null);
    setActionError(null);
    setSuccessMessage(null);
    setIsFormOpen(true);
  }

  function closeForm() {
    setTodoToEdit(null);
    setActionError(null);
    setIsFormOpen(false);
  }

  function handleTodoCreated(todo: Todo) {
    setTodos((currentTodos) => [todo, ...currentTodos]);
    setCurrentPage(1);
    setSuccessMessage(`Todo "${todo.title}" was created successfully.`);
    setActionError(null);
    setIsFormOpen(false);
  }

  function handleEdit(todo: Todo) {
    setTodoToEdit(todo);
    setActionError(null);
    setSuccessMessage(null);
    setIsFormOpen(true);
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
    setIsFormOpen(false);
  }

  async function handleToggleStatus(todo: Todo) {
    const newStatus = todo.status === "completed" ? "open" : "completed";

    try {
      setUpdatingTodoId(todo._id);
      setActionError(null);
      setSuccessMessage(null);

      const updatedTodo = await updateTodo(todo._id, {
        status: newStatus,
      });

      setTodos((currentTodos) =>
        currentTodos.map((currentTodo) =>
          currentTodo._id === updatedTodo._id ? updatedTodo : currentTodo,
        ),
      );

      setSuccessMessage(
        `Todo "${updatedTodo.title}" was marked as ${newStatus}.`,
      );
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "The Todo status could not be updated.",
      );
    } finally {
      setUpdatingTodoId(null);
    }
  }

  function handleDelete(todo: Todo) {
    setTodoToDelete(todo);
    setActionError(null);
    setSuccessMessage(null);
  }

  function closeDeleteModal() {
    if (deletingTodoId) {
      return;
    }

    setTodoToDelete(null);
  }

  async function confirmDelete() {
    if (!todoToDelete) {
      return;
    }

    const todo = todoToDelete;

    try {
      setDeletingTodoId(todo._id);
      setActionError(null);
      setSuccessMessage(null);

      await deleteTodo(todo._id);

      setTodos((currentTodos) =>
        currentTodos.filter((currentTodo) => currentTodo._id !== todo._id),
      );

      if (todoToEdit?._id === todo._id) {
        closeForm();
      }

      setSuccessMessage(`Todo "${todo.title}" was deleted successfully.`);
      setTodoToDelete(null);
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "The Todo could not be deleted.",
      );

      setTodoToDelete(null);
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

        <section>
          <div className="mb-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-semibold text-slate-900">
                My Todos
              </h2>

              {!isLoading && !loadError && (
                <span className="rounded-full bg-slate-200 px-3 py-1 text-sm font-medium text-slate-600">
                  {todos.length}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={openCreateForm}
              className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
            >
              Create Todo
            </button>
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

          {!isLoading && !loadError && todos.length > 0 && (
            <div className="mb-2 hidden grid-cols-[24px_minmax(0,1fr)_116px_91px_96px] gap-5 px-5 text-xs font-bold uppercase tracking-wide text-slate-900 sm:grid">
              <span aria-hidden="true" />
              <span>Task</span>
              <span>Deadline</span>
              <span>Status</span>
              <span aria-hidden="true" />
            </div>
          )}

          {!isLoading && !loadError && (
            <TodoList
              todos={visibleTodos}
              deletingTodoId={deletingTodoId}
              updatingTodoId={updatingTodoId}
              onEdit={handleEdit}
              onToggleStatus={(todo) => {
                void handleToggleStatus(todo);
              }}
              onDelete={handleDelete}
            />
          )}

          {todos.length > 0 && (
            <TodoPagination
              currentPage={activePage}
              totalPages={totalPages}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={(newPageSize) => {
                setPageSize(newPageSize);
                setCurrentPage(1);
              }}
            />
          )}
        </section>
      </section>

      {isFormOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeForm();
            }
          }}
        >
          <div className="flex min-h-full items-center justify-center">
            <div
              role="dialog"
              aria-modal="true"
              aria-label={todoToEdit ? "Edit Todo" : "Create Todo"}
              className="w-full max-w-xl"
            >
              <TodoForm
                key={todoToEdit?._id ?? "create-todo"}
                todoToEdit={todoToEdit}
                onTodoCreated={handleTodoCreated}
                onTodoUpdated={handleTodoUpdated}
                onCancelEdit={closeForm}
              />
            </div>
          </div>
        </div>
      )}

      {todoToDelete && (
        <DeleteTodoModal
          todo={todoToDelete}
          isDeleting={deletingTodoId === todoToDelete._id}
          onCancel={closeDeleteModal}
          onConfirm={() => {
            void confirmDelete();
          }}
        />
      )}
    </main>
  );
}
