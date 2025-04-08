import { Injectable } from '@nestjs/common';
import { User } from '../../../core/domain/user.entity';
import { UserRepositoryPort } from '../../../core/ports/out/user-repository.port';
import { PrismaService } from '../../config/prisma.service';

@Injectable()
export class PrismaUserRepository implements UserRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.users.findUnique({
      where: { id }
    });
    
    if (!user) return null;
    
    return User.fromPersistence({
      id: user.id,
      email: user.email,
      password: user.password,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.users.findUnique({
      where: { email }
    });
    
    if (!user) return null;
    
    return User.fromPersistence({
      id: user.id,
      email: user.email,
      password: user.password,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    });
  }

  async create(user: User): Promise<User> {
    await this.prisma.users.create({
      data: {
        id: user.id,
        email: user.email,
        password: user.password,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });

    return user;
  }

  async update(user: User): Promise<User> {
    await this.prisma.users.update({
      where: { id: user.id },
      data: {
        email: user.email,
        password: user.password,
        updatedAt: user.updatedAt
      }
    });

    return user;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.users.delete({
      where: { id }
    });
  }
}
