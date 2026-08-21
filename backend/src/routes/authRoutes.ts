import { Router } from "express";
import { registerUser } from "../services/authService.js";

const authRouter = Router();

authRouter.post("/register", async (request, response) => {
  const { name, email, password } = request.body;

  const authenticationResult = await registerUser({
    name,
    email,
    password,
  });

  response.status(201).json({
    message: "User registered successfully",
    ...authenticationResult,
  });
});

export default authRouter;
