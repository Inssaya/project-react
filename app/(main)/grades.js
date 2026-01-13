// Record Grades Screen - Guided flow with validation and bulk entry
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Pressable, TextInput, View } from "react-native";
import {
    Avatar,
    Badge,
    Button,
    Card,
    Empty,
    ErrorBanner,
    Header,
    Screen,
    Select,
    Subtitle,
    SuccessBanner,
    Text
} from "../../src/components/ui";
import { api, auth } from "../../src/lib";

const GRADE_CONFIG = {
  MIN: 0,
  MAX: 20,
  PASS: 10,
};

export default function RecordGradesScreen() {
  const router = useRouter();

  // Selection state
  const [classId, setClassId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [semester, setSemester] = useState("");
  const [examType, setExamType] = useState("");

  // Data state
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState({});
  const [comments, setComments] = useState({});

  // UI state
  const [step, setStep] = useState(1); // 1: Select, 2: Enter, 3: Review
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [classesRes, subjectsRes] = await Promise.all([
        api.classes.list(),
        api.subjects.list(),
      ]);
      setClasses(classesRes.data || []);
      setSubjects(subjectsRes.data || []);
    } catch (err) {
      setError("Failed to load data");
    } finally {
      setLoadingData(false);
    }
  };

  const loadStudents = async () => {
    if (!classId) {
      setError("Please select a class");
      return;
    }

    if (!subjectId) {
      setError("Please select a subject");
      return;
    }

    if (!semester) {
      setError("Please select a semester");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await api.classes.students(classId);
      const studentsList = response.data || [];
      setStudents(studentsList);

      // Initialize grades
      const initialGrades = {};
      const initialComments = {};
      studentsList.forEach((student) => {
        initialGrades[student.id] = "";
        initialComments[student.id] = "";
      });
      setGrades(initialGrades);
      setComments(initialComments);
      setValidationErrors({});

      setStep(2);
    } catch (err) {
      setError(err.message || "Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const updateGrade = (studentId, value) => {
    // Only allow numbers and decimal point
    const cleanValue = value.replace(/[^0-9.]/g, "");

    setGrades({ ...grades, [studentId]: cleanValue });

    // Validate
    if (cleanValue) {
      const numValue = parseFloat(cleanValue);
      if (isNaN(numValue)) {
        setValidationErrors({
          ...validationErrors,
          [studentId]: "Invalid number",
        });
      } else if (numValue < GRADE_CONFIG.MIN || numValue > GRADE_CONFIG.MAX) {
        setValidationErrors({
          ...validationErrors,
          [studentId]: `Grade must be ${GRADE_CONFIG.MIN}-${GRADE_CONFIG.MAX}`,
        });
      } else {
        const newErrors = { ...validationErrors };
        delete newErrors[studentId];
        setValidationErrors(newErrors);
      }
    } else {
      const newErrors = { ...validationErrors };
      delete newErrors[studentId];
      setValidationErrors(newErrors);
    }
  };

  const setAllGrades = (value) => {
    const newGrades = {};
    const newErrors = {};

    students.forEach((student) => {
      newGrades[student.id] = value;
    });

    // Validate bulk value
    if (value) {
      const numValue = parseFloat(value);
      if (isNaN(numValue) || numValue < GRADE_CONFIG.MIN || numValue > GRADE_CONFIG.MAX) {
        students.forEach((student) => {
          newErrors[student.id] = `Grade must be ${GRADE_CONFIG.MIN}-${GRADE_CONFIG.MAX}`;
        });
      }
    }

    setGrades(newGrades);
    setValidationErrors(newErrors);
  };

  const clearAllGrades = () => {
    const newGrades = {};
    students.forEach((student) => {
      newGrades[student.id] = "";
    });
    setGrades(newGrades);
    setValidationErrors({});
  };

  const getStats = () => {
    const filledGrades = Object.values(grades).filter(
      (g) => g !== "" && !isNaN(parseFloat(g))
    );
    const numericGrades = filledGrades.map((g) => parseFloat(g));

    const total = students.length;
    const filled = filledGrades.length;
    const missing = total - filled;
    const avg =
      numericGrades.length > 0
        ? (numericGrades.reduce((a, b) => a + b, 0) / numericGrades.length).toFixed(2)
        : "N/A";
    const passing = numericGrades.filter((g) => g >= GRADE_CONFIG.PASS).length;
    const failing = numericGrades.filter((g) => g < GRADE_CONFIG.PASS).length;

    return { total, filled, missing, avg, passing, failing };
  };

  const canProceedToReview = () => {
    // Check for validation errors
    if (Object.keys(validationErrors).length > 0) return false;

    // Check if at least one grade is filled
    const filledGrades = Object.values(grades).filter((g) => g !== "");
    return filledGrades.length > 0;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");

    try {
      const user = await auth.getCurrentUser();

      // Prepare grades for submission
      const gradesToSubmit = students
        .filter((student) => grades[student.id] !== "")
        .map((student) => ({
          student_id: student.id,
          subject_id: subjectId,
          teacher_id: user?.id,
          semester: semester,
          exam_type: examType || null,
          grade: parseFloat(grades[student.id]),
          comments: comments[student.id] || null,
        }));

      // Submit each grade
      for (const gradeData of gradesToSubmit) {
        await api.grades.record(gradeData);
      }

      setSuccess(`${gradesToSubmit.length} grades recorded successfully!`);
      setTimeout(() => {
        router.back();
      }, 2000);
    } catch (err) {
      setError(err.message || "Failed to submit grades");
    } finally {
      setSubmitting(false);
    }
  };

  const classOptions = classes.map((c) => ({
    label: `${c.name} (${c.school?.school_name || "No school"})`,
    value: c.id,
  }));

  const subjectOptions = subjects.map((s) => ({
    label: s.name,
    value: s.id,
  }));

  const semesterOptions = [
    { label: "Semester 1", value: "1" },
    { label: "Semester 2", value: "2" },
    { label: "Trimester 1", value: "T1" },
    { label: "Trimester 2", value: "T2" },
    { label: "Trimester 3", value: "T3" },
  ];

  const examTypeOptions = [
    { label: "Midterm Exam", value: "midterm" },
    { label: "Final Exam", value: "final" },
    { label: "Quiz", value: "quiz" },
    { label: "Assignment", value: "assignment" },
    { label: "Project", value: "project" },
  ];

  const getStudentName = (student) => {
    const firstName = student.first_name || student.user?.first_name || "";
    const lastName = student.last_name || student.user?.last_name || "";
    return `${firstName} ${lastName}`.trim() || "Unknown";
  };

  const getGradeColor = (grade) => {
    if (!grade || grade === "") return "surface";
    const numGrade = parseFloat(grade);
    if (isNaN(numGrade)) return "surface";
    if (numGrade >= 16) return "success";
    if (numGrade >= GRADE_CONFIG.PASS) return "primary";
    if (numGrade >= 8) return "warning";
    return "danger";
  };

  // Step 1: Select context
  if (step === 1) {
    return (
      <Screen keyboard>
        <Header title="Record Grades" subtitle="Step 1: Select Context" showBack />

        <View className="px-4 pt-6">
          <Card className="mb-6">
            <View className="flex-row items-center">
              <View className="w-12 h-12 bg-primary-100 rounded-full items-center justify-center">
                <Ionicons name="ribbon" size={24} color="#3B82F6" />
              </View>
              <View className="ml-4 flex-1">
                <Text className="font-semibold">Enter Student Grades</Text>
                <Subtitle className="text-sm">
                  Select class, subject, and semester to begin
                </Subtitle>
              </View>
            </View>
          </Card>

          <ErrorBanner message={error} onDismiss={() => setError("")} />

          <Select
            label="Class"
            value={classId}
            onValueChange={setClassId}
            options={classOptions}
            placeholder="Select a class"
            disabled={loadingData}
            required
          />

          <Select
            label="Subject"
            value={subjectId}
            onValueChange={setSubjectId}
            options={subjectOptions}
            placeholder="Select a subject"
            disabled={loadingData}
            required
          />

          <Select
            label="Semester"
            value={semester}
            onValueChange={setSemester}
            options={semesterOptions}
            placeholder="Select semester"
            required
          />

          <Select
            label="Exam Type"
            value={examType}
            onValueChange={setExamType}
            options={examTypeOptions}
            placeholder="Select exam type (optional)"
          />

          <Button
            onPress={loadStudents}
            loading={loading}
            fullWidth
            size="lg"
            disabled={!classId || !subjectId || !semester}
            className="mt-4"
          >
            Continue to Enter Grades
          </Button>
        </View>
      </Screen>
    );
  }

  // Step 2: Enter grades
  if (step === 2) {
    const stats = getStats();

    return (
      <Screen padded={false} scroll={false}>
        <Header
          title="Enter Grades"
          subtitle={`${stats.filled}/${stats.total} entered`}
          showBack
          onBack={() => setStep(1)}
        />

        {/* Quick Actions */}
        <View className="px-4 py-3 bg-surface-100">
          <View className="flex-row items-center justify-between">
            <Text className="text-sm font-medium text-surface-600">Quick Actions:</Text>
            <View className="flex-row space-x-2">
              <Pressable
                onPress={() => setAllGrades("20")}
                className="bg-success-100 px-3 py-1.5 rounded-full"
              >
                <Text className="text-success-600 text-xs font-medium">All 20</Text>
              </Pressable>
              <Pressable
                onPress={() => setAllGrades("10")}
                className="bg-primary-100 px-3 py-1.5 rounded-full"
              >
                <Text className="text-primary-600 text-xs font-medium">All 10</Text>
              </Pressable>
              <Pressable
                onPress={clearAllGrades}
                className="bg-surface-200 px-3 py-1.5 rounded-full"
              >
                <Text className="text-surface-600 text-xs font-medium">Clear</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Stats Bar */}
        <View className="px-4 py-2 bg-white border-b border-surface-200 flex-row justify-around">
          <View className="items-center">
            <Text className="text-success-500 font-bold">{stats.passing}</Text>
            <Text className="text-xs text-surface-500">Passing</Text>
          </View>
          <View className="items-center">
            <Text className="text-danger-500 font-bold">{stats.failing}</Text>
            <Text className="text-xs text-surface-500">Failing</Text>
          </View>
          <View className="items-center">
            <Text className="text-surface-500 font-bold">{stats.missing}</Text>
            <Text className="text-xs text-surface-500">Missing</Text>
          </View>
          <View className="items-center">
            <Text className="text-primary-500 font-bold">{stats.avg}</Text>
            <Text className="text-xs text-surface-500">Average</Text>
          </View>
        </View>

        <ErrorBanner message={error} onDismiss={() => setError("")} className="mx-4 mt-4" />

        {students.length === 0 ? (
          <Empty
            icon="people-outline"
            title="No students in this class"
            message="Add students to this class first"
          />
        ) : (
          <FlatList
            data={students}
            keyExtractor={(item) => item.id?.toString()}
            contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
            renderItem={({ item }) => {
              const gradeValue = grades[item.id];
              const gradeColor = getGradeColor(gradeValue);
              const hasError = validationErrors[item.id];

              return (
                <View className="bg-white border border-surface-200 rounded-xl p-4 mb-3">
                  <View className="flex-row items-center mb-3">
                    <Avatar name={getStudentName(item)} size="sm" />
                    <View className="flex-1 ml-3">
                      <Text className="font-medium">{getStudentName(item)}</Text>
                      <Subtitle className="text-xs">
                        {item.roll_number || "No roll number"}
                      </Subtitle>
                    </View>
                    {gradeValue && !hasError && (
                      <Badge variant={gradeColor}>
                        {parseFloat(gradeValue) >= GRADE_CONFIG.PASS ? "PASS" : "FAIL"}
                      </Badge>
                    )}
                  </View>

                  <View className="flex-row items-center space-x-3">
                    <View className="flex-1">
                      <TextInput
                        value={gradeValue}
                        onChangeText={(text) => updateGrade(item.id, text)}
                        placeholder="0-20"
                        keyboardType="decimal-pad"
                        className={`
                          bg-surface-50 border rounded-lg px-4 py-3 text-center text-lg font-semibold
                          ${hasError ? "border-danger-500" : "border-surface-300"}
                        `}
                        maxLength={5}
                      />
                      {hasError && (
                        <Text className="text-danger-500 text-xs mt-1 text-center">
                          {hasError}
                        </Text>
                      )}
                    </View>
                    <View className="w-16 items-center">
                      <Text className="text-surface-400 text-sm">/ {GRADE_CONFIG.MAX}</Text>
                    </View>
                  </View>
                </View>
              );
            }}
          />
        )}

        {/* Bottom Action */}
        <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-surface-200 px-4 py-4">
          <Button
            onPress={() => setStep(3)}
            fullWidth
            size="lg"
            disabled={!canProceedToReview()}
          >
            Review & Submit ({stats.filled} grades)
          </Button>
        </View>
      </Screen>
    );
  }

  // Step 3: Review and submit
  const stats = getStats();
  const selectedClass = classes.find((c) => c.id === classId);
  const selectedSubject = subjects.find((s) => s.id === subjectId);

  return (
    <Screen>
      <Header
        title="Review Grades"
        subtitle="Step 3: Confirm & Submit"
        showBack
        onBack={() => setStep(2)}
      />

      <View className="px-4 pt-6">
        <SuccessBanner message={success} />
        <ErrorBanner message={error} onDismiss={() => setError("")} />

        {/* Summary Card */}
        <Card className="mb-6">
          <Text className="font-semibold text-lg mb-4">Grade Summary</Text>

          <View className="flex-row flex-wrap -mx-2">
            <View className="w-1/2 px-2 mb-4">
              <View className="bg-primary-50 rounded-lg p-4 items-center">
                <Ionicons name="school" size={28} color="#3B82F6" />
                <Text className="text-2xl font-bold text-primary-600 mt-2">
                  {stats.filled}
                </Text>
                <Text className="text-primary-600 text-sm">Grades Entered</Text>
              </View>
            </View>
            <View className="w-1/2 px-2 mb-4">
              <View className="bg-surface-100 rounded-lg p-4 items-center">
                <Ionicons name="calculator" size={28} color="#71717A" />
                <Text className="text-2xl font-bold text-surface-600 mt-2">
                  {stats.avg}
                </Text>
                <Text className="text-surface-600 text-sm">Average</Text>
              </View>
            </View>
            <View className="w-1/2 px-2">
              <View className="bg-success-50 rounded-lg p-4 items-center">
                <Ionicons name="checkmark-circle" size={28} color="#10B981" />
                <Text className="text-2xl font-bold text-success-600 mt-2">
                  {stats.passing}
                </Text>
                <Text className="text-success-600 text-sm">Passing</Text>
              </View>
            </View>
            <View className="w-1/2 px-2">
              <View className="bg-danger-50 rounded-lg p-4 items-center">
                <Ionicons name="close-circle" size={28} color="#EF4444" />
                <Text className="text-2xl font-bold text-danger-600 mt-2">
                  {stats.failing}
                </Text>
                <Text className="text-danger-600 text-sm">Failing</Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Details Card */}
        <Card className="mb-6">
          <Text className="font-semibold mb-3">Details</Text>
          <View className="space-y-2">
            <View className="flex-row items-center justify-between">
              <Subtitle>Class</Subtitle>
              <Text className="font-medium">{selectedClass?.name || "Unknown"}</Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Subtitle>Subject</Subtitle>
              <Text className="font-medium">{selectedSubject?.name || "Unknown"}</Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Subtitle>Semester</Subtitle>
              <Text className="font-medium">
                {semesterOptions.find((s) => s.value === semester)?.label || semester}
              </Text>
            </View>
            {examType && (
              <View className="flex-row items-center justify-between">
                <Subtitle>Exam Type</Subtitle>
                <Text className="font-medium">
                  {examTypeOptions.find((e) => e.value === examType)?.label || examType}
                </Text>
              </View>
            )}
            <View className="flex-row items-center justify-between">
              <Subtitle>Total Students</Subtitle>
              <Text className="font-medium">{stats.total}</Text>
            </View>
          </View>
        </Card>

        {/* Warning for missing grades */}
        {stats.missing > 0 && (
          <View className="bg-warning-50 border border-warning-200 rounded-lg p-4 mb-6 flex-row items-center">
            <Ionicons name="warning" size={24} color="#F59E0B" />
            <View className="ml-3 flex-1">
              <Text className="text-warning-700 font-medium">Missing Grades</Text>
              <Text className="text-warning-600 text-sm">
                {stats.missing} student(s) don't have grades entered yet.
              </Text>
            </View>
          </View>
        )}

        <View className="flex-row space-x-3">
          <Button variant="secondary" onPress={() => setStep(2)} className="flex-1">
            Edit Grades
          </Button>
          <Button onPress={handleSubmit} loading={submitting} className="flex-1">
            Submit Grades
          </Button>
        </View>
      </View>
    </Screen>
  );
}
