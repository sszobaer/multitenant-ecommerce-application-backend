import { isEmpty } from 'rxjs';
import { User } from 'src/users/entity/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class Tenant {
  @PrimaryGeneratedColumn('uuid')
  id!: number;

  @Column()
  name!: string;

  @Column({ default: 'pending' })
  status!: string;

  @OneToMany(() => User, user => user.tenant)
  users!: User[];
}