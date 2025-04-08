// Re-export NestJS's built-in exceptions
export { 
  BadRequestException,
  UnauthorizedException, 
  ForbiddenException, 
  NotFoundException,
  ConflictException,
  InternalServerErrorException
} from '@nestjs/common';

// Export custom exceptions
export * from './entity-not-found.exception';
export * from './validation.exception';
