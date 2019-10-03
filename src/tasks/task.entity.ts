import { BaseEntity, Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

import { ETaskStatus } from './task-status.enum'

@Entity()
export class Task extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  @Column()
  description: string

  @Column()
  status: ETaskStatus
}
