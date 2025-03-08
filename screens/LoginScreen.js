import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import tw from "tailwind-react-native-classnames";
import Icon from "react-native-vector-icons/MaterialIcons"; // For icons
import AsyncStorage from "@react-native-async-storage/async-storage"; // For storing token

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  // Handle login
  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Please enter both username and password.");
      return;
    }
  
    setLoading(true);
    try {
      const response = await axios.post("https://dummyjson.com/auth/login", {
        username,
        password,
      });
      console.log("API Response:", response.data); // Log the response
      if (response.data.token) {
        await AsyncStorage.setItem("token", response.data.token); // Store token
        navigation.navigate("Home");
      }
    } catch (error) {
      console.error("API Error:", error.response?.data); // Log the error
      Alert.alert("Error", "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={tw`flex-1 justify-center items-center p-4 bg-gray-100`}>
      {/* Login Header */}
      <Text style={tw`text-3xl font-bold mb-8 text-blue-600`}>Login</Text>

      {/* Username Input */}
      <View style={tw`w-full mb-4`}>
        <View
          style={tw`flex-row items-center bg-white p-3 rounded-lg shadow-sm border border-gray-200`}
        >
          <Icon name="person" size={20} color="#6B7280" style={tw`mr-2`} />
          <TextInput
            style={tw`flex-1`}
            placeholder="Username"
            placeholderTextColor="#9CA3AF"
            value={username}
            onChangeText={setUsername}
          />
        </View>
      </View>

      {/* Password Input */}
      <View style={tw`w-full mb-6`}>
        <View
          style={tw`flex-row items-center bg-white p-3 rounded-lg shadow-sm border border-gray-200`}
        >
          <Icon name="lock" size={20} color="#6B7280" style={tw`mr-2`} />
          <TextInput
            style={tw`flex-1`}
            placeholder="Password"
            placeholderTextColor="#9CA3AF"
            secureTextEntry={!showPassword} // Toggle secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          {/* Show/Hide Password Button */}
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={tw`p-2`}
          >
            <Icon
              name={showPassword ? "visibility-off" : "visibility"}
              size={20}
              color="#6B7280"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Login Button */}
      <TouchableOpacity
        style={tw`w-full bg-blue-600 p-3 rounded-lg shadow-lg`}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#FFF" />
        ) : (
          <Text style={tw`text-white text-center text-lg font-bold`}>
            Login
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;