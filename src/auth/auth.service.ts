
import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './DTOs/register.dto';
import { LoginDto } from './DTOs/login.dto';
import { DataSource } from 'typeorm';
import { Tenant } from 'src/tenants/entities/tanent.entity';
import { User } from 'src/users/entity/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly jwtService: JwtService,
  ) {}

  async register(data: RegisterDto) {
    const existingTenant = await this.dataSource.manager.findOne(Tenant, {
      where: { name: data.tenantName },
    });

    if (existingTenant) {
      throw new BadRequestException('Tenant name already taken');
    }

    const existingUser = await this.dataSource.manager.findOne(User, {
      where: { email: data.email },
    });

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    return this.dataSource.transaction(async (manager) => {
      const tenant = manager.create(Tenant, {
        name: data.tenantName,
        isActive: true,
      });

      await manager.save(tenant);

      const hashedPassword = await bcrypt.hash(data.password, 10);

      const user = manager.create(User, {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        tenant,
        role: 'admin',
      });

      const savedUser = await manager.save(user);

      return savedUser;
    });
  }

  async login(data: LoginDto) {
    const user = await this.dataSource.manager.findOne(User, {
      where: { email: data.email },
      relations: ['tenant'],
    });

    if (!user || !(await bcrypt.compare(data.password, user.password))) {
      throw new BadRequestException('Invalid credentials');
    }

    const payload = {
      userId: user.id,
      tenantId: user.tenant.id,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
  