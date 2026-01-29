# AIMS Clone Setup Guide

This guide will help you set up and run the AIMS Clone project on your local machine.

---

## Requirements

Before starting, ensure you have the following installed on your system:

1. **Docker**: [Install Docker](https://docs.docker.com/get-docker/)
2. **Node.js**: [Install Node.js](https://nodejs.org/) (v16 or later recommended)
3. **pnpm**: [Install pnpm](https://pnpm.io/installation)
4. **PostgreSQL**: [Install PostgreSQL](https://www.postgresql.org/download/)

---

## Setup Instructions

### Step 1: Clone the Repository

```bash
git clone https://github.com/rit3sh-x/aims-clone.git
cd aims-clone
```

---

### Step 2: Start Docker Containers

Run the following command to start the required services (e.g., PostgreSQL, MinIO):

```bash
docker compose up -d
```

---

### Step 3: Configure Environment Variables

You need to set up the `.env` files for the following directories:

#### 1. Database Service: `/packages/db/.env`

Copy the example file:
```bash
cp packages/db/.env.example packages/db/.env
```

Update the `DATABASE_URL` with your PostgreSQL credentials:
```env
DATABASE_URL=postgresql://your_user:your_password@localhost:5432/your_database
```

#### 2. Authentication Service: `/packages/auth/.env`

Copy the example file:
```bash
cp packages/auth/.env.example packages/auth/.env
```

Update the following fields in the `.env` file:
- `DATABASE_URL`: Your PostgreSQL connection string
- `S3_BUCKET`, `S3_ACCESS_KEY`, `S3_SECRET_KEY`: Your MinIO/S3 credentials
- `BETTER_AUTH_SECRET`: Generate a secret (see Step 6)
- `ALLOWED_EMAIL_DOMAINS`: Add allowed email domains (e.g., `"yourdomain.com,gmail.com"`)

#### 3. Web Application: `/apps/web/.env`

Copy the example file:
```bash
cp apps/web/.env.example apps/web/.env
```

Update the following fields in the `.env` file:
- `DATABASE_URL`: Your PostgreSQL connection string
- `BETTER_AUTH_SECRET`: Will be generated in Step 6
- `NEXT_PUBLIC_APP_URL`: Base URL (e.g., `http://localhost:3000`)
- `S3_BUCKET`, `S3_ACCESS_KEY`, `S3_SECRET_KEY`: Your MinIO/S3 credentials
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`: SMTP server configuration
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`: Google OAuth credentials
- `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD`, `SEED_ADMIN_NAME`: Admin credentials for seeding
- `ALLOWED_EMAIL_DOMAINS`: Add allowed email domains (e.g., `"yourdomain.com,gmail.com"`)

---

### Step 4: Install Dependencies

Install all project dependencies:

```bash
pnpm install
```

---

### Step 5: Generate Prisma Client

Run the following command to generate the Prisma client for the database:

```bash
pnpm -F db generate
```

---

### Step 6: Run Database Migrations

Apply database migrations to set up your database schema:

```bash
pnpm -F db migrate
```

---

### Step 7: Seed Admin User

Seed the admin user into the database:

```bash
pnpm -F web seed:admin
```

---

### Step 8: Generate Authentication Secret

Generate the authentication secret and update your `.env` files:

```bash
pnpm -F web gen:auth-secret
```

Copy the generated secret to `BETTER_AUTH_SECRET` in both `/apps/web/.env` and `/packages/auth/.env`.

---

### Step 9 (Optional): Seed Database

Seed the adata into the database:

```bash
pnpm -F web seed:data
```

---

### Step 10: Start the Development Server

Start the development server:

```bash
pnpm -F web dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

---

## Additional Commands

### Run All Workspaces in Dev Mode
```bash
turbo dev
```

### Build the Project
```bash
turbo build
```

### Clean All Build Artifacts
```bash
turbo clean
```

---

## Notes

- Ensure that all required services (PostgreSQL, MinIO) are running via Docker before starting the application
- Use the `.env.example` files as a reference for configuring your environment variables
- For production deployment, use secure and unique values for all secrets and credentials
- The default admin credentials are set in the `SEED_ADMIN_*` variables in `/apps/web/.env`

---
