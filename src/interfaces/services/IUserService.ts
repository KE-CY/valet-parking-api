import { User } from '../../entities/User';

export interface CreateUserDTO {
  name: string;
  username: string;
  email?: string;
  password?: string;
  employeeNo?: string;
  role?: string;
  isActive?: boolean;
  avatarUrl?: string;
}

export interface UpdateUserDTO {
  name?: string;
  username?: string;
  email?: string;
  password?: string;
  employeeNo?: string;
  role?: string;
  isActive?: boolean;
  avatarUrl?: string;
}

export interface IUserService {
  getAllUsers(): Promise<User[]>;
  getUserById(id: number): Promise<User>;
  createUser(userData: CreateUserDTO): Promise<User>;
  updateUser(id: number, userData: UpdateUserDTO): Promise<User>;
  deleteUser(id: number): Promise<void>;
}