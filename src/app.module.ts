import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TenantsModule } from './tenants/tenants.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { InvitationsModule } from './invitations/invitations.module';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secretKey',
      signOptions: { expiresIn: '1d' },
    }),
    
    //PG SQL Conn
    // TypeOrmModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: (config: ConfigService) => ({
    //     type: 'postgres',
    //     host: config.get<string>('DB_HOST'),
    //     port: config.get<number>('DB_PORT'),
    //     username: config.get<string>('DB_USERNAME'),
    //     password: config.get<string>('DB_PASSWORD'),
    //     database: config.get<string>('DB_NAME'),
    //     autoLoadEntities: true,
    //     synchronize: true,
    //     logging: true,
    //     extra: { 
    //       max: 10,
    //     }
    //   }),
    // }),

    //Mongo Conn
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
    }),

    //Configure Redis
    CacheModule.register({
      store: redisStore,
      host: 'localhost',
      port: 6379,
      ttl: 60,
      isGlobal: true,
    }),

    TenantsModule,
    UsersModule,
    ProductsModule,
    AuthModule,
    InvitationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [JwtModule]
})
export class AppModule { }
