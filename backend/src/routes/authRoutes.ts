import { Router } from "express";
import { loginUser, registerUser } from "../services/authService.js";

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

authRouter.post("/login", async (request, response) => {
  const { email, password } = request.body;

  const authenticationResult = await loginUser({
    email,
    password,
  });

  response.status(200).json({
    message: "Login successful",
    ...authenticationResult,
  });
});

export default authRouter;
