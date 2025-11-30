import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelemetryService } from './telemetry.service';
import { TelemetryController } from './telemetry.controller';
import { Telemetry } from './entities/telemetry.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Telemetry])],
  controllers: [TelemetryController],
  providers: [TelemetryService],
})
export class TelemetryModule {}