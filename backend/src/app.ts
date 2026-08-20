import cors from "cors";
import express from "express";
import todoRouter from "./routes/todoRoutes.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL ?? "http://localhost:5174",
  }),
);

app.use(express.json());
app.get("/", (_request, response) => {
  response.json({
    message: "Welcome to the Todo API",
  });
});
app.get("/api/health", (_request, response) => {
  response.status(200).json({
    status: "ok",
    message: "Todo API is running",
  });
});

app.use("/api/todos", todoRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
