import { Module } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Driver } from '../drivers/entities/driver.entity';
import { Race } from '../races/entities/race.entity';
import { TelemetryModule } from '../telemetry/telemetry.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Driver, Race]),
    TelemetryModule,
  ],
  providers: [IngestionService],
  exports: [IngestionService],
})
export class IngestionModule { }
