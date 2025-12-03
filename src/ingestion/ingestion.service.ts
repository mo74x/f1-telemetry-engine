import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { Driver } from '../drivers/entities/driver.entity';
import { Race } from '../races/entities/race.entity';
import { TelemetryService } from '../telemetry/telemetry.service';

@Injectable()
export class IngestionService {
    private readonly logger = new Logger(IngestionService.name);
    private readonly OPENF1_API = 'https://api.openf1.org/v1/car_data?session_key=9472';

    constructor(
        @InjectRepository(Driver)
        private driverRepository: Repository<Driver>,
        @InjectRepository(Race)
        private raceRepository: Repository<Race>,
        private telemetryService: TelemetryService,
    ) { }

    async seedDrivers() {
        this.logger.log('🏎️ Starting Driver Seeding...');

        try {
            const { data } = await axios.get(this.OPENF1_API);

            for (const driverData of data) {
                // Only save drivers that have a number and name
                if (!driverData.driver_number || !driverData.full_name) continue;

                // Check if driver exists to prevent duplicates
                const existingDriver = await this.driverRepository.findOne({
                    where: { driver_number: driverData.driver_number },
                });

                if (!existingDriver) {
                    const newDriver = this.driverRepository.create({
                        driver_number: driverData.driver_number,
                        name: driverData.full_name,
                        team_name: driverData.team_name,
                        country_code: driverData.country_code,
                    });

                    await this.driverRepository.save(newDriver);
                    this.logger.log(`✅ Saved Driver: ${driverData.full_name}`);
                }
            }
            this.logger.log('🏁 Driver Seeding Complete!');
        } catch (error) {
            this.logger.error('❌ Error fetching drivers', error);
        }
    }

    async seedRaces() {
        this.logger.log('🏁 Starting Race Seeding...');

        // Fetch session details for Bahrain 2024
        const url = 'https://api.openf1.org/v1/sessions?session_key=9472';

        try {
            const { data } = await axios.get(url);
            const session = data[0]; // We expect only one result

            const existingRace = await this.raceRepository.findOne({
                where: { name: 'Bahrain Grand Prix' }, // Simplified check
            });

            if (!existingRace) {
                const newRace = this.raceRepository.create({
                    name: 'Bahrain Grand Prix',
                    location: session.location,
                    date: new Date(session.date_start),
                    is_active: true, // We mark it active for our testing
                });

                await this.raceRepository.save(newRace);
                this.logger.log(`✅ Saved Race: ${session.location}`);
            } else {
                this.logger.log('ℹ️ Race already exists.');
            }
        } catch (error) {
            this.logger.error('❌ Error fetching race', error);
        }
    }

    async streamRaceData() {
        this.logger.log('📡 Starting Live Telemetry Stream Simulation...');

        // Start from the beginning of the race
        let currentDate = new Date('2024-03-02T15:00:00+00:00');

        // End time for the race (2 hours duration)
        const raceEndDate = new Date('2024-03-02T17:00:00+00:00');

        const interval = setInterval(async () => {
            // Fetch data in 5-second chunks for better performance
            const nextDate = new Date(currentDate.getTime() + 5000);

            // Stop if we've reached the end of the race
            if (currentDate >= raceEndDate) {
                this.logger.log('🏁 Race telemetry stream completed!');
                clearInterval(interval);
                return;
            }

            const startStr = currentDate.toISOString();
            const endStr = nextDate.toISOString();

            try {
                // Construct the URL with date range
                const url = `${this.OPENF1_API}&date>=${startStr}&date<${endStr}`;

                this.logger.debug(`Fetching: ${url}`);

                const { data } = await axios.get(url);

                if (data.length > 0) {
                    this.logger.log(`📤 Processing ${data.length} telemetry points...`);
                    // Directly call the telemetry service instead of using RabbitMQ
                    await this.telemetryService.batchCreate(data);
                } else {
                    this.logger.warn(`⚠️ No data for this interval (possibly Safety Car or red flag)`);
                }

                currentDate = nextDate;

            } catch (error) {
                this.logger.error(`❌ Error fetching data from ${startStr}:`);
                this.logger.error(error.message);
            }

        }, 1000); // Send data every second but fetch 5 seconds worth
    }
}
