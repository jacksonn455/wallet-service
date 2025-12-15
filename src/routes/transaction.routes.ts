// src/routes/transaction.routes.ts
import { Router } from 'express';
import { TransactionController } from '../controllers/transaction.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const controller = new TransactionController();

router.use(authMiddleware);

router.post('/transactions', controller.createTransaction);
router.get('/transactions', controller.getAllTransactions);
router.get('/transactions/user', controller.getUserTransactions);
router.get('/transactions/:id', controller.getTransaction);
router.get('/balance', controller.getUserBalance);

export default router;
