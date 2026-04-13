import { Module } from '@nestjs/common';
import { TenantService } from './tenants.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenant } from './entities/tanent.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([Tenant])
  ],
  providers: [TenantService],
  exports: [TenantService],
})
export class TenantsModule {}
