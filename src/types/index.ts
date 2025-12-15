import { Request } from 'express';

export interface JWTPayload {
  userId: string;
  iat?: number;
  exp?: number;
}

export interface AuthRequest extends Request {
  user?: JWTPayload;
}

export interface CreateTransactionDTO {
  userId: string;
  amount: number;
  type: 'CREDIT' | 'DEBIT';
  description?: string;
}

export interface TransactionResponse {
  id: string;
  userId: string;
  amount: number;
  type: 'CREDIT' | 'DEBIT';
  description: string | null;
  createdAt: Date;
}

export interface BalanceResponse {
  userId: string;
  balance: number;
  totalCredits: number;
  totalDebits: number;
  transactionsCount: number;
}