import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Delete,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { ProductService } from './products.service';
import { CreateProductDto } from './DTOs/create-product.dto';
import { UpdateProductDto } from './DTOs/update-product.dto';

@Controller('product')
@UseGuards(JwtAuthGuard, RolesGuard) 
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @Roles('admin')
  async create(@Req() req, @Body() dto: CreateProductDto) {
    return this.productService.create(req.user.tenantId, dto);
  }

  @Get()
  async findAll(@Req() req, @Query() query) {
    return this.productService.findAll(req.user.tenantId, query);
  }

  @Get(':id')
  async findOne(@Req() req, @Param('id') id: string) {
    return this.productService.findOne(req.user.tenantId, id);
  }

  @Patch(':id')
  @Roles('admin')
  async update(@Req() req, @Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productService.update(req.user.tenantId, id, dto);
  }

  @Delete(':id')
  @Roles('admin')
  async remove(@Req() req, @Param('id') id: string) {
    return this.productService.remove(req.user.tenantId, id);
  }
}