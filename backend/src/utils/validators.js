/**
 * Backend Validation Utilities
 * Ensures data consistency and authorization
 */

import supabase from '../config/supabase.js';

/**
 * Validate that a teacher is assigned to a subject in a specific class
 */
export async function validateTeacherSubjectClass(teacherId, subjectId, classId) {
  try {
    const { data, error } = await supabase
      .from('teacher_subjects')
      .select('*')
      .eq('teacher_id', teacherId)
      .eq('subject_id', subjectId)
      .eq('class_id', classId)
      .maybeSingle();

    if (error) {
      console.error('validateTeacherSubjectClass error:', error);
      throw error;
    }

    if (!data) {
      const err = new Error('Teacher is not assigned to this subject in this class');
      err.status = 403;
      throw err;
    }

    return true;
  } catch (error) {
    throw error;
  }
}

/**
 * Validate that a student is enrolled in a subject
 */
export async function validateStudentSubject(studentId, subjectId) {
  try {
    const { data, error } = await supabase
      .from('student_subjects')
      .select('*')
      .eq('student_id', studentId)
      .eq('subject_id', subjectId)
      .maybeSingle();

    if (error) {
      console.error('validateStudentSubject error:', error);
      throw error;
    }

    if (!data) {
      const err = new Error('Student is not enrolled in this subject');
      err.status = 403;
      throw err;
    }

    return true;
  } catch (error) {
    throw error;
  }
}

/**
 * Validate that a student belongs to a class
 */
export async function validateStudentClass(studentId, classId) {
  try {
    const { data, error } = await supabase
      .from('students')
      .select('class_id')
      .eq('id', studentId)
      .single();

    if (error) {
      console.error('validateStudentClass error:', error);
      throw error;
    }

    if (data.class_id !== classId) {
      const err = new Error('Student does not belong to this class');
      err.status = 403;
      throw err;
    }

    return true;
  } catch (error) {
    throw error;
  }
}

/**
 * Validate that a subject belongs to a major
 */
export async function validateSubjectMajor(subjectId, majorId) {
  try {
    const { data, error } = await supabase
      .from('subjects')
      .select('major_id')
      .eq('id', subjectId)
      .single();

    if (error) {
      console.error('validateSubjectMajor error:', error);
      throw error;
    }

    if (data.major_id !== majorId) {
      const err = new Error('Subject does not belong to this major');
      err.status = 403;
      throw err;
    }

    return true;
  } catch (error) {
    throw error;
  }
}

/**
 * Check if a timetable slot is available (no conflicts)
 */
export async function checkTimetableConflict(classId, dayOfWeek, startTime, endTime, excludeId = null) {
  try {
    let query = supabase
      .from('timetables')
      .select('*')
      .eq('class_id', classId)
      .eq('day_of_week', dayOfWeek)
      .or(`and(start_time.lte.${startTime},end_time.gt.${startTime}),and(start_time.lt.${endTime},end_time.gte.${endTime})`);

    if (excludeId) {
      query = query.neq('id', excludeId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('checkTimetableConflict error:', error);
      throw error;
    }

    if (data && data.length > 0) {
      const err = new Error('Timetable conflict: This time slot is already occupied for this class');
      err.status = 409;
      throw err;
    }

    return true;
  } catch (error) {
    throw error;
  }
}

/**
 * Check if a teacher has a conflict at this time
 */
export async function checkTeacherTimeConflict(teacherId, dayOfWeek, startTime, endTime, excludeId = null) {
  try {
    let query = supabase
      .from('timetables')
      .select('*')
      .eq('teacher_id', teacherId)
      .eq('day_of_week', dayOfWeek)
      .or(`and(start_time.lte.${startTime},end_time.gt.${startTime}),and(start_time.lt.${endTime},end_time.gte.${endTime})`);

    if (excludeId) {
      query = query.neq('id', excludeId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('checkTeacherTimeConflict error:', error);
      throw error;
    }

    if (data && data.length > 0) {
      const err = new Error('Teacher conflict: This teacher is already scheduled at this time');
      err.status = 409;
      throw err;
    }

    return true;
  } catch (error) {
    throw error;
  }
}

/**
 * Verify ownership - School can only manage their own resources
 */
export async function verifySchoolOwnership(userId, schoolId) {
  try {
    const { data, error } = await supabase
      .from('schools')
      .select('user_id')
      .eq('id', schoolId)
      .single();

    if (error) {
      console.error('verifySchoolOwnership error:', error);
      throw error;
    }

    if (data.user_id !== userId) {
      const err = new Error('Unauthorized: You can only manage your own school resources');
      err.status = 403;
      throw err;
    }

    return true;
  } catch (error) {
    throw error;
  }
}

/**
 * Verify teacher belongs to school
 */
export async function verifyTeacherSchool(teacherId, schoolId) {
  try {
    const { data, error } = await supabase
      .from('teachers')
      .select('school_id')
      .eq('id', teacherId)
      .single();

    if (error) {
      console.error('verifyTeacherSchool error:', error);
      throw error;
    }

    if (data.school_id !== schoolId) {
      const err = new Error('Unauthorized: Teacher does not belong to this school');
      err.status = 403;
      throw err;
    }

    return true;
  } catch (error) {
    throw error;
  }
}

/**
 * Verify student belongs to school
 */
export async function verifyStudentSchool(studentId, schoolId) {
  try {
    const { data, error } = await supabase
      .from('students')
      .select('school_id')
      .eq('id', studentId)
      .single();

    if (error) {
      console.error('verifyStudentSchool error:', error);
      throw error;
    }

    if (data.school_id !== schoolId) {
      const err = new Error('Unauthorized: Student does not belong to this school');
      err.status = 403;
      throw err;
    }

    return true;
  } catch (error) {
    throw error;
  }
}

/**
 * Check for duplicate attendance
 */
export async function checkDuplicateAttendance(studentId, subjectId, date) {
  try {
    const { data, error } = await supabase
      .from('attendance')
      .select('*')
      .eq('student_id', studentId)
      .eq('subject_id', subjectId)
      .eq('date', date)
      .maybeSingle();

    if (error) {
      console.error('checkDuplicateAttendance error:', error);
      throw error;
    }

    if (data) {
      const err = new Error('Attendance already recorded for this student, subject, and date');
      err.status = 409;
      throw err;
    }

    return true;
  } catch (error) {
    throw error;
  }
}

export default {
  validateTeacherSubjectClass,
  validateStudentSubject,
  validateStudentClass,
  validateSubjectMajor,
  checkTimetableConflict,
  checkTeacherTimeConflict,
  verifySchoolOwnership,
  verifyTeacherSchool,
  verifyStudentSchool,
  checkDuplicateAttendance
};
