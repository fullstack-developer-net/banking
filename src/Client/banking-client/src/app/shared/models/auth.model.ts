export interface AuthModel {
  token: string;
  refreshToken: string;
  userId: number;
  username: string;
  fullName: string;
  email: string;
  roles: string[];
}
