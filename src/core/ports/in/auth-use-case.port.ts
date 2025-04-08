import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { User } from '../../domain/user.entity';

export class RegisterUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;
}

export class LoginUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}

export interface AuthResult {
  user: {
    id: string;
    email: string;
  };
  token: string;
}

export interface AuthUseCasePort {
  register(userData: RegisterUserDto): Promise<AuthResult>;
  login(credentials: LoginUserDto): Promise<AuthResult>;
  validateToken(token: string): Promise<User | null>;
}
