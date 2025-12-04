import { CreateTelemetryDto } from './dto/create-telemetry.dto';
import { UpdateTelemetryDto } from './dto/update-telemetry.dto';
import { Injectable, Logger, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Telemetry } from './entities/telemetry.entity';
import { Driver } from '../drivers/entities/driver.entity';
import { Race } from '../races/entities/race.entity';
import { TelemetryGateway } from './telemetry/telemetry.gateway';
import * as cacheManager_1 from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class TelemetryService {
  private readonly logger = new Logger(TelemetryService.name);
  constructor(
    @InjectRepository(Telemetry)
    private telemetryRepository: Repository<Telemetry>,
    private readonly telemetryGateway: TelemetryGateway,
    @Inject(CACHE_MANAGER) private cacheManager:cacheManager_1.Cache,
  ) {}

  async batchCreate(data: any[]) {
    // 1. Map the raw API data to our Entity format
    // Note: We are assuming Driver #1 (Verstappen) and Race ID 1 exist in DB.
    // In a real app, you would look up the IDs dynamically.
    
    const entities = data.map((item) => {
      return this.telemetryRepository.create({
        speed: item.speed,
        throttle: item.throttle,
        brake: item.brake,
        gear: item.n_gear,
        timestamp: new Date(item.date),
        driver: { id: 1 }, // Hardcoded to Verstappen's ID for this test
        race: { id: 1 },   // Hardcoded to Bahrain GP ID
      });
    });

    // 2. Bulk Insert (Much faster than saving one by one)
    await this.telemetryRepository.save(entities);
    
    this.logger.log(`💾 Saved ${entities.length} telemetry points to DB`);

    this.telemetryGateway.broadcastTelemetry(entities);
    this.logger.log(`📡 Broadcasted updates to clients`);
    const latestData = entities[entities.length - 1];
    await this.cacheManager.set('driver:1:latest', latestData, 0);
    this.logger.log(`💾 Cached latest telemetry point`);

  }
  async getLatestTelemetry(driverId: number) {
    const cachedData = await this.cacheManager.get(`driver:1:latest`); // Hardcoded 1 for now
    if (cachedData) {
      this.logger.log('⚡ Fetched data from Redis Cache');
      return cachedData;
    }
    return null;
  }
  create(createTelemetryDto: CreateTelemetryDto) {
    return 'This action adds a new telemetry';
  }

  findAll() {
    return `This action returns all telemetry`;
  }

  findOne(id: number) {
    return `This action returns a #${id} telemetry`;
  }

  update(id: number, updateTelemetryDto: UpdateTelemetryDto) {
    return `This action updates a #${id} telemetry`;
  }

  remove(id: number) {
    return `This action removes a #${id} telemetry`;
  }
}
