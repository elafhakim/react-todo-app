import type { Todo } from "../types/todo";

type TodoItemProps = {
  todo: Todo;
  isDeleting: boolean;
  onEdit: (todo: Todo) => void;
  onDelete: (todo: Todo) => void;
};

function formatDeadline(deadline: string): string {
  return new Date(deadline).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function TodoItem({
  todo,
  isDeleting,
  onEdit,
  onDelete,
}: TodoItemProps) {
  const isCompleted = todo.status === "completed";

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h3
          className={`text-lg font-semibold ${
            isCompleted ? "text-slate-500 line-through" : "text-slate-900"
          }`}
        >
          {todo.title}
        </h3>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            isCompleted
              ? "bg-green-100 text-green-700"
              : "bg-amber-100 text-amber-700"
          }`}
        >
          {isCompleted ? "Completed" : "Open"}
        </span>
      </div>

      {todo.description && (
        <p className="mt-3 whitespace-pre-wrap text-sm text-slate-600 [overflow-wrap:anywhere]">
          {todo.description}
        </p>
      )}

      <div className="mt-4 border-t border-slate-100 pt-3">
        <p className="text-sm text-slate-500">
          Deadline:{" "}
          <time dateTime={todo.deadline}>{formatDeadline(todo.deadline)}</time>
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => onEdit(todo)}
          disabled={isDeleting}
          className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Edit
        </button>

        <button
          type="button"
          onClick={() => onDelete(todo)}
          disabled={isDeleting}
          className="rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </article>
  );
}
