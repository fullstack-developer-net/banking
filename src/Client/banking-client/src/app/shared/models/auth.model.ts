export interface AuthModel {
  token: string;
  refreshToken: string;
  userId: string;
  username: string;
  fullName: string;
  email: string;
  roles: string[];
}
