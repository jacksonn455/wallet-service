# Wallet Service

Digital wallet service developed in Node.js with TypeScript, offering wallet and financial transaction management with event-driven architecture.

## 🚀 Technologies

- **Node.js** with **TypeScript**
- **Express** - Web framework
- **PostgreSQL** - Relational database
- **Prisma** - ORM
- **RabbitMQ** - Message broker for async queues
- **Redis** - Cache and performance optimization
- **JWT** - Authentication and authorization
- **Swagger** - API documentation
- **Docker** - Containerization

## 📋 Features

- ✅ Digital wallet creation and management
- ✅ Transaction processing (credit/debit)
- ✅ Async transaction processing queue via RabbitMQ
- ✅ Balance and transaction caching with Redis
- ✅ JWT authentication
- ✅ Statement and history queries
- ✅ Balance validation before debits
- ✅ Interactive documentation with Swagger
- ✅ Production-ready monitoring with New Relic (APM, distributed tracing, logs and alerts)

## 🏗️ Architecture

The service is built using a modular architecture, following best practices for scalability and maintainability:

- **API Layer:** Handles HTTP requests and responses, input validation, and authentication.
- **Service Layer:** Contains business logic for wallet and transaction management.
- **Repository Layer:** Abstracts data access using Prisma ORM for PostgreSQL.
- **Message Queue:** RabbitMQ is used for processing transactions asynchronously.
- **Cache:** Redis is utilized for caching wallet balances and transaction data.

## 📦 Installation

To install and run the project, follow these steps:

1. **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/wallet-service.git
    ```

2. **Enter the project folder:**
    ```bash
    cd wallet-service
    ```

3. **Install dependencies:**
    ```bash
    npm install
    ```

4. **Setup environment variables:**
    ```bash
    cp .env.example .env
    ```
    Configure your environment variables in the `.env` file.

5. **Run the development server:**
    ```bash
    npm run dev
    ```

The API will be available at http://localhost:3001

## ⚙️ Environment Variables

| Variable | Description |
|--------|------------|
| PORT | Application port (3001) |
| JWT_SECRET | JWT private key (ILIACHALLENGE) |
| RABBITMQ_URL | RabbitMQ connection URL |
| REDIS_HOST | Redis host |
| REDIS_PORT | Redis port |
| REDIS_PASSWORD | Redis password (optional) |
| REDIS_DB | Redis database index |
| DB_HOST | PostgreSQL host |
| DB_PORT | PostgreSQL port |
| DB_USER | PostgreSQL user |
| DB_PASSWORD | PostgreSQL password |
| DB_NAME | PostgreSQL database name |
| NEW_RELIC_LICENSE_KEY | New Relic APM license key |
| NEW_RELIC_APP_NAME | Application name in New Relic |
| NEW_RELIC_LOG_LEVEL | New Relic log level |
| NEW_RELIC_ENABLED | Enable/disable New Relic |

## 💬 Messaging

The service uses **RabbitMQ** for asynchronous messaging, enabling reliable, scalable, and decoupled transaction processing.

![](https://github.com/jacksonn455/wallet-service/blob/main/images/rabbitmq.png)

## 📚 API Documentation

Comprehensive API documentation is available at:

```
http://localhost:3001/api-docs
```

### Swagger Features
- Interactive API Explorer: Test endpoints directly from the browser
- Request/Response Schemas: View detailed model definitions
- Authentication Support: Configure JWT tokens
- Real-time Testing: Execute API calls with sample data
- Downloadable OpenAPI specification

![](https://github.com/jacksonn455/wallet-service/blob/main/images/swagger.png)

## 🐳 Docker Setup

You can run the service using either **Docker** or **Docker Compose**.

### Using Docker

1. **Build the Docker image:**
    ```bash
    docker build -t wallet-service .
    ```

2. **Run the Docker container:**
    ```bash
    docker run -p 3001:3001 wallet-service
    ```

3. **Access the API:**
    Open your browser and go to `http://localhost:3001`.

### Using Docker Compose

1. **Start the services:**
    ```bash
    docker-compose up --build
    ```

2. **Access the API:**
    Open your browser and go to `http://localhost:3001`.

> The `docker-compose.yml` file includes all necessary services like PostgreSQL, Redis, and RabbitMQ.

## 🔑 Authentication & Security

