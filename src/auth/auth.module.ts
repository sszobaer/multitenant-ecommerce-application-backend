import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TenantsModule } from 'src/tenants/tenants.module';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { InvitationsModule } from 'src/invitations/invitations.module';
import { RedisRateLimitGuard } from 'src/common/guards/redis-rate-limit.guard';

@Module({
  imports: [
    UsersModule,
    TenantsModule,
    InvitationsModule,
  ],
  providers: [AuthService, RedisRateLimitGuard],
  controllers: [AuthController]
})
export class AuthModule {}
