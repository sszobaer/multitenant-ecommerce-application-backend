import { Module } from '@nestjs/common';
import { TenantsModule } from 'src/tenants/tenants.module';
import { ProductService } from './products.service';
import { ProductController } from './products.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schema/product.schema';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        // JwtModule.register({
        //     secret: 'your-secret', 
        //     signOptions: { expiresIn: '1d' },
        // }),
        MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
        TenantsModule],
    providers: [ProductService],
    controllers: [ProductController]
})
export class ProductsModule { }
