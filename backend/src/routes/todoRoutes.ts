import { Router } from "express";
import {
  createTodo,
  deleteTodo,
  getTodoById,
  getTodos,
  updateTodo,
  type CreateTodoInput,
  type UpdateTodoInput,
} from "../services/todoService.js";

const todoRouter = Router();

todoRouter.get("/", async (request, response) => {
  const todos = await getTodos(request.userId);

  response.status(200).json(todos);
});

todoRouter.get("/:id", async (request, response) => {
  const todo = await getTodoById(request.params.id, request.userId);

  if (!todo) {
    response.status(404).json({
      message: "Todo not found",
    });

    return;
  }

  response.status(200).json(todo);
});

todoRouter.post("/", async (request, response) => {
  const { title, description, deadline, status } = request.body;

  const todoData: CreateTodoInput = {
    title,
    description,
    deadline: new Date(deadline),
    status,
  };

  const createdTodo = await createTodo(request.userId, todoData);

  response.status(201).json(createdTodo);
});

todoRouter.put("/:id", async (request, response) => {
  const { title, description, deadline, status } = request.body;

  const todoData: UpdateTodoInput = {
    title,
    description,
    status,
  };

  if (deadline !== undefined) {
    todoData.deadline = new Date(deadline);
  }

  const updatedTodo = await updateTodo(request.params.id, request.userId, todoData);

  if (!updatedTodo) {
    response.status(404).json({
      message: "Todo not found",
    });

    return;
  }

  response.status(200).json(updatedTodo);
});

todoRouter.delete("/:id", async (request, response) => {
  const deletedTodo = await deleteTodo(request.params.id, request.userId);

  if (!deletedTodo) {
    response.status(404).json({
      message: "Todo not found",
    });

    return;
  }

  response.status(204).send();
});

export default todoRouter;
