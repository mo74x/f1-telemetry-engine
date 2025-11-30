import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Telemetry } from '../../telemetry/entities/telemetry.entity';

@Entity()
export class Race {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    location: string;

    @Column({ type: 'timestamp' })
    date: Date;

    @Column({ default: false })
    is_active: boolean;

    // Relations
    @OneToMany(() => Telemetry, (telemetry) => telemetry.race)
    telemetry: Telemetry[];
}
