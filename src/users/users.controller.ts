import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UsersService } from './users.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RateLimit } from 'src/common/decorators/rate-limit.decorator';
import { RedisRateLimitGuard } from 'src/common/guards/redis-rate-limit.guard';

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService){}
    
    @Get(':id')
    @UseGuards(JwtAuthGuard, RolesGuard, RedisRateLimitGuard)
    @Roles('admin')
    @RateLimit({ limit: 20, ttl: 60, keyPrefix: 'users-get' })
    getUser(@Param('id') id: string){
        return this.userService.findOne(id);
    }


}
