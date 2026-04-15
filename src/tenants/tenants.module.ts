import { Module } from '@nestjs/common';
import { TenantService } from './tenants.service';
import { Tenant, TenantSchema } from './schema/tanent.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { TenantController } from './tenants.controller';

@Module({
  imports:[
    MongooseModule.forFeature([{
        name: Tenant.name, 
        schema: TenantSchema,
      }
    ])
  ],
  providers: [TenantService, MongooseModule],
  exports: [TenantService],
  controllers: [TenantController],
})
export class TenantsModule {}
