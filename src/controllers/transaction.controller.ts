import { Response } from 'express';
import { TransactionService } from '../services/transaction.service';
import { AuthRequest } from '../types';
import logger from '../utils/logger';

export class TransactionController {
  private service: TransactionService;

  constructor() {
    this.service = new TransactionService();
  }

  createTransaction = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { amount, type, description } = req.body;
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({ success: false, message: 'User not authenticated' });
        return;
      }

      if (!amount || !type) {
        res.status(400).json({ success: false, message: 'Amount and type are required' });
        return;
      }

      if (type !== 'CREDIT' && type !== 'DEBIT') {
        res.status(400).json({ success: false, message: 'Type must be CREDIT or DEBIT' });
        return;
      }

      if (amount <= 0) {
        res.status(400).json({ success: false, message: 'Amount must be greater than 0' });
        return;
      }

      const transaction = await this.service.createTransaction({
        userId,
        amount,
        type,
        description,
      });

      res.status(201).json({
        success: true,
        message: 'Transaction created successfully',
        data: transaction,
      });
    } catch (error) {
      logger.error('Error in createTransaction controller', { error });
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };

  getTransaction = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const transaction = await this.service.getTransactionById(id);

      if (!transaction) {
        res.status(404).json({ success: false, message: 'Transaction not found' });
        return;
      }

      res.status(200).json({
        success: true,
        data: transaction,
      });
    } catch (error) {
      logger.error('Error in getTransaction controller', { error });
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };

  getUserTransactions = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({ success: false, message: 'User not authenticated' });
        return;
      }

      const transactions = await this.service.getUserTransactions(userId);

      res.status(200).json({
        success: true,
        data: transactions,
        count: transactions.length,
      });
    } catch (error) {
      logger.error('Error in getUserTransactions controller', { error });
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };

  getUserBalance = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({ success: false, message: 'User not authenticated' });
        return;
      }

      const balance = await this.service.getUserBalance(userId);

      res.status(200).json({
        success: true,
        data: balance,
      });
    } catch (error) {
      logger.error('Error in getUserBalance controller', { error });
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };

  getAllTransactions = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const { data, total } = await this.service.getAllTransactions(page, limit);

      res.status(200).json({
        success: true,
        data,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      logger.error('Error in getAllTransactions controller', { error });
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };
}