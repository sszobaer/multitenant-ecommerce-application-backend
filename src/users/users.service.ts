import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './DTOs/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';


@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,

    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async findOne(id: string){
    const cacheKey = `user: ${id}`;

    const cachedUser = await this.cacheManager.get(cacheKey);
    if(cachedUser){
      return cachedUser;
    }

    const user = await this.userModel.findById(id);
    if(!user) return new BadRequestException("No User Found");

    await this.cacheManager.set(cacheKey, user, 300);

    return user;
  }

  async createUser(data: CreateUserDto) {
    const exists = await this.findByEmail(data.email);

    if (exists) {
    throw new BadRequestException('Email already exists');
  }
    return this.userModel.create(data);
  }

  findByEmail(email: string) {
    return this.userModel.findOne( {email});
  }


}