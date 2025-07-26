export interface CreateUserDto {
  username: string;
  password: string;
  name: string;
  employeeNo: string;
  salt: string;
  avatarUrl: string;
}

export interface RegisterDto {
  username: string;
  password: string;
  name: string;
  employeeNo: string;
  avatarUrl: string;
}