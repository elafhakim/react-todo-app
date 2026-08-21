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
      <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_116px_91px_96px] sm:items-start">
        <div className="min-w-0">
          <h3
            className={`text-lg font-semibold [overflow-wrap:anywhere] ${
              isCompleted ? "text-slate-500 line-through" : "text-slate-900"
            }`}
          >
            {todo.title}
          </h3>

          {todo.description && (
            <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600 [overflow-wrap:anywhere]">
              {todo.description}
            </p>
          )}
        </div>

        <div>
          <p className="text-xs font-medium uppercase text-slate-400 sm:hidden">
            Deadline
          </p>

          <time
            dateTime={todo.deadline}
            className="mt-1 block whitespace-nowrap text-sm text-slate-600"
          >
            {formatDeadline(todo.deadline)}
          </time>
        </div>

        <div>
          <p className="text-xs font-medium uppercase text-slate-400 sm:hidden">
            Status
          </p>

          <span
            className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
              isCompleted
                ? "bg-green-100 text-green-700"
                : "bg-amber-100 text-amber-700"
            }`}
          >
            {isCompleted ? "Completed" : "Open"}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => onEdit(todo)}
            disabled={isDeleting}
            className="w-24 rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Edit
          </button>

          <button
            type="button"
            onClick={() => onDelete(todo)}
            disabled={isDeleting}
            className="w-24 rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </article>
  );
}
