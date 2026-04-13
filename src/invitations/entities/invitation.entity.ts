import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Tenant } from 'src/tenants/entities/tanent.entity';

@Entity()
export class Invitation {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  email!: string;

  @Column({ unique: true })
  token!: string;

  @Column({ default: 'pending' })
  status!: 'pending' | 'accepted' | 'expired';

  @ManyToOne(() => Tenant, (tenant) => tenant.id, {
    onDelete: 'CASCADE',
  })
  tenant!: Tenant;

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ nullable: true })
  expiresAt!: Date;
}