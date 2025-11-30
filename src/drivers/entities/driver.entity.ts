import { Entity ,Column,PrimaryGeneratedColumn,OneToMany} from "typeorm";
import { Telemetry } from '../../telemetry/entities/telemetry.entity';

@Entity()
export class Driver {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({unique:true})
    driver_number: number;

    @Column()
    team_name: string;

    @Column({nullable:true})
    country_code: string;

    @OneToMany(() => Telemetry, (telemetry) => telemetry.driver)
    telemetry_logs: Telemetry[];

}
