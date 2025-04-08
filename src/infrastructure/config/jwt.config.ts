import { JwtModuleOptions } from '@nestjs/jwt';

export const jwtConfig: JwtModuleOptions = {
  secret: process.env.JWT_SECRET || 'super-secret-key',
  signOptions: { expiresIn: '24h' },
};
