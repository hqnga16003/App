import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import IonIcons from "react-native-vector-icons/Ionicons";
import FAIcon from "react-native-vector-icons/FontAwesome";
import ADIcon from "react-native-vector-icons/AntDesign";
import HomeScreen from "./home/HomeScreen";
import HistoryScreen from "./history/HistoryScreen";
import TicketScreen from "./ticket/TicketScreen";
import ProfileScreen from "./profile/ProfileScreen";

const Tab = createBottomTabNavigator();

export default function MainScreen() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <IonIcons name="home" size={20} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <FAIcon name="history" size={20} color={color} />
          ),
        }}
      />
      {/* <Tab.Screen
        name="Ticket"
        component={TicketScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <IonIcons name="ticket" size={20} color={color} />
          ),
        }}
      /> */}
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <ADIcon name="profile" size={20} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
