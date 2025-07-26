import { UserResponse } from "./userResponse";

export interface LoginResponse {
  user: UserResponse;
  token: TokenResponse;
}

export interface TokenResponse {
  accessToken: string,
  refreshToken: string
}