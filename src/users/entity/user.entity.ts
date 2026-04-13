import { Tenant } from 'src/tenants/entities/tanent.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ default: 'user' })
  role!: string;

  @ManyToOne(()=> Tenant, tenant => tenant.users)
  @JoinColumn({name: 'tanent_id'})
  tenant!: Tenant;

  @Column()
  tenant_id!: number;
}