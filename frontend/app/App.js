import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CreateClassScreen from './screens/CreateClassScreen';
import CreateSchoolScreen from './screens/CreateSchoolScreen';
import CreateStudentScreen from './screens/CreateStudentScreen';
import CreateTeacherScreen from './screens/CreateTeacherScreen';
import DashboardScreen from './screens/DashboardScreen';
import LoginScreen from './screens/LoginScreen';
import RecordAttendanceScreen from './screens/RecordAttendanceScreen';
import RegisterScreen from './screens/RegisterScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="CreateSchool" component={CreateSchoolScreen} />
        <Stack.Screen name="CreateClass" component={CreateClassScreen} />
        <Stack.Screen name="CreateStudent" component={CreateStudentScreen} />
        <Stack.Screen name="CreateTeacher" component={CreateTeacherScreen} />
        <Stack.Screen name="RecordAttendance" component={RecordAttendanceScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
