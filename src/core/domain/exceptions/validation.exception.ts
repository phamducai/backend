import { BadRequestException } from '@nestjs/common';

export class ValidationException extends BadRequestException {
  constructor(errors: Record<string, any>) {
    super({
      message: 'Validation failed',
      code: 'VALIDATION_FAILED',
      errors
    });
  }
}
