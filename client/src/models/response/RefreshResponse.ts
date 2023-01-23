import { AuthResponse } from "./AuthResponse";

export interface RefreshResponse {
  user: AuthResponse;
  isError: boolean;
  message: string;
}
