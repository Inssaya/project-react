import supabase from '../../config/supabase.js';
import { validateTeacherSubjectClass } from '../../utils/validators.js';
import * as model from './grade.model.js';

export const createGrade = async (payload) => {
  const { student_id, subject_id, teacher_id, semester, grade, comments } = payload;

  // Validate required fields
  if (!student_id || !subject_id || !teacher_id || !semester || grade === undefined) {
    const error = new Error('Missing required fields: student_id, subject_id, teacher_id, semester, grade are required');
    error.status = 400;
    throw error;
  }

  // Validate grade range (0-20)
  if (grade < 0 || grade > 20) {
    const error = new Error('Grade must be between 0 and 20');
    error.status = 400;
    throw error;
  }

  // Validate that the teacher is assigned to teach this subject to this class
  // First get student's class
  const { data: student, error: studentError } = await supabase
    .from('students')
    .select('class_id')
    .eq('id', student_id)
    .single();

  if (studentError || !student) {
    const error = new Error('Student not found');
    error.status = 404;
    throw error;
  }

  // Validate teacher-subject-class relationship
  await validateTeacherSubjectClass(teacher_id, subject_id, student.class_id);

  // Check if grade already exists for this student, subject, and semester
  const { data: existingGrade, error: existingError } = await supabase
    .from('grades')
    .select('id')
    .eq('student_id', student_id)
    .eq('subject_id', subject_id)
    .eq('semester', semester)
    .maybeSingle();

  if (existingGrade) {
    const error = new Error('Grade already exists for this student, subject, and semester');
    error.status = 409;
    throw error;
  }

  const { data, error } = await model.create(payload);
  if (error) throw error;
  return data;
};

export const listGrades = async () => {
  const { data, error } = await model.list();
  if (error) throw error;
  return data;
};

export const getGrade = async (id) => {
  const { data, error } = await model.findById(id);
  if (error) throw error;
  return data;
};

export const updateGrade = async (id, changes) => {
  const { data, error } = await model.updateById(id, changes);
  if (error) throw error;
  return data;
};

export const deleteGrade = async (id) => {
  const { data, error } = await model.removeById(id);
  if (error) throw error;
  return data;
};

export default { createGrade, listGrades, getGrade, updateGrade, deleteGrade };