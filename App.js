import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./screens/HomeScreen";
import DetailsScreen from "./screens/DetailsScreen";
import LoginScreen from "./screens/LoginScreen";
import AsyncStorage from "@react-native-async-storage/async-storage"; // For token persistence
import { View } from "react-native";
import tw from "tailwind-react-native-classnames";
import { ActivityIndicator } from "react-native";


// Create a stack navigator
const Stack = createStackNavigator();


export default function App() {
  const [isLoading, setIsLoading] = useState(true); // Track loading state
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state

  // Check if the user is already logged in
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          setIsLoggedIn(true); // User is logged in
        }
      } catch (error) {
        console.error("Error checking login status:", error);
      } finally {
        setIsLoading(false); // Loading complete
      }
    };

    checkLoginStatus();
  }, []);

  // Show loading indicator while checking login status
  if (isLoading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={!isLoggedIn ? "Home" : "Login"}>
        {/* Login Screen */}
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }} // Hide header for Login screen
        />

        {/* Home Screen */}
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: "Home", // Set a title for the Home screen
            headerStyle: {
              backgroundColor: "#3B82F6", // Blue header background
            },
            headerTintColor: "#FFF", // White header text color
            headerTitleStyle: {
              fontWeight: "bold", // Bold header title
            },
          }}
        />

        {/* Details Screen */}
        <Stack.Screen
          name="Details"
          component={DetailsScreen}
          options={{
            title: "Details", // Set a title for the Details screen
            headerStyle: {
              backgroundColor: "#3B82F6", // Blue header background
            },
            headerTintColor: "#FFF", // White header text color
            headerTitleStyle: {
              fontWeight: "bold", // Bold header title
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
