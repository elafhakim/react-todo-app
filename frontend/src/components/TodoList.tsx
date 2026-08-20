import type { Todo } from "../types/todo";
import TodoItem from "./TodoItem";

type TodoListProps = {
  todos: Todo[];
  deletingTodoId: string | null;
  onEdit: (todo: Todo) => void;
  onDelete: (todo: Todo) => void;
};

export default function TodoList({
  todos,
  deletingTodoId,
  onEdit,
  onDelete,
}: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
        <h3 className="text-lg font-semibold text-slate-700">No Todos yet</h3>

        <p className="mt-2 text-sm text-slate-500">
          Create your first Todo using the form above.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {todos.map((todo) => (
        <TodoItem
          key={todo._id}
          todo={todo}
          isDeleting={deletingTodoId === todo._id}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
