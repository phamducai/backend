import * as crypto from 'crypto';
import * as bcryptjs from 'bcryptjs';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class User {
  @IsNotEmpty()
  readonly id: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsNotEmpty()
  @MinLength(8)
  readonly password: string;

  @IsNotEmpty()
  readonly createdAt: Date;

  @IsNotEmpty()
  readonly updatedAt: Date;

  private constructor(
    id: string,
    email: string,
    password: string,
    createdAt: Date,
    updatedAt: Date
  ) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static async create(email: string, password: string): Promise<User> {
    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    return new User(
      crypto.randomUUID(),
      email,
      hashedPassword,
      new Date(),
      new Date()
    );
  }

  static fromPersistence(data: {
    id: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
  }): User {
    return new User(
      data.id,
      data.email,
      data.password,
      data.createdAt,
      data.updatedAt
    );
  }

  async validatePassword(plainPassword: string): Promise<boolean> {
    return bcryptjs.compare(plainPassword, this.password);
  }
}
