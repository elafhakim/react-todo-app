import { model, Schema, type Types } from "mongoose";

export const TODO_STATUSES = ["open", "completed"] as const;

export type TodoStatus = (typeof TODO_STATUSES)[number];

export type Todo = {
  user: Types.ObjectId;
  title: string;
  description?: string;
  deadline: Date;
  status: TodoStatus;
  createdAt: Date;
  updatedAt: Date;
};

const todoSchema = new Schema<Todo>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },

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

// to loading a user's todo in descending order of creation date
todoSchema.index({
  user: 1,
  createdAt: -1,
});

const TodoModel = model<Todo>("Todo", todoSchema);

export default TodoModel;
