import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { Tenant } from 'src/tenants/entities/tanent.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Tenant) private tenantRepo: Repository<Tenant>,
  ) {}

  createTenant(name: string) {
    const tenant = this.tenantRepo.create({ name, status: 'active' });
    return this.tenantRepo.save(tenant);
  }

  createUser(data: any) {
    const user = this.userRepo.create(data);
    return this.userRepo.save(user);
  }

  findByEmail(email: string) {
    return this.userRepo.findOne({ where: { email } });
  }
}