import type { RequestHandler } from "express";
import { AuthServiceError, validateToken } from "../services/authService.js";

export const authMiddleware: RequestHandler = (request, _response, next) => {
  const authorizationHeader = request.headers.authorization;

  if (!authorizationHeader) {
    next(new AuthServiceError("Authentication token is required", 401));

    return;
  }

  const [scheme, token] = authorizationHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    next(new AuthServiceError("Invalid authorization header", 401));

    return;
  }

  try {
    const tokenPayload = validateToken(token);

    request.userId = tokenPayload.userId;

    next();
  } catch (error) {
    next(error);
  }
};
