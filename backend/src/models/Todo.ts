import { model, Schema } from "mongoose";

export const TODO_STATUSES = ["open", "completed"] as const;

export type TodoStatus = (typeof TODO_STATUSES)[number];

export type Todo = {
  title: string;
  description?: string;
  deadline: Date;
  status: TodoStatus;
  createdAt: Date;
  updatedAt: Date;
};

const todoSchema = new Schema<Todo>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },

    deadline: {
      type: Date,
      required: [true, "Deadline is required"],
    },

    status: {
      type: String,
      enum: {
        values: TODO_STATUSES,
        message: "Status must be open or completed",
      },
      default: "open",
    },
  },
  {
    timestamps: true,
  },
);

const TodoModel = model<Todo>("Todo", todoSchema);

export default TodoModel;
