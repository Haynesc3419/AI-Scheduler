import { StyleSheet, Text, View, Button } from "react-native";
import { useNavigation, NavigationProp, NavigationContainer } from '@react-navigation/native';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import HomeScreen from "./home";
import ScheduleScreen from "./schedule-page";
import GeneratedScreen from "./generated-schedule";
import { ScrollView } from "react-native";

export default function Page() {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator 
      initialRouteName="Home"
      screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forFadeFromRightAndroid
      }}
      
      >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="ScheduleScreen" component={ScheduleScreen} />
      <Stack.Screen name="GeneratedScreen" component={GeneratedScreen} />
    </Stack.Navigator>
  );
}
