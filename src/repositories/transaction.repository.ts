import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Transaction } from '../entities/transaction.entity';
import { CreateTransactionDTO } from '../types';

export class TransactionRepository {
  private repository: Repository<Transaction>;

  constructor() {
    this.repository = AppDataSource.getRepository(Transaction);
  }

  async create(data: CreateTransactionDTO): Promise<Transaction> {
    const transaction = this.repository.create(data);
    return await this.repository.save(transaction);
  }

  async findById(id: string): Promise<Transaction | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async findByUserId(userId: string): Promise<Transaction[]> {
    return await this.repository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async getBalance(userId: string): Promise<{ balance: number; totalCredits: number; totalDebits: number }> {
    const transactions = await this.findByUserId(userId);
    
    const totalCredits = transactions
      .filter(t => t.type === 'CREDIT')
      .reduce((sum, t) => sum + Number(t.amount), 0);
    
    const totalDebits = transactions
      .filter(t => t.type === 'DEBIT')
      .reduce((sum, t) => sum + Number(t.amount), 0);
    
    const balance = totalCredits - totalDebits;

    return { balance, totalCredits, totalDebits };
  }

  async findAll(page: number = 1, limit: number = 10): Promise<{ data: Transaction[]; total: number }> {
    const [data, total] = await this.repository.findAndCount({
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, total };
  }
}