# Docker Setup Guide

This project is now configured to run with Docker Compose. Each service has its own folder containing its Docker configuration files.

## Project Structure

```
project 2.0/
├── docker-compose.yml          # Main orchestration file
├── frontend/                   # Frontend service
│   ├── Dockerfile              # Production Dockerfile
│   ├── Dockerfile.dev          # Development Dockerfile
│   ├── nginx.conf              # Nginx configuration
│   └── .dockerignore           # Docker ignore patterns
└── ...                         # Application source code
```

## Prerequisites

- Docker Desktop (or Docker Engine + Docker Compose)
- Docker Compose v2 (usually included with Docker Desktop)

## Quick Start

### Production Build

1. **Build and run the application:**
   ```bash
   docker-compose up --build
   ```

2. **Access the application:**
   - Open your browser and navigate to `http://localhost:8080`

3. **Run in detached mode (background):**
   ```bash
   docker-compose up -d --build
   ```

4. **Stop the application:**
   ```bash
   docker-compose down
   ```

### Development Mode

To run in development mode with hot-reload, uncomment the `frontend-dev` service in `docker-compose.yml` and comment out the `frontend` service, then run:

```bash
docker-compose up --build
```

## Environment Variables

The application uses Supabase environment variables. You can set them in two ways:

### Option 1: Using .env file (Recommended)

Create a `.env` file in the project root with:

```env
VITE_SUPABASE_URL=https://afyhkxiiiloxrxkdmldc.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_key_here
VITE_SUPABASE_PROJECT_ID=afyhkxiiiloxrxkdmldc
```

### Option 2: Using default values

The docker-compose.yml file includes default values, so it will work out of the box with the existing Supabase configuration.

## Available Commands

- `docker-compose up` - Start the services
- `docker-compose up --build` - Rebuild and start services
- `docker-compose up -d` - Start in detached mode
- `docker-compose down` - Stop and remove containers
- `docker-compose ps` - List running containers
- `docker-compose logs` - View logs
- `docker-compose logs -f` - Follow logs in real-time

## Troubleshooting

### Port already in use

If port 8080 is already in use, modify the port mapping in `docker-compose.yml`:

```yaml
ports:
  - "3000:80"  # Change 8080 to your preferred port
```

### Rebuild after dependency changes

If you modify `package.json`, rebuild the image:

```bash
docker-compose build --no-cache
docker-compose up
```

### View container logs

```bash
docker-compose logs frontend
```

### Access container shell

```bash
docker-compose exec frontend sh
```

