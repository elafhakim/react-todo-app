import type { User, AuthenticationResponse, LoginData, RegisterData } from "../types/user";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001/api";

const TOKEN_STORAGE_KEY = "todo-app-token";

const USER_STORAGE_KEY = 'todo-app-user'

type ApiErrorResponse = {
  message?: string;
  errors?: string[];
};

async function authRequest(
  path: string,
  data: LoginData | RegisterData,
): Promise<AuthenticationResponse> {
  const response = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const responseData = (await response.json()) as
    | AuthenticationResponse
    | ApiErrorResponse;

  if (!response.ok) {
    const errorData = responseData as ApiErrorResponse;

    const errorMessage =
      errorData.errors?.join(", ") ??
      errorData.message ??
      "Authentication failed";

    throw new Error(errorMessage);
  }

  return responseData as AuthenticationResponse;
}

export async function registerUser(
  registerData: RegisterData,
): Promise<AuthenticationResponse> {
  return authRequest("/auth/register", registerData);
}

export async function loginUser(
  loginData: LoginData,
): Promise<AuthenticationResponse> {
  return authRequest("/auth/login", loginData);
}

export function saveToken(token: string): void {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function removeStoredToken(): void {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}

export function saveUser(user: User): void {
  localStorage.setItem( USER_STORAGE_KEY, JSON.stringify(user) )
}

export function getStoredUser(): User | null {
  const storedUser = localStorage.getItem(USER_STORAGE_KEY)

  if (!storedUser) {
    return null
  }

  try {
    return JSON.parse(storedUser) as User
  } catch {
    localStorage.removeItem(USER_STORAGE_KEY)
    return null
  }
}

export function removeStoredUser(): void {
  localStorage.removeItem(USER_STORAGE_KEY)
}