// Record Attendance Screen - Guided flow with bulk actions
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Pressable, View } from "react-native";
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

const ATTENDANCE_STATUS = {
  PRESENT: "present",
  ABSENT: "absent",
  LATE: "late",
  EXCUSED: "excused",
};

export default function RecordAttendanceScreen() {
  const router = useRouter();
  
  // Selection state
  const [classId, setClassId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  
  // Data state
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  
  // UI state
  const [step, setStep] = useState(1); // 1: Select, 2: Mark, 3: Review
  const [loading, setLoading] = useState(false);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load classes on mount
  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      const response = await api.classes.list();
      setClasses(response.data || []);
    } catch (err) {
      setError("Failed to load classes");
    } finally {
      setLoadingClasses(false);
    }
  };

  const loadStudents = async () => {
    if (!classId) {
      setError("Please select a class");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await api.classes.students(classId);
      const studentsList = response.data || [];
      setStudents(studentsList);
      
      // Initialize attendance for all students as present
      const initialAttendance = {};
      studentsList.forEach((student) => {
        initialAttendance[student.id] = ATTENDANCE_STATUS.PRESENT;
      });
      setAttendance(initialAttendance);
      
      setStep(2);
    } catch (err) {
      setError(err.message || "Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = (studentId) => {
    const currentStatus = attendance[studentId];
    const statusOrder = [
      ATTENDANCE_STATUS.PRESENT,
      ATTENDANCE_STATUS.ABSENT,
      ATTENDANCE_STATUS.LATE,
      ATTENDANCE_STATUS.EXCUSED,
    ];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const nextIndex = (currentIndex + 1) % statusOrder.length;
    
    setAttendance({
      ...attendance,
      [studentId]: statusOrder[nextIndex],
    });
  };

  const markAllAs = (status) => {
    const newAttendance = {};
    students.forEach((student) => {
      newAttendance[student.id] = status;
    });
    setAttendance(newAttendance);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case ATTENDANCE_STATUS.PRESENT:
        return "success";
      case ATTENDANCE_STATUS.ABSENT:
        return "danger";
      case ATTENDANCE_STATUS.LATE:
        return "warning";
      case ATTENDANCE_STATUS.EXCUSED:
        return "primary";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case ATTENDANCE_STATUS.PRESENT:
        return "checkmark-circle";
      case ATTENDANCE_STATUS.ABSENT:
        return "close-circle";
      case ATTENDANCE_STATUS.LATE:
        return "time";
      case ATTENDANCE_STATUS.EXCUSED:
        return "document-text";
      default:
        return "help-circle";
    }
  };

  const getSummary = () => {
    const summary = {
      present: 0,
      absent: 0,
      late: 0,
      excused: 0,
    };
    
    Object.values(attendance).forEach((status) => {
      summary[status]++;
    });
    
    return summary;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");

    try {
      const user = await auth.getCurrentUser();
      
      const records = students.map((student) => ({
        student_id: student.id,
        class_id: classId,
        date: date,
        status: attendance[student.id],
        recorded_by: user?.id,
      }));

      await api.attendance.bulkRecord(records);
      
      setSuccess("Attendance recorded successfully!");
      setTimeout(() => {
        router.back();
      }, 2000);
    } catch (err) {
      setError(err.message || "Failed to submit attendance");
    } finally {
      setSubmitting(false);
    }
  };

  const classOptions = classes.map((c) => ({
    label: `${c.name} (${c.school?.name || "No school"})`,
    value: c.id,
  }));

  const getStudentName = (student) => {
    const firstName = student.first_name || student.user?.first_name || "";
    const lastName = student.last_name || student.user?.last_name || "";
    return `${firstName} ${lastName}`.trim() || "Unknown";
  };

  // Step 1: Select class and date
  if (step === 1) {
    return (
      <Screen>
        <Header title="Record Attendance" subtitle="Step 1: Select Class" showBack />

        <View className="px-4 pt-6">
          <Card className="mb-6">
            <View className="flex-row items-center">
              <View className="w-12 h-12 bg-success-50 rounded-full items-center justify-center">
                <Ionicons name="checkmark-done" size={24} color="#10B981" />
              </View>
              <View className="ml-4 flex-1">
                <Text className="font-semibold">Take Attendance</Text>
                <Subtitle className="text-sm">
                  Select a class and date to record attendance
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
            disabled={loadingClasses}
            required
          />

          <View className="mb-4">
            <Text className="text-surface-700 text-sm font-medium mb-1.5">
              Date <Text className="text-danger-500">*</Text>
            </Text>
            <Pressable
              className="bg-white border border-surface-300 rounded-lg px-4 py-3 flex-row items-center"
            >
              <Ionicons name="calendar-outline" size={20} color="#71717A" />
              <Text className="ml-3 text-surface-900">{date}</Text>
            </Pressable>
            <Subtitle className="text-xs mt-1">
              Using today's date. Date picker coming soon.
            </Subtitle>
          </View>

          <Button
            onPress={loadStudents}
            loading={loading}
            fullWidth
            size="lg"
            disabled={!classId}
          >
            Continue to Mark Attendance
          </Button>
        </View>
      </Screen>
    );
  }

  // Step 2: Mark attendance
  if (step === 2) {
    const summary = getSummary();

    return (
      <Screen padded={false} scroll={false}>
        <Header
          title="Mark Attendance"
          subtitle={`${students.length} students`}
          showBack
          onBack={() => setStep(1)}
        />

        {/* Quick Actions */}
        <View className="px-4 py-3 bg-surface-100 flex-row items-center justify-between">
          <Text className="text-sm font-medium text-surface-600">Quick Actions:</Text>
          <View className="flex-row space-x-2">
            <Pressable
              onPress={() => markAllAs(ATTENDANCE_STATUS.PRESENT)}
              className="bg-success-100 px-3 py-1.5 rounded-full"
            >
              <Text className="text-success-600 text-xs font-medium">All Present</Text>
            </Pressable>
            <Pressable
              onPress={() => markAllAs(ATTENDANCE_STATUS.ABSENT)}
              className="bg-danger-50 px-3 py-1.5 rounded-full"
            >
              <Text className="text-danger-600 text-xs font-medium">All Absent</Text>
            </Pressable>
          </View>
        </View>

        {/* Summary Bar */}
        <View className="px-4 py-2 bg-white border-b border-surface-200 flex-row justify-around">
          <View className="items-center">
            <Text className="text-success-500 font-bold">{summary.present}</Text>
            <Text className="text-xs text-surface-500">Present</Text>
          </View>
          <View className="items-center">
            <Text className="text-danger-500 font-bold">{summary.absent}</Text>
            <Text className="text-xs text-surface-500">Absent</Text>
          </View>
          <View className="items-center">
            <Text className="text-warning-500 font-bold">{summary.late}</Text>
            <Text className="text-xs text-surface-500">Late</Text>
          </View>
          <View className="items-center">
            <Text className="text-primary-500 font-bold">{summary.excused}</Text>
            <Text className="text-xs text-surface-500">Excused</Text>
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
              const status = attendance[item.id];
              const statusColor = getStatusColor(status);
              const statusIcon = getStatusIcon(status);

              return (
                <Pressable
                  onPress={() => toggleStatus(item.id)}
                  className="bg-white border border-surface-200 rounded-xl p-4 mb-3 flex-row items-center"
                >
                  <Avatar name={getStudentName(item)} size="md" />
                  <View className="flex-1 ml-3">
                    <Text className="font-medium">{getStudentName(item)}</Text>
                    <Subtitle className="text-sm">
                      {item.roll_number || "No roll number"}
                    </Subtitle>
                  </View>
                  <Badge variant={statusColor}>
                    <View className="flex-row items-center">
                      <Ionicons
                        name={statusIcon}
                        size={14}
                        color={
                          statusColor === "success"
                            ? "#10B981"
                            : statusColor === "danger"
                            ? "#EF4444"
                            : statusColor === "warning"
                            ? "#F59E0B"
                            : "#3B82F6"
                        }
                      />
                      <Text className="ml-1 uppercase text-xs">{status}</Text>
                    </View>
                  </Badge>
                </Pressable>
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
            disabled={students.length === 0}
          >
            Review & Submit
          </Button>
        </View>
      </Screen>
    );
  }

  // Step 3: Review and submit
  const summary = getSummary();

  return (
    <Screen>
      <Header
        title="Review Attendance"
        subtitle="Step 3: Confirm & Submit"
        showBack
        onBack={() => setStep(2)}
      />

      <View className="px-4 pt-6">
        <SuccessBanner message={success} />
        <ErrorBanner message={error} onDismiss={() => setError("")} />

        <Card className="mb-6">
          <Text className="font-semibold text-lg mb-4">Attendance Summary</Text>
          
          <View className="flex-row flex-wrap -mx-2">
            <View className="w-1/2 px-2 mb-4">
              <View className="bg-success-50 rounded-lg p-4 items-center">
                <Ionicons name="checkmark-circle" size={32} color="#10B981" />
                <Text className="text-2xl font-bold text-success-600 mt-2">
                  {summary.present}
                </Text>
                <Text className="text-success-600 text-sm">Present</Text>
              </View>
            </View>
            <View className="w-1/2 px-2 mb-4">
              <View className="bg-danger-50 rounded-lg p-4 items-center">
                <Ionicons name="close-circle" size={32} color="#EF4444" />
                <Text className="text-2xl font-bold text-danger-600 mt-2">
                  {summary.absent}
                </Text>
                <Text className="text-danger-600 text-sm">Absent</Text>
              </View>
            </View>
            <View className="w-1/2 px-2">
              <View className="bg-warning-50 rounded-lg p-4 items-center">
                <Ionicons name="time" size={32} color="#F59E0B" />
                <Text className="text-2xl font-bold text-warning-600 mt-2">
                  {summary.late}
                </Text>
                <Text className="text-warning-600 text-sm">Late</Text>
              </View>
            </View>
            <View className="w-1/2 px-2">
              <View className="bg-primary-50 rounded-lg p-4 items-center">
                <Ionicons name="document-text" size={32} color="#3B82F6" />
                <Text className="text-2xl font-bold text-primary-600 mt-2">
                  {summary.excused}
                </Text>
                <Text className="text-primary-600 text-sm">Excused</Text>
              </View>
            </View>
          </View>
        </Card>

        <Card className="mb-6">
          <View className="flex-row items-center justify-between mb-2">
            <Subtitle>Class</Subtitle>
            <Text className="font-medium">
              {classes.find((c) => c.id === classId)?.name || "Unknown"}
            </Text>
          </View>
          <View className="flex-row items-center justify-between mb-2">
            <Subtitle>Date</Subtitle>
            <Text className="font-medium">{date}</Text>
          </View>
          <View className="flex-row items-center justify-between">
            <Subtitle>Total Students</Subtitle>
            <Text className="font-medium">{students.length}</Text>
          </View>
        </Card>

        <View className="flex-row space-x-3">
          <Button
            variant="secondary"
            onPress={() => setStep(2)}
            className="flex-1"
          >
            Edit
          </Button>
          <Button
            onPress={handleSubmit}
            loading={submitting}
            className="flex-1"
          >
            Submit Attendance
          </Button>
        </View>
      </View>
    </Screen>
  );
}
