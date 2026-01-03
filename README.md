# MySchools - School Management System

A full-stack school management application built with React Native (Expo) and Node.js/Express with Supabase backend.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- npm or yarn
- Expo CLI
- Supabase account

### Setup Instructions

1. **Install dependencies**
   ```bash
   npm install
   cd backend && npm install
   ```

2. **Configure Supabase**
   - Create a Supabase project at [supabase.com](https://supabase.com)
   - Copy `backend/.env` and add your Supabase credentials:
     ```env
     SUPABASE_URL=your_project_url
     SUPABASE_ANON_KEY=your_anon_key
     JWT_SECRET=your_secret_key
     PORT=3001
     ```

3. **Initialize Database**
   - Go to Supabase SQL Editor
   - Run the schema from `backend/src/database/schema.sql`

4. **Create Admin User**
   ```bash
   cd backend
   npm run create-admin
   ```

5. **Start Development**
   ```bash
   # Start both backend and frontend
   npm run start:all
   
   # Or separately:
   # Backend: cd backend && npm run dev
   # Frontend: npm start
   ```

## 📱 Features

✅ **Authentication & Authorization**
- Role-based access control (Admin, Teacher, Student)
- JWT-based authentication
- Secure password hashing

✅ **School Management**
- Create, read, update, delete schools
- Admin-only access

✅ **Class Management**
- Manage classes and assign teachers
- Link classes to schools

✅ **Student Management**
- Student profiles with roll numbers
- Class assignments

✅ **Teacher Management**
- Teacher profiles with subject assignments
- School associations

✅ **Attendance Tracking**
- Record daily attendance (Present, Absent, Late)
- Date-based tracking
- Teacher access

✅ **Modern UI**
- Clean, intuitive interface
- Loading states and error handling
- Role-based dashboards

## 🏗️ Architecture

### Backend (`/backend`)
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT
- **Structure**: Modular architecture with separate modules for each feature

### Frontend (`/app`)
- **Framework**: React Native with Expo
- **Navigation**: Expo Router
- **State**: React Hooks
- **Styling**: StyleSheet API

## 📖 Documentation

For detailed setup and usage instructions, see [SETUP.md](./SETUP.md)

## 🔧 Available Scripts

### Root Directory
- `npm start` - Start Expo development server
- `npm run start:backend` - Start backend server
- `npm run start:all` - Start both frontend and backend
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm run web` - Run on web browser

### Backend Directory
- `npm run dev` - Start backend with hot reload
- `npm start` - Start backend production mode
- `npm run create-admin` - Create admin user
- `npm test` - Run tests

## 🎯 Default Routes

### Frontend
- `/` - Redirects to Login
- `/Login` - Login screen
- `/Dashboard` - Main dashboard (after login)
- `/CreateSchool` - Create new school (Admin)
- `/CreateTeacher` - Create teacher profile (Admin)
- `/CreateStudent` - Create student profile (Admin)
- `/CreateClass` - Create new class (Teacher)
- `/RecordAttendance` - Record attendance (Teacher)

### Backend API
- `GET /` - Health check
- `GET /api` - API routes list
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration (Admin only)
- `/api/schools` - School endpoints
- `/api/classes` - Class endpoints
- `/api/students` - Student endpoints
- `/api/teachers` - Teacher endpoints
- `/api/attendance` - Attendance endpoints

## 🧪 Testing

Test the backend API:
```bash
cd backend
node test-api.js
```

## 🛠️ Tech Stack

**Frontend:**
- React Native
- Expo
- Expo Router
- AsyncStorage

**Backend:**
- Node.js
- Express.js
- Supabase
- JWT
- bcrypt
- Morgan (logging)

## 📝 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues or questions, please create an issue in the repository. 
"# project-react" 
