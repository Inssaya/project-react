import { Router } from 'express';
import attendanceRoutes from '../modules/attendance/attendance.routes.js';
import authRoutes from '../modules/auth/auth.routes.js';
import classRoutes from '../modules/classes/class.routes.js';
import debugRoutes from '../modules/debug/debug.routes.js';
import schoolRoutes from '../modules/schools/school.routes.js';
import studentRoutes from '../modules/students/student.routes.js';
import teacherRoutes from '../modules/teachers/teacher.routes.js';
import userRoutes from '../modules/users/user.routes.js';
import majorRoutes from '../modules/majors/major.routes.js';
const router = Router();

// API root - quick index for testing
router.get('/', (req, res) => {
	res.json({
		success: true,
		message: 'MySchools API - available routes',
		routes: [
			'/api/auth',
			'/api/users',
			'/api/schools',
			'/api/classes',
			'/api/students',
			'/api/teachers',
			'/api/attendance',
		],
	});
});

router.use('/auth', authRoutes);
// expose admin user creation via users routes
router.use('/users', userRoutes);
router.use('/schools', schoolRoutes);
router.use('/classes', classRoutes);
router.use('/students', studentRoutes);
router.use('/teachers', teacherRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/debug', debugRoutes);
router.use('/majors', majorRoutes);
export default router;
