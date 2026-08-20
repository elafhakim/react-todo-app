import { useState, type FormEvent } from "react";
import { createTodo } from "../api/todoApi";
import type { Todo } from "../types/todo";

type TodoFormProps = {
  onTodoCreated: (todo: Todo) => void;
};

export default function TodoForm({ onTodoCreated }: TodoFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError("Please enter a title.");
      return;
    }

    if (!deadline) {
      setError("Please select a deadline.");
      return;
    }

    try {
      setIsSubmitting(true);

      const createdTodo = await createTodo({
        title: trimmedTitle,
        description: description.trim() || undefined,
        deadline,
      });

      onTodoCreated(createdTodo);

      setTitle("");
      setDescription("");
      setDeadline("");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "The Todo could not be created.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl bg-white p-6 shadow-md">
      <h2 className="text-xl font-semibold text-slate-800">Create Todo</h2>

      <div className="mt-5">
        <label
          htmlFor="todo-title"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Title
        </label>

        <input
          id="todo-title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          maxLength={100}
          placeholder="Enter a Todo title"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          required
        />
      </div>

      <div className="mt-4">
        <label
          htmlFor="todo-description"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Description
        </label>

        <textarea
          id="todo-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          maxLength={500}
          rows={4}
          placeholder="Enter an optional description"
          className="w-full resize-y rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />
      </div>

      <div className="mt-4">
        <label
          htmlFor="todo-deadline"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Deadline
        </label>

        <input
          id="todo-deadline"
          type="date"
          value={deadline}
          onChange={(event) => setDeadline(event.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          required
        />
      </div>

      {error && (
        <p
          role="alert"
          className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
      >
        {isSubmitting ? "Creating..." : "Create Todo"}
      </button>
    </form>
  );
}
