import { useEffect } from "react";
import type { Todo } from "../types/todo";

type DeleteTodoModalProps = {
  todo: Todo;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function DeleteTodoModal({
  todo,
  isDeleting,
  onCancel,
  onConfirm,
}: DeleteTodoModalProps) {
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && !isDeleting) {
        onCancel();
      }
    }

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isDeleting, onCancel]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isDeleting) {
          onCancel();
        }
      }}
    >
      <section
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-modal-title"
        aria-describedby="delete-modal-description"
        className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl"
      >
        <div className="flex items-center justify-between gap-4">
          <h2
            id="delete-modal-title"
            className="text-2xl font-semibold text-slate-900"
          >
            Delete Todo
          </h2>

          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            aria-label="Close delete dialog"
            className="flex size-9 items-center justify-center rounded-lg text-2xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            ×
          </button>
        </div>

        <div className="mt-8 flex items-start gap-4">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
            className="size-10 shrink-0 text-amber-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v4m0 4h.01M10.3 3.8 2.6 17.1A2 2 0 0 0 4.3 20h15.4a2 2 0 0 0 1.7-2.9L13.7 3.8a2 2 0 0 0-3.4 0Z"
            />
          </svg>

          <p
            id="delete-modal-description"
            className="pt-1 text-base text-slate-700 [overflow-wrap:anywhere]"
          >
            Do you really want to delete{" "}
            <strong className="font-semibold">"{todo.title}"</strong>?
          </p>
        </div>

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="rounded-lg border border-slate-300 px-5 py-2.5 font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="rounded-lg bg-red-600 px-5 py-2.5 font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </section>
    </div>
  );
}
