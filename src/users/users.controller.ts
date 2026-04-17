import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UsersService } from './users.service';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService){}
    
    @Get(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    getUser(@Param('id') id: string){
        return this.userService.findOne(id);
    }


}
