import bcrypt from "bcrypt";
import UserModel from "../models/User.js";

const SALT_ROUNDS = 12;
const MINIMUM_PASSWORD_LENGTH = 8;
const MAXIMUM_PASSWORD_BYTES = 72;

export type RegisterUserInput = {
  name: string;
  email: string;
  password: string;
};

export type RegisteredUser = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
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
): Promise<RegisteredUser> {
  validateRegistrationInput(input);

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

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
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
