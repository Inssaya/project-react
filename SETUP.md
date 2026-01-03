# MySchools Setup Guide

## Overview
MySchools is a school management system with React Native (Expo) frontend and Node.js/Express backend using Supabase.

## Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Supabase account
- Expo CLI (for mobile development)

## Backend Setup

### 1. Configure Environment Variables
Edit `backend/.env`:
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key (optional but recommended)
JWT_SECRET=your_secure_jwt_secret_here
PORT=3001
```

### 2. Initialize Database Schema
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and run the contents of `backend/src/database/schema.sql`
4. This will create all necessary tables: users, schools, classes, students, teachers, attendance, profiles, etc.

### 3. Create Admin User
Run the admin creation script:
```bash
cd backend
npm install
npm run create-admin
```
Follow the prompts to create your first admin user.

### 4. Start Backend Server
```bash
cd backend
npm run dev
```
The backend will run on http://localhost:3001

## Frontend Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure API URL
Edit `app/config.js`:
```javascript
// For local development
export const BASE_URL = 'http://localhost:3001/api';

// For testing on physical device, use your computer's IP:
// export const BASE_URL = 'http://192.168.1.X:3001/api';
```

### 3. Start Expo Development Server
```bash
npm start
```

This will start the Expo development server. You can:
- Press `w` to open in web browser
- Press `i` to open in iOS simulator (Mac only)
- Press `a` to open in Android emulator
- Scan QR code with Expo Go app on your phone

## Quick Start (Both Frontend and Backend)
```bash
npm run start:all
```

## Application Structure

### Backend (`/backend`)
- `/src/modules` - Feature modules (auth, schools, classes, students, teachers, attendance)
- `/src/config` - Configuration files (Supabase, environment)
- `/src/middlewares` - Express middlewares (auth, error handling, logging)
- `/src/utils` - Utility functions
- `/scripts` - Helper scripts (create-admin)

### Frontend (`/app`)
- `/screens` - All application screens
- `config.js` - API configuration
- `_layout.tsx` - Root layout with navigation

## Features

### Implemented Features
✅ User Authentication (Login/Register)
✅ Role-based Access Control (Admin, Teacher, Student)
✅ School Management (CRUD)
✅ Class Management (CRUD)
✅ Student Management (CRUD)
✅ Teacher Management (CRUD)
✅ Attendance Recording
✅ Dashboard with role-specific actions

### User Roles
- **Admin**: Can create schools, teachers, students, and manage all resources
- **Teacher**: Can create classes, record attendance
- **Student**: Can view their information (UI limited currently)

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration (admin only)

### Schools
- `GET /api/schools` - List all schools
- `POST /api/schools` - Create school (admin only)
- `GET /api/schools/:id` - Get school details
- `PUT /api/schools/:id` - Update school
- `DELETE /api/schools/:id` - Delete school

### Classes
- `GET /api/classes` - List all classes
- `POST /api/classes` - Create class
- `GET /api/classes/:id` - Get class details
- `PUT /api/classes/:id` - Update class
- `DELETE /api/classes/:id` - Delete class

### Students
- `GET /api/students` - List all students
- `POST /api/students` - Create student
- `GET /api/students/:id` - Get student details
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

### Teachers
- `GET /api/teachers` - List all teachers
- `POST /api/teachers` - Create teacher
- `GET /api/teachers/:id` - Get teacher details
- `PUT /api/teachers/:id` - Update teacher
- `DELETE /api/teachers/:id` - Delete teacher

### Attendance
- `GET /api/attendance` - List attendance records
- `POST /api/attendance` - Record attendance
- `GET /api/attendance/:id` - Get attendance record
- `PUT /api/attendance/:id` - Update attendance
- `DELETE /api/attendance/:id` - Delete attendance

## Troubleshooting

### Backend Issues
1. **Cannot connect to Supabase**
   - Verify SUPABASE_URL and SUPABASE_ANON_KEY in backend/.env
   - Check if Supabase project is active

2. **Database tables not found**
   - Run the schema.sql file in Supabase SQL Editor
   - Ensure all tables are created

3. **Authentication fails**
   - Verify JWT_SECRET is set in backend/.env
   - Create admin user using `npm run create-admin`

### Frontend Issues
1. **Cannot connect to backend**
   - Check if backend is running on port 3001
   - Verify BASE_URL in app/config.js
   - For physical device, use your computer's IP address

2. **Expo won't start**
   - Clear cache: `npx expo start --clear`
   - Reinstall dependencies: `rm -rf node_modules && npm install`

3. **Login fails**
   - Ensure admin user exists in database
   - Check backend logs for errors
   - Verify network connection

## Default Test Credentials
After running `npm run create-admin`, use the credentials you created.

Example:
- Email: admin@example.com
- Password: [your password]

## Development Tips
1. Backend logs all requests and errors to console
2. Use `npm run dev` for backend hot-reload
3. Frontend uses Expo's Fast Refresh for instant updates
4. Check browser console (web) or terminal for error messages

## Production Deployment
1. Update backend environment variables for production
2. Build frontend: `npm run build` (if deploying as web)
3. Deploy backend to services like Heroku, Railway, or Vercel
4. Build mobile apps: `eas build` (requires Expo Application Services)

## Support
For issues or questions, check the code comments or create an issue in the repository.
