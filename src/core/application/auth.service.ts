import { Injectable, Inject, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../domain/user.entity';
import { UserRepositoryPort } from '../ports/out/user-repository.port';
import { AuthResult, AuthUseCasePort, LoginUserDto, RegisterUserDto } from '../ports/in/auth-use-case.port';

@Injectable()
export class AuthService implements AuthUseCasePort {
  constructor(
    @Inject('UserRepositoryPort')
    private readonly userRepository: UserRepositoryPort,
    private readonly jwtService: JwtService,
  ) {}

  async register(userData: RegisterUserDto): Promise<AuthResult> {
    // Check if user exists
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Create new user
    const user = await User.create(userData.email, userData.password);

    // Save user
    const savedUser = await this.userRepository.create(user);
    
    // Generate token
    const token = this.generateToken(savedUser);
    
    return {
      user: {
        id: savedUser.id,
        email: savedUser.email
      },
      token
    };
  }

  async login(credentials: LoginUserDto): Promise<AuthResult> {
    // Find user
    const user = await this.userRepository.findByEmail(credentials.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Validate password
    const isPasswordValid = await user.validatePassword(credentials.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate token
    const token = this.generateToken(user);
    
    return {
      user: {
        id: user.id,
        email: user.email
      },
      token
    };
  }

  async validateToken(token: string): Promise<User | null> {
    try {
      const payload = this.jwtService.verify(token);
      return this.userRepository.findById(payload.sub);
    } catch (error) {
      return null;
    }
  }

  private generateToken(user: User): string {
    const payload = {
      sub: user.id,
      email: user.email,
    };

    return this.jwtService.sign(payload);
  }
}
