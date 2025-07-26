import { Repository } from 'typeorm';
import { User } from '../entities/User';
import { IUserRepository } from '../interfaces/repositories/userRepositoryInterface';
import { AppDataSource } from '../config/typeorm-config';
import logger from '../utils/logger';
import { DatabaseError } from '../utils/customErrors';
import { CreateUserDto } from '../interfaces/dto/userDto';

export class UserRepository extends Repository<User> implements IUserRepository {
  constructor() {
    super(User, AppDataSource.manager);
  }

  static getInstance(): UserRepository {
    return new UserRepository();
  }

  async findAll(): Promise<User[]> {
    try {
      logger.debug({ msg: 'UserRepository: find all users' });

      const users = this.createQueryBuilder('user').getMany();

      return users;

    } catch (error) {
      logger.error({ msg: 'UserRepository: Error find all users' });
      throw new DatabaseError(
        'Failed to find all users',
        error instanceof Error ? error.message : 'Unknown database error'
      );
    }
  }

  async findById(id: number): Promise<User | null> {
    try {
      logger.debug({ msg: 'UserRepository: Finding user by ID', id });

      const user = this.createQueryBuilder('user')
        .where('user.id = :id', { id })
        .getOne();

      logger.debug({ msg: 'UserRepository: User found by ID', id, found: !!user });

      return user;
    } catch (error) {
      logger.error({ msg: 'UserRepository: Error finding user by ID', id, error });
      throw new DatabaseError(
        'Failed to find user by ID',
        error instanceof Error ? error.message : 'Unknown database error'
      );
    }
  }

  async existsByUsername(username: string): Promise<boolean> {
    try {
      logger.debug({ msg: 'UserRepository: Check exists by username', username });

      const count = await this.createQueryBuilder('user')
        .where('user.username = :username', { username })
        .getCount();

      const exists = count > 0;
      logger.debug({ msg: 'UserRepository: Check exists by username', username, exists });
      return exists;

    } catch (error) {
      logger.error({ msg: 'UserRepository: Error check exists by username.', username });
      throw new DatabaseError(
        'Failed to check exists username',
        error instanceof Error ? error.message : 'Unknown database error'
      )
    }
  }

  async createOne(userData: CreateUserDto, requestId: string): Promise<User> {
    try {
      logger.debug({ msg: 'UserRepository: Creating user start', requestId });

      const createdUser = this.create(userData);

      const savedUser = await this.save(createdUser);
      return savedUser;
    } catch (error) {
      logger.error({
        msg: 'UserRepository: Error creating user',
        userData: { ...userData, password: '[HIDDEN]' },
        error
      });

      throw new DatabaseError(
        'Failed to create user',
        error instanceof Error ? error.message : 'Unknown database error'
      );
    }
  }
}