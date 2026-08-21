import { useState, type ReactNode } from "react";
import { loginUser, registerUser } from "../services/authService";
import type { LoginData, RegisterData, User } from "../types/user";
import { AuthContext } from "./AuthContext";

const TOKEN_STORAGE_KEY = "todo-app-token";
const USER_STORAGE_KEY = "todo-app-user";

type AuthProviderProps = {
  children: ReactNode;
};

function getStoredUser(): User | null {
  const storedUser = localStorage.getItem(USER_STORAGE_KEY);

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser) as User;
  } catch {
    localStorage.removeItem(USER_STORAGE_KEY);
    return null;
  }
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_STORAGE_KEY),
  );

  const [user, setUser] = useState<User | null>(getStoredUser);

  const saveAuthentication = (
    authenticatedUser: User,
    authenticationToken: string,
  ) => {
    setUser(authenticatedUser);
    setToken(authenticationToken);

    localStorage.setItem(TOKEN_STORAGE_KEY, authenticationToken);
    localStorage.setItem(
      USER_STORAGE_KEY,
      JSON.stringify(authenticatedUser),
    );
  };

  const login = async (data: LoginData) => {
    const result = await loginUser(data);
    saveAuthentication(result.user, result.token);
  };

  const register = async (data: RegisterData) => {
    const result = await registerUser(data);
    saveAuthentication(result.user, result.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(token && user),
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}