This project uses **JWT authentication** to secure API routes. To access protected resources, include the JWT token in the `Authorization` header as a Bearer token.

### JWT Configuration

This service uses JWT authentication on all protected routes.

Required environment variable:
JWT_SECRET=ILIACHALLENGE

### Auth Endpoints

#### Register
```http
POST /auth/register
Content-Type: application/json

{
    "email": "user@example.com",
    "password": "securePassword123",
    "name": "John Doe"
}
```

**Response:**
```json
{
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2024-01-15T10:00:00Z"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
    "email": "user@example.com",
    "password": "securePassword123"
}
```

**Response:**
```json
{
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
        "id": "user_id",
        "email": "user@example.com",
        "name": "John Doe"
    }
}
```

## 💰 Wallet API Endpoints

All wallet endpoints require authentication via JWT token.

### Get Wallet Balance
```http
GET /wallet/balance
Authorization: Bearer <token>
```

**Response:**
```json
{
    "balance": 1500.50,
    "currency": "BRL",
    "lastTransaction": "2024-01-15T10:30:00Z"
}
```

### Create Transaction
```http
POST /wallet/transactions
Authorization: Bearer <token>
Content-Type: application/json

{
    "type": "credit|debit",
    "amount": 100.00,
    "description": "Payment received",
    "category": "income"
}
```

**Response:**
```json
{
    "id": "transaction_id",
    "type": "credit",
    "amount": 100.00,
    "balance": 1600.50,
    "description": "Payment received",
    "category": "income",
    "createdAt": "2024-01-15T10:30:00Z"
}
```

### Get Transaction History
```http
GET /wallet/transactions?page=1&limit=10&type=credit
Authorization: Bearer <token>
```

**Response:**
```json
{
    "transactions": [
        {
            "id": "transaction_id",
            "type": "credit",
            "amount": 100.00,
            "balance": 1600.50,
            "description": "Payment received",
            "createdAt": "2024-01-15T10:30:00Z"
        }
    ],
    "pagination": {
        "total": 50,
        "page": 1,
        "limit": 10,
        "totalPages": 5
    }
}
```

### Get Transaction by ID
```http
GET /wallet/transactions/:id
Authorization: Bearer <token>
```

## Rate Limiting & Security

The API implements rate limiting to protect endpoints from abuse:

### Rate Limiting Configuration

| Endpoint               | Limit        | Time Window | Purpose                           |
|------------------------|--------------|-------------|-----------------------------------|
| `/auth/login`          | 5 requests   | 15 minutes  | Prevent brute force attacks       |
| `/auth/register`       | 3 requests   | 1 hour      | Prevent spam registrations        |
| `/wallet/transactions` | 100 requests | 1 minute    | Prevent transaction flooding      |
| Global limit           | 1000 requests| 15 minutes  | Overall API protection            |

### Response Headers
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1640995200
```

### Error Response
```json
{
  "message": "Rate limit exceeded. Please wait before trying again.",
  "error": "Too Many Requests",
  "statusCode": 429
}
```

## 🧪 Testing

The project uses **Jest** for unit and integration tests, ensuring code reliability and correctness.

![](https://github.com/jacksonn455/wallet-service/blob/main/images/jest.png)

## 📊 Monitoring

This application is integrated with **New Relic APM** for comprehensive monitoring:

### Features
- **Real-time Performance Tracking:** Monitor API response times and throughput
- **Distributed Tracing:** End-to-end transaction tracing
- **Error Analytics:** Automatic error tracking with context
- **Infrastructure Monitoring:** Memory usage and CPU performance

### Main Metrics
- API endpoint performance
- Database query performance
- Transaction processing times
- Authentication success/failure rates
- Cache hit/miss ratios

![](https://github.com/jacksonn455/wallet-service/blob/main/images/new-relic.png)

## 🔀 Gitflow & Code Review

This project follows Gitflow practices:
- Development was done using feature branches
- At least one Pull Request was created and reviewed
- All changes were merged into the main branch via PR

## Author

<img src="https://avatars1.githubusercontent.com/u/46221221?s=460&u=0d161e390cdad66e925f3d52cece6c3e65a23eb2&v=4" width=115>  

<sub>@jacksonn455</sub>

---

**ília Digital - Code Challenge NodeJS**  
Wallet Microservice - Part 1