import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TenantsModule } from 'src/tenants/tenants.module';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
   imports: [
    UsersModule,
    TenantsModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secretKey',
      signOptions: { expiresIn: '1d' },
    }),],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
