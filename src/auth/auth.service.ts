import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(data: any) {
    const tenant = await this.usersService.createTenant(data.tenantName);

    // hash password
    const hashed = await bcrypt.hash(data.password, 10);

    // create user
    const user = await this.usersService.createUser({
      ...data,
      password: hashed,
      tenant_id: tenant.id,
      role: 'admin',
    });

    return user;
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid credentials');
    }

    const payload = {
      userId: user.id,
      tenantId: user.tenant_id,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}