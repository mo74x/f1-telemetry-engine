# 🏎️ F1 Telemetry Engine

A real-time Formula 1 telemetry processing engine built with NestJS. This application ingests, processes, and streams F1 race data including telemetry information for drivers and races.

## 📋 Description

The F1 Telemetry Engine is a microservices-based application that handles real-time Formula 1 race data. It features:

- **Real-time telemetry streaming** via WebSockets
- **Data ingestion** from external F1 data sources
- **Caching layer** with Redis for optimized performance
- **Message queue** with RabbitMQ for asynchronous processing
- **PostgreSQL database** for persistent storage
- **RESTful API** for querying race and driver data

## 🏗️ Architecture

```
┌─────────────────┐
│  F1 Data Source │
└────────┬────────┘
         │
         ▼
┌────────────────────┐
│ Ingestion Service  │
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│   RabbitMQ Queue   │
└────────┬───────────┘
         │
         ▼
┌────────────────────┐       ┌──────────────┐
│ Telemetry Service  │◄──────┤ Redis Cache  │
└────────┬───────────┘       └──────────────┘
         │
         ├──► PostgreSQL
         │
         └──► WebSocket Clients
```

## 🚀 Features

### Core Modules

- **Telemetry Module**: Real-time telemetry data processing and streaming
- **Ingestion Module**: Data fetching and queuing from external sources
- **Drivers Module**: Driver information management
- **Races Module**: Race data and session management

### Technology Stack

- **Framework**: NestJS (Node.js/TypeScript)
- **Database**: PostgreSQL with TypeORM
- **Cache**: Redis with cache-manager
- **Message Queue**: RabbitMQ
- **Real-time**: Socket.IO for WebSocket connections
- **HTTP Client**: Axios for external API calls

## 📦 Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- npm or yarn

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd f1-telemetry-engine
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=f1_telemetry

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379

# RabbitMQ Configuration
RABBITMQ_URL=amqp://localhost:5672

# Application Configuration
PORT=3000
NODE_ENV=development
```

### 4. Start Infrastructure Services

Start PostgreSQL, Redis, RabbitMQ, and pgAdmin using Docker Compose:

```bash
docker-compose up -d
```

This will start:
- **PostgreSQL** on port `5432`
- **Redis** on port `6379`
- **RabbitMQ** on port `5672` (Management UI: `15672`)
- **pgAdmin** on port `5050` (Email: admin@admin.com, Password: admin)

## 🎯 Running the Application

### Development Mode

```bash
# Watch mode with auto-reload
npm run start:dev
```

### Production Mode

```bash
# Build the application
npm run build

# Run production build
npm run start:prod
```

### Debug Mode

```bash
npm run start:debug
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov

# Watch mode
npm run test:watch
```

## 📡 API Endpoints

### Telemetry

- `GET /telemetry` - Get all telemetry data
- `GET /telemetry/:id` - Get specific telemetry entry
- `POST /telemetry` - Create telemetry entry

### Drivers

- `GET /drivers` - Get all drivers
- `GET /drivers/:id` - Get specific driver
- `POST /drivers` - Create driver

### Races

- `GET /races` - Get all races
- `GET /races/:id` - Get specific race
- `POST /races` - Create race

## 🔌 WebSocket Events

Connect to the WebSocket server at `ws://localhost:3000`

### Client Events

```javascript
// Connect to the server
const socket = io('http://localhost:3000');

// Listen for telemetry updates
socket.on('telemetry-update', (data) => {
  console.log('Telemetry data:', data);
});
```

### Server Events

- `telemetry-update` - Real-time telemetry data updates
- `driver-status` - Driver status changes
- `race-update` - Race information updates

## 🎨 Testing the WebSocket Connection

A test client is provided in `client.html`. Open it in your browser to:

1. Connect to the WebSocket server
2. View real-time telemetry updates
3. Test the connection status

## 📊 Database Schema

### Main Entities

- **Driver**: F1 driver information
- **Race**: Race session data
- **Telemetry**: Real-time telemetry logs

## 🔧 Development Tools

### Code Formatting

```bash
npm run format
```

### Linting

```bash
npm run lint
```

## 🐳 Docker Services

### Access Management Interfaces

- **pgAdmin**: http://localhost:5050
  - Email: admin@admin.com
  - Password: admin

- **RabbitMQ Management**: http://localhost:15672
  - Username: guest
  - Password: guest

### Stop Services

```bash
docker-compose down
```

### Clean Up (Remove volumes)

```bash
docker-compose down -v
```

## 📈 Performance Optimization

- **Redis Caching**: Frequently accessed data is cached
- **Message Queue**: Asynchronous processing with RabbitMQ
- **Database Indexing**: Optimized queries with TypeORM
- **Connection Pooling**: Efficient database connections

## 🔒 Security Considerations

- Environment variables for sensitive data
- Validation pipes for input sanitization
- CORS configuration for API security
- Type-safe database queries with TypeORM

## 🚧 Troubleshooting

### Common Issues

**Database Connection Errors**
```bash
# Ensure PostgreSQL is running
docker-compose ps

# Check database logs
docker-compose logs postgres
```

**Redis Connection Issues**
```bash
# Verify Redis is running
docker-compose logs redis
```

**RabbitMQ Connection Problems**
```bash
# Check RabbitMQ status
docker-compose logs rabbitmq
```

## 📚 Project Structure

```
src/
├── app.module.ts           # Root application module
├── main.ts                 # Application entry point
├── drivers/                # Driver management module
├── races/                  # Race management module
├── telemetry/              # Telemetry processing module
│   ├── telemetry.controller.ts
│   ├── telemetry.service.ts
│   ├── telemetry.gateway.ts
│   └── telemetry.module.ts
└── ingestion/              # Data ingestion module
    ├── ingestion.service.ts
    └── ingestion.module.ts
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the UNLICENSED license.

## 🙏 Acknowledgments

- Built with [NestJS](https://nestjs.com/)
- Powered by [TypeORM](https://typeorm.io/)
- Real-time communication via [Socket.IO](https://socket.io/)

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Check the [NestJS Documentation](https://docs.nestjs.com)
- Review the [TypeORM Documentation](https://typeorm.io)

---

**Made with ❤️ for Formula 1 enthusiasts**
