import { TransactionService } from '../src/services/transaction.service';
import { TransactionRepository } from '../src/repositories/transaction.repository';
import { getRedisClient } from '../src/config/redis';
import { publishMessage } from '../src/config/rabbitmq';

jest.mock('../src/repositories/transaction.repository');
jest.mock('../src/config/redis');
jest.mock('../src/config/rabbitmq');

describe('TransactionService', () => {
  let service: TransactionService;

  const redisMock = {
    get: jest.fn(),
    setEx: jest.fn(),
    del: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (getRedisClient as jest.Mock).mockReturnValue(redisMock);

    service = new TransactionService();
  });

  describe('createTransaction', () => {
    it('should create transaction, publish event and clear cache', async () => {
      const transactionMock = {
        id: 'tx-1',
        userId: 'user-1',
        amount: 100,
        type: 'CREDIT',
      };

      (TransactionRepository as jest.Mock).mockImplementation(() => ({
        create: jest.fn().mockResolvedValue(transactionMock),
      }));

      const result = await service.createTransaction({
        userId: 'user-1',
        amount: 100,
        type: 'CREDIT',
      });

      expect(result).toEqual(transactionMock);
      expect(publishMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          event: 'TRANSACTION_CREATED',
          data: transactionMock,
        }),
      );
      expect(redisMock.del).toHaveBeenCalledWith('balance:user-1');
      expect(redisMock.del).toHaveBeenCalledWith('transactions:user-1');
    });
  });

  describe('getTransactionById', () => {
    it('should return transaction from cache', async () => {
      const cachedTransaction = {
        id: 'tx-cache',
        userId: 'user-1',
        amount: 50,
      };

      redisMock.get.mockResolvedValue(JSON.stringify(cachedTransaction));

      const result = await service.getTransactionById('tx-cache');

      expect(result).toEqual(cachedTransaction);
    });

    it('should get transaction from repository when cache is empty', async () => {
      redisMock.get.mockResolvedValue(null);

      (TransactionRepository as jest.Mock).mockImplementation(() => ({
        findById: jest.fn().mockResolvedValue({
          id: 'tx-db',
          userId: 'user-1',
          amount: 75,
        }),
      }));

      const result = await service.getTransactionById('tx-db');

      expect(result?.id).toBe('tx-db');
      expect(redisMock.setEx).toHaveBeenCalled();
    });
  });

  describe('getUserTransactions', () => {
    it('should return transactions from repository and cache result', async () => {
      redisMock.get.mockResolvedValue(null);

      (TransactionRepository as jest.Mock).mockImplementation(() => ({
        findByUserId: jest
          .fn()
          .mockResolvedValue([{ id: 'tx-1' }, { id: 'tx-2' }]),
      }));

      const result = await service.getUserTransactions('user-1');

      expect(result).toHaveLength(2);
      expect(redisMock.setEx).toHaveBeenCalled();
    });
  });

  describe('getUserBalance', () => {
    it('should calculate balance and cache result', async () => {
      redisMock.get.mockResolvedValue(null);

      (TransactionRepository as jest.Mock).mockImplementation(() => ({
        getBalance: jest.fn().mockResolvedValue({
          balance: 50,
          totalCredits: 100,
          totalDebits: 50,
        }),
        findByUserId: jest.fn().mockResolvedValue([{ id: 1 }, { id: 2 }]),
      }));

      const result = await service.getUserBalance('user-1');

      expect(result).toEqual({
        userId: 'user-1',
        balance: 50,
        totalCredits: 100,
        totalDebits: 50,
        transactionsCount: 2,
      });

      expect(redisMock.setEx).toHaveBeenCalled();
    });
  });

  describe('getAllTransactions', () => {
    it('should return transactions list and total', async () => {
      (TransactionRepository as jest.Mock).mockImplementation(() => ({
        findAll: jest.fn().mockResolvedValue({
          data: [],
          total: 0,
        }),
      }));

      const result = await service.getAllTransactions(1, 10);

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('total');
      expect(result.data).toEqual([]);
      expect(result.total).toBe(0);
    });
  });
});
