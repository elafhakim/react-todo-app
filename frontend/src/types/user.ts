export type User = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

export type RegisterData = {
  name: string;
  email: string;
  password: string;
};

export type LoginData = {
  email: string;
  password: string;
};

export type AuthenticationResponse = {
  message: string;
  user: User;
  token: string;
};
