import { Global, Logger, Module } from '@nestjs/common';
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
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      isGlobal: true,
      useFactory: async (configService: ConfigService) => {
        const logger = new Logger('CacheModule');
        const redisHost = configService.get<string>('REDIS_HOST') || '127.0.0.1';
        const redisPort = Number(configService.get<number>('REDIS_PORT') || 6379);

        try {
          return {
            stores: [
              await redisStore({
                socket: {
                  host: redisHost,
                  port: redisPort,
                },
              }),
            ],
            ttl: 60 * 1000,
          };
        } catch (error) {
          logger.warn(
            `Redis unavailable at ${redisHost}:${redisPort}. Falling back to in-memory cache.`,
          );

          return {
            ttl: 60 * 1000,
          };
        }
      },
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
