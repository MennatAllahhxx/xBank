# xBank

A modern banking API built with TypeScript, Express, TypeORM, and PostgreSQL, following clean architecture principles.

## Technologies

- Node.js
- TypeScript
- Express
- PostgreSQL
- TypeORM
- Docker & Docker Compose
- tsyringe (Dependency Injection)

## Project Structure

The project follows clean architecture principles with distinct layers:

```
src/
├── application/       # Application services
├── core/              # Domain entities and interfaces
├── infrastructure/    # Database, ORM entities, repositories
└── presentation/      # Controllers and routes
```

## Installation

1. Clone the repository
2. Create a [`.env`](.env ) file in the root directory with the following variables:
   ```
   PORT=3000
   POSTGRES_USER=youruser
   POSTGRES_PASSWORD=yourpassword
   POSTGRES_DB=xbank
   POSTGRES_HOST=localhost
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

### Development Mode
```bash
# Run database
docker-compose up -d postgres

# Start the application in development mode
npm run dev
```

### Production Mode
```bash
# Build the application
npm run build

# Start the application
npm start
```

### Docker
```bash
# Run docker compose development file
docker compose -f docker-compose.dev.yml up 

# Run docker compose production file
docker compose up 
```

## Database

### Migrations

```bash
# Generate a new migration
npm run migration:gen

# Sync migrations
npm run migration:sync

# Drop migrations
npm run migration:drop
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.