# S2G Frontend

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

## Getting Started

### Cloning the Repository

To get started with this project, first clone the repository to your local machine:

```bash
git clone https://github.com/jazrobot/s2g-frontend.git
cd s2g-frontend
```

## Installation and Setup

### Prerequisites

Before you begin, ensure you have the following installed on your system:

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/) (included with Docker Desktop for Windows and Mac)

### Technologies Used

This project is built with the following technologies:

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Tailwind CSS](https://tailwindcss.com)

## Running the Application

### Environment Variables

Before running the application, you need to set up your environment variables:

1. Copy the example environment file to create a new `.env` file:

```bash
cp .env.example .env
```

2. Edit the `.env` file and update the following variables:

```
AUTH_SECRET=your_secure_secret_here
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000  # URL to your backend API
```

### Option 1: Using Docker Compose (Recommended)

The easiest way to run the application is using Docker Compose:

1. Build and start the container:

```bash
docker-compose up -d
```

2. The application will be available at [http://localhost:3000](http://localhost:3000)

3. To stop the application:

```bash
docker-compose down
```

### Option 2: Using Docker Directly

You can also build and run the Docker container manually:

1. Build the Docker image:

```bash
docker build -t s2g-frontend .
```

2. Run the container:

```bash
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  -e AUTH_SECRET=your_secure_secret_here \
  -e NEXT_PUBLIC_BACKEND_URL=http://localhost:8000 \
  s2g-frontend
```

3. The application will be available at [http://localhost:3000](http://localhost:3000)

## Development

For local development without Docker, refer to these commands:

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```
