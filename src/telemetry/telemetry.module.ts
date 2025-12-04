import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelemetryService } from './telemetry.service';
import { TelemetryController } from './telemetry.controller';
import { Telemetry } from './entities/telemetry.entity';
import { TelemetryGateway } from './telemetry/telemetry.gateway';
import {CacheModule} from '@nestjs/cache-manager';
import {redisStore} from 'cache-manager-redis-yet';


@Module({
  imports: [TypeOrmModule.forFeature([Telemetry]),
  CacheModule.register({
    store: redisStore,
    host: 'localhost',
    port: 6379,
    ttl: 5000,
  }),
],

  controllers: [TelemetryController],
  providers: [TelemetryService, TelemetryGateway],
  exports: [TelemetryService],
})
export class TelemetryModule { }