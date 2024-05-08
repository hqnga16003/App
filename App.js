import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/login/LoginScreen";
import MainScreen from "./screens/main/main_screen";
import Location from "./screens/main/location/location";
import RegisterScreen from "./screens/register/RegisterScreen";

const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      {
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Main" component={MainScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Location" component={Location} />
        </Stack.Navigator>
      }
    </NavigationContainer>
  );
}
