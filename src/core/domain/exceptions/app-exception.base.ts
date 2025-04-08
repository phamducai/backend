import { HttpException, HttpStatus } from '@nestjs/common';

export class AppException extends HttpException {
  constructor(
    message: string,
    status: HttpStatus,
    public readonly code?: string,
    public readonly details?: Record<string, any>,
  ) {
    super(
      {
        message,
        code,
        details
      },
      status,
    );
  }
}
