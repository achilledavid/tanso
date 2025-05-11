# Tanso

Node version 23.6.1

## Setup

1. Open the project in a development container:
    - Ensure you have the Dev Containers extension installed in your editor.
    - Open the project folder and select "Reopen in Container" from the command palette.

2. The development container will automatically set up the environment, including starting the necessary services.

3. Update your `DATABASE_URL` in the environment variables to:
```
postgresql://postgres:postgres@database:5432/tanso
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
