import { StyleSheet, Text, View, Button } from "react-native";
import { useNavigation, NavigationProp, NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from "./home";
import ScheduleScreen from "./schedule-page";
import GeneratedScreen from "./generated-schedule";

export default function Page() {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="ScheduleScreen" component={ScheduleScreen} />
      <Stack.Screen name="GeneratedScreen" component={GeneratedScreen} />
    </Stack.Navigator>
  );
}
