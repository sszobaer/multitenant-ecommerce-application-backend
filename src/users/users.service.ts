import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { CreateUserDto } from './DTOs/create-user.dto';
import { promises } from 'dns';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async createUser(data: CreateUserDto) {
    const exists = await this.findByEmail(data.email);

    if (exists) {
    throw new BadRequestException('Email already exists');
  }
    const user = this.userRepo.create(data);
    return this.userRepo.save(user);
  }

  findByEmail(email: string) {
    return this.userRepo.findOne({ where: { email } });
  }
}