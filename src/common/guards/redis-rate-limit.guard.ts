import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Cache } from 'cache-manager';
import type { Request, Response } from 'express';
import {
  RATE_LIMIT_KEY,
  type RateLimitOptions,
} from '../decorators/rate-limit.decorator';

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

@Injectable()
export class RedisRateLimitGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const options = this.reflector.getAllAndOverride<RateLimitOptions>(
      RATE_LIMIT_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!options) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const identifier = this.getIdentifier(request);
    const key = `${options.keyPrefix ?? 'rate-limit'}:${identifier}`;
    const now = Date.now();

    const cachedEntry = await this.cacheManager.get<RateLimitEntry>(key);
    const isExpired = !cachedEntry || cachedEntry.resetAt <= now;

    const entry: RateLimitEntry = isExpired
      ? { count: 1, resetAt: now + options.ttl * 1000 }
      : { ...cachedEntry, count: cachedEntry.count + 1 };

    const ttlInSeconds = Math.max(
      1,
      Math.ceil((entry.resetAt - now) / 1000),
    );

    await this.cacheManager.set(key, entry, ttlInSeconds * 1000);

    this.setHeaders(response, options.limit, entry, ttlInSeconds);

    if (entry.count > options.limit) {
      throw new HttpException(
        `Too many requests. Try again in ${ttlInSeconds} seconds.`,
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return true;
  }

  private getIdentifier(request: Request): string {
    const forwardedFor = request.headers['x-forwarded-for'];

    if (typeof forwardedFor === 'string' && forwardedFor.length > 0) {
      return forwardedFor.split(',')[0].trim();
    }

    return request.ip || 'anonymous';
  }

  private setHeaders(
    response: Response,
    limit: number,
    entry: RateLimitEntry,
    ttlInSeconds: number,
  ) {
    response.setHeader('X-RateLimit-Limit', limit.toString());
    response.setHeader(
      'X-RateLimit-Remaining',
      Math.max(0, limit - entry.count).toString(),
    );
    response.setHeader('X-RateLimit-Reset', entry.resetAt.toString());
    response.setHeader('Retry-After', ttlInSeconds.toString());
  }
}
