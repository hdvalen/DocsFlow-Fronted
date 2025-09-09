import axios, { AxiosError } from "axios";

const API_URL = "http://localhost:8000/auth";

export const loginRequest = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      email,
      password,
    });
    return response.data; // { access_token, user }
  } catch (err: unknown) {
    const error = err as AxiosError<{ detail: string }>;
    throw error.response?.data?.detail || "Error al iniciar sesión";
  }
};
