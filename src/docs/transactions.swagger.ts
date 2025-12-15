/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: Transaction and balance operations
 */

/**
 * @swagger
 * /api/transactions:
 *   post:
 *     tags: [Transactions]
 *     summary: Create a new transaction
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [amount, type]
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 100.5
 *               type:
 *                 type: string
 *                 enum: [CREDIT, DEBIT]
 *               description:
 *                 type: string
 *                 example: Service payment
 *     responses:
 *       201:
 *         description: Transaction created successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     tags: [Transactions]
 *     summary: List all transactions (paginated)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: List of transactions
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/transactions/user:
 *   get:
 *     tags: [Transactions]
 *     summary: List authenticated user's transactions
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User transaction list
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/transactions/{id}:
 *   get:
 *     tags: [Transactions]
 *     summary: Get a transaction by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transaction found
 *       404:
 *         description: Transaction not found
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/balance:
 *   get:
 *     tags: [Transactions]
 *     summary: Get authenticated user's balance
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Balance returned successfully
 *       401:
 *         description: Unauthorized
 */
