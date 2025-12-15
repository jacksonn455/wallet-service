import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column()
  type: 'CREDIT' | 'DEBIT';

  @Column({ nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;
}