# MySchools - Backend

This folder contains the Node.js backend for the MySchools React Native app. It uses Express and Supabase.

## What I changed / added
- Added environment validation: `src/config/env.js`.
- Added Supabase client: `src/config/supabase.js`.
- Added database schema: `src/database/schema.sql`.
- Added utilities: `src/utils/response.js`, `src/utils/asyncHandler.js`, `src/utils/constants.js`.
- Added middlewares: `src/middlewares/auth.middleware.js`, `role.middleware.js`, `error.middleware.js`, `logger.middleware.js`.
- Implemented modules: `auth`, `users`, `schools`, `classes`, `students`, `teachers`, `attendance` (models, services, controllers, routes).
- Combined routes in `src/routes/index.js`.
- Added Jest tests: `src/tests/auth.test.js`.
- Updated `package.json` with scripts and dependencies.
- Ensured `src/app.js` uses the request logger and global error handler.

Every change is included in the workspace — copy/paste-ready.

## Dependencies to install
Run from `backend` folder:

```bash
npm install
```

This will install production and dev deps including `@supabase/supabase-js`, `bcrypt`, `jsonwebtoken`, `joi`, `jest`, and `supertest`.

## Environment variables
Create a `.env` file in `backend` with:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
JWT_SECRET=replace_with_secure_secret
PORT=3001
```

## Database setup / migrations
Use Supabase SQL editor or CLI to run `src/database/schema.sql` to create the tables.

## Run server
Start the app:

```bash
npm run start
```

For development with autorestart:

```bash
npm run dev
```

## Run tests

```bash
npm test
```

## API summary (important endpoints)

## Minimal Static Frontend (for quick testing)
I added a tiny static frontend served by the backend at `/app`. Files are in `backend/public`.

- `index.html` — links to pages
- `register.html` — register form
- `login.html` — login form (saves JWT to localStorage)
- `dashboard.html` — simple buttons to call protected endpoints (`/api/schools`, `/api/attendance`)

Open the UI on your phone by replacing `<YOUR_PC_LAN_IP>` with your machine IP and visiting:

```
http://<YOUR_PC_LAN_IP>:3001/app
```

Example: `http://192.168.1.42:3001/app`

Note: the static pages call the API endpoints added to the backend. Ensure the server is running and CORS is enabled (already configured).
## Notes & rationale

If you want, I can now:

## Recent fixes (Dec 29, 2025)
- Resolved duplicate declaration errors reported by the editor/TypeScript server:
	- Cleaned and consolidated `src/config/supabase.js` as the canonical Supabase client.
	- Re-exported the canonical client from `src/config/supabaseClient.js` and `src/supabaseClient.js` to avoid creating new `const supabase` declarations.
	- Fixed duplicate exports in `src/middlewares/error.middleware.js` (single `errorHandler`).
	- Fixed duplicate exports in `src/utils/asyncHandler.js` (single `asyncHandler`).
	- Consolidated `src/routes/index.js` router and re-exported it from `src/routes.js` to avoid duplicate `router` declarations.

Result of these fixes: the editor/TypeScript "Cannot redeclare block-scoped variable" errors should be resolved. The codebase now has a single source of truth for the Supabase client and unique named exports for handlers and routers.

If you still see redeclare errors in your editor, restart the TypeScript server / VS Code window to clear cached JS/TS diagnostics.

