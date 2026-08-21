import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../models/User.js";

const SALT_ROUNDS = 12;
const MINIMUM_PASSWORD_LENGTH = 8;
const MAXIMUM_PASSWORD_BYTES = 72;
const TOKEN_EXPIRES_IN = "1h";

export type RegisterUserInput = {
  name: string;
  email: string;
  password: string;
};

export type LoginUserInput = {
  email: string;
  password: string;
};

export type AuthenticatedUser = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
};

export type AuthenticationResult = {
  user: AuthenticatedUser;
  token: string;
};

export class AuthServiceError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
  ) {
    super(message);
    this.name = "AuthServiceError";
  }
}

function getJwtSecret(): string {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not defined in the environment variables");
  }

  return jwtSecret;
}

export function generateToken(userId: string): string {
  return jwt.sign(
    {
      userId,
    },
    getJwtSecret(),
    {
      expiresIn: TOKEN_EXPIRES_IN,
    },
  );
}

export async function comparePassword(
  password: string,
  passwordHash: string,
): Promise<boolean> {
  return bcrypt.compare(password, passwordHash);
}

function validateRegistrationInput(input: RegisterUserInput): void {
  if (typeof input.name !== "string" || input.name.trim().length < 2) {
    throw new AuthServiceError("Name must contain at least 2 characters", 400);
  }

  if (typeof input.email !== "string" || !input.email.includes("@")) {
    throw new AuthServiceError("A valid email address is required", 400);
  }

  if (
    typeof input.password !== "string" ||
    input.password.length < MINIMUM_PASSWORD_LENGTH
  ) {
    throw new AuthServiceError(
      `Password must contain at least ${MINIMUM_PASSWORD_LENGTH} characters`,
      400,
    );
  }

  if (Buffer.byteLength(input.password, "utf8") > MAXIMUM_PASSWORD_BYTES) {
    throw new AuthServiceError(
      `Password cannot exceed ${MAXIMUM_PASSWORD_BYTES} bytes`,
      400,
    );
  }
}

function validateLoginInput(input: LoginUserInput): void {
  if (typeof input.email !== "string" || !input.email.trim()) {
    throw new AuthServiceError("Email is required", 400);
  }

  if (typeof input.password !== "string" || !input.password) {
    throw new AuthServiceError("Password is required", 400);
  }
}

function isDuplicateKeyError(error: unknown): error is { code: number } {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === 11000
  );
}

export async function registerUser(
  input: RegisterUserInput,
): Promise<AuthenticationResult> {
  validateRegistrationInput(input);

  // Validates the configuration before the user is saved.
  getJwtSecret();

  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();

  const existingUser = await UserModel.findOne({
    email,
  }).lean();

  if (existingUser) {
    throw new AuthServiceError(
      "An account with this email already exists",
      409,
    );
  }

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

  try {
    const user = await UserModel.create({
      name,
      email,
      passwordHash,
    });

    const token = generateToken(user.id);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
      token,
    };
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      throw new AuthServiceError(
        "An account with this email already exists",
        409,
      );
    }

    throw error;
  }
}

export async function loginUser(
  input: LoginUserInput,
): Promise<AuthenticationResult> {
  validateLoginInput(input);

  const email = input.email.trim().toLowerCase();

  const user = await UserModel.findOne({
    email,
  }).select("+passwordHash");

  if (!user) {
    throw new AuthServiceError("Invalid email or password", 401);
  }

  const passwordMatches = await comparePassword(
    input.password,
    user.passwordHash,
  );

  if (!passwordMatches) {
    throw new AuthServiceError("Invalid email or password", 401);
  }

  const token = generateToken(user.id);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    },
    token,
  };
}
