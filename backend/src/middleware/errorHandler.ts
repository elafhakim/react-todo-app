import { type ErrorRequestHandler, type RequestHandler } from "express";
import mongoose from "mongoose";
import { AuthServiceError } from "../services/authService.js";

type HttpSyntaxError = SyntaxError & {
  status?: number;
  body?: unknown;
};

export const notFoundHandler: RequestHandler = (request, response) => {
  response.status(404).json({
    message: `Route ${request.method} ${request.originalUrl} not found`,
  });
};

export const errorHandler: ErrorRequestHandler = (
  error: unknown,
  _request,
  response,
  _next,
) => {
  if (error instanceof AuthServiceError) {
    response.status(error.statusCode).json({
      message: error.message,
    });

    return;
  }

  if (error instanceof mongoose.Error.ValidationError) {
    response.status(400).json({
      message: "Validation failed",
      errors: Object.values(error.errors).map(
        (validationError) => validationError.message,
      ),
    });

    return;
  }

  if (error instanceof mongoose.Error.CastError) {
    response.status(400).json({
      message: `Invalid value for ${error.path}`,
    });

    return;
  }

  const syntaxError = error as HttpSyntaxError;

  if (
    error instanceof SyntaxError &&
    syntaxError.status === 400 &&
    "body" in syntaxError
  ) {
    response.status(400).json({
      message: "Invalid JSON body",
    });

    return;
  }

  console.error("Unexpected server error:", error);

  response.status(500).json({
    message: "Internal server error",
  });
};
