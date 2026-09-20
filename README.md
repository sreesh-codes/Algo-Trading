# Dubai 2035 — Algorithmic Trading Challenge

This repository contains the frontend and the secure authentication/administration backend for the Dubai 2035 Algorithmic Trading Challenge.

## Architecture

* **Frontend:** Next.js (App Router), React, Tailwind CSS, Framer Motion.
* **Backend:** Next.js API Routes, Prisma ORM.
* **Database:** PostgreSQL.
* **Authentication:** NextAuth.js (v4) with Google OAuth.
* **Authorization:** Strict role-based JWT sessions, Next.js Middleware, and server-side API guards (`requireAuth`, `requireCandidate`, `requireAdmin`).

## Prerequisites

* Node.js 18+
* PostgreSQL database

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Copy `.env.example` to `.env` and fill in the values:
   ```bash
   cp .env.example .env
   ```
   *Make sure to provide a valid `DATABASE_URL` pointing to your PostgreSQL instance, and configure your Google OAuth Client ID and Secret.*

3. **Database Migration**
   Push the schema to your database:
   ```bash
   npx prisma db push
   ```

4. **Bootstrap Admin Account**
   You cannot register an admin via the public UI. Use the bootstrap script:
   ```bash
   npx tsx scripts/create-admin.ts <ADMIN_BOOTSTRAP_SECRET>
   ```
   *This uses the secret from your `.env` file to securely promote the `ADMIN_EMAIL` account.*

5. **Run Development Server**
   ```bash
   npm run dev
   ```

## Authentication & Security Model

* **Candidates** register through `/register`, filling out their academic and personal details. The system creates a `PENDING` candidate profile. They then log in via Google OAuth.
* **Admins** log in via the hidden `/admin` or `/login` route, but their account must be pre-authorized via the bootstrap script.
* **Frontend Routing:** `src/middleware.ts` guards the frontend routes based on the JWT token.
* **Backend APIs:** All protected APIs in `src/app/api/` enforce security via independent `requireAdmin()` and `requireCandidate()` guards. The backend **never** trusts the frontend's assertion of user role.

## Directory Structure

* `/src/app/api/auth/*` - NextAuth setup and registration endpoints.
* `/src/app/api/admin/*` - Protected admin APIs.
* `/src/lib/auth/guards.ts` - Authorization logic.
* `/src/middleware.ts` - Frontend route protection.
* `/prisma/schema.prisma` - Database models.
* `/tests/` - Automated authorization test suites.

## Testing

Run the authorization tests to verify the security model:
```bash
npm run test
```
