# Tanso

Node version 23.6.1

## Setup

1. Navigate to the `/docker` directory in the project
2. Start the Docker containers:
```sh
docker compose up
```

3. Update your `DATABASE_URL` in the environment variables to:
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/tanso
```

4. Generate Prisma client:
```sh
npx prisma generate
```

5. Push the database schema:
```sh
npx prisma db push
```

You're good to go! 🎉
