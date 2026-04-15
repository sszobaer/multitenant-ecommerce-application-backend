import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  Get,
} from '@nestjs/common';
import { CreateTenantDto } from './DTOs/create-tenant.dto';
import { TenantService } from './tenants.service';

@Controller('tenants')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Post()
  async createTenant(@Body() dto: CreateTenantDto) {
    return this.tenantService.createTenant(dto);
  }

  @Get(':id')
  async getTenantById(@Param('id') id: string) {
    return this.tenantService.findById(id);
  }

  @Patch(':id/deactivate')
  async deactivateTenant(@Param('id') id: string) {
    return this.tenantService.deactivateTenant(id);
  }
}