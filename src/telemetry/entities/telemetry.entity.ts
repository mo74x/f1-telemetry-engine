import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { Driver } from '../../drivers/entities/driver.entity';
import { Race } from '../../races/entities/race.entity';

@Entity()
export class Telemetry {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('float')
    speed: number; // km/h

    @Column('float')
    throttle: number; // 0 to 100

    @Column('float')
    brake: number; // 0 to 100

    @Column()
    gear: number;

    @CreateDateColumn()
    timestamp: Date; // Exact time the data was recorded

    // Relations
    @ManyToOne(() => Driver, (driver) => driver.telemetry_logs)
    driver: Driver;

    @ManyToOne(() => Race, (race) => race.telemetry)
    race: Race;
}
