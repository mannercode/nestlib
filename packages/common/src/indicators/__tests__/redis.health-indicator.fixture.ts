import type Redis from 'ioredis'
import { HealthIndicatorService } from '@nestjs/terminus'
import { RedisHealthIndicator } from '../redis.health-indicator'
import { getRedisConnectionToken, RedisModule } from '../../redis'
import { createTestContext, getRedisTestConnection } from '@mannercode/nestlib-testing'

export type RedisHealthIndicatorFixture = {
    redis: Redis
    redisIndicator: RedisHealthIndicator
    teardown: () => Promise<void>
}

export async function createRedisHealthIndicatorFixture() {
    const { close, module } = await createTestContext({
        imports: [RedisModule.forRoot({ type: 'single', url: getRedisTestConnection() })],
        providers: [RedisHealthIndicator, HealthIndicatorService]
    })

    const redisIndicator = module.get(RedisHealthIndicator)
    const redis = module.get(getRedisConnectionToken())

    const teardown = async () => {
        await close()
        await redis.quit()
    }

    return { redis, redisIndicator, teardown }
}
