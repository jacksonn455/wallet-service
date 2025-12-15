import { TransactionRepository } from '../repositories/transaction.repository';
import { CreateTransactionDTO, BalanceResponse, TransactionResponse } from '../types';
import { getRedisClient } from '../config/redis';
import { publishMessage } from '../config/rabbitmq';
import logger from '../utils/logger';

export class TransactionService {
  private repository?: TransactionRepository;

  private getRepository() {
    if (!this.repository) {
      this.repository = new TransactionRepository();
    }
    return this.repository;
  }

  async createTransaction(data: CreateTransactionDTO): Promise<TransactionResponse> {
    try {
      const transaction = await this.getRepository().create(data);

      await publishMessage({
        event: 'TRANSACTION_CREATED',
        data: transaction,
        timestamp: new Date().toISOString(),
      });

      const redis = getRedisClient();
      await redis.del(`balance:${data.userId}`);
      await redis.del(`transactions:${data.userId}`);

      logger.info('Transaction created', { transactionId: transaction?.id });

      return transaction;
    } catch (error) {
      logger.error('Error creating transaction', { error });
      throw error;
    }
  }

  async getTransactionById(id: string): Promise<TransactionResponse | null> {
    const redis = getRedisClient();
    const cached = await redis.get(`transaction:${id}`);

    if (cached) return JSON.parse(cached);

    const transaction = await this.getRepository().findById(id);

    if (transaction) {
      await redis.setEx(`transaction:${id}`, 3600, JSON.stringify(transaction));
    }

    return transaction;
  }

  async getUserTransactions(userId: string): Promise<TransactionResponse[]> {
    const redis = getRedisClient();
    const cached = await redis.get(`transactions:${userId}`);

    if (cached) return JSON.parse(cached);

    const transactions = await this.getRepository().findByUserId(userId);

    await redis.setEx(`transactions:${userId}`, 1800, JSON.stringify(transactions));
    return transactions;
  }

  async getUserBalance(userId: string): Promise<BalanceResponse> {
    const redis = getRedisClient();
    const cached = await redis.get(`balance:${userId}`);

    if (cached) return JSON.parse(cached);

    const { balance, totalCredits, totalDebits } =
      await this.getRepository().getBalance(userId);

    const transactions = await this.getRepository().findByUserId(userId);

    const balanceData: BalanceResponse = {
      userId,
      balance,
      totalCredits,
      totalDebits,
      transactionsCount: transactions.length,
    };

    await redis.setEx(`balance:${userId}`, 1800, JSON.stringify(balanceData));
    return balanceData;
  }

  async getAllTransactions(page: number, limit: number) {
    return this.getRepository().findAll(page, limit);
  }
}