import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import { UsersController } from './users.controller';
import { RedisRateLimitGuard } from 'src/common/guards/redis-rate-limit.guard';


@Module({
  imports:[
      MongooseModule.forFeature([{
        name: User.name,
        schema: UserSchema,
      }])
    ],
  providers: [UsersService, RedisRateLimitGuard],
  exports: [UsersService, MongooseModule],
  controllers: [UsersController]
})
export class UsersModule {}
