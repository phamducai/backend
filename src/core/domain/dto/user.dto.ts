import { IsEmail, IsOptional, IsString, IsUUID } from 'class-validator';

/**
 * DTO for returning user information
 */
export class UserDto {
  @IsUUID()
  id: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  name?: string;
}

/**
 * DTO for updating user information
 */
export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  name?: string;
}
