import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import axios from "axios";
import tw from "tailwind-react-native-classnames";
import Icon from "react-native-vector-icons/MaterialIcons"; // For icons
import { LinearGradient } from "expo-linear-gradient"; // For gradient background
import * as Animatable from "react-native-animatable"; // For animations

const DetailsScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch item details
  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        const response = await axios.get(`https://dummyjson.com/products/${id}`);
        setItem(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setError("Failed to fetch item details. Please try again later.");
        setLoading(false);
      }
    };
    fetchItemDetails();
  }, [id]);

  // Show loading indicator
  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Show error message
  if (error) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text style={tw`text-red-500 text-lg`}>{error}</Text>
        <TouchableOpacity
          style={tw`mt-4 bg-blue-500 px-4 py-2 rounded-lg`}
          onPress={() => navigation.goBack()}
        >
          <Text style={tw`text-white`}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={tw`flex-1 bg-gray-100`}>
      {/* Amazing Back Button with Gradient and Animation */}
      <Animatable.View
        animation="fadeInDown"
        duration={500}
        style={tw`absolute top-4 left-4 z-10`}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={["#6EE7B7", "#3B82F6"]} // Gradient colors
            style={tw`p-3 rounded-full shadow-lg`}
          >
            <Icon name="arrow-back" size={24} color="#FFF" />
          </LinearGradient>
        </TouchableOpacity>
      </Animatable.View>

      {/* Item Details */}
      <View style={tw`p-4`}>
        {/* Item Image */}
        <Image
          source={{ uri: item.thumbnail }}
          style={tw`w-full h-64 rounded-lg mb-4`}
          resizeMode="cover"
        />

        {/* Item Title */}
        <Text style={tw`text-2xl font-bold mb-2`}>{item.title}</Text>

        {/* Item Description */}
        <Text style={tw`text-gray-600 text-lg mb-4`}>{item.description}</Text>

        {/* Additional Details with Icons */}
        <View style={tw`bg-white p-4 rounded-lg shadow-sm`}>
          {/* Brand */}
          <View style={tw`flex-row items-center mb-2`}>
            <Icon name="business" size={20} color="#3B82F6" style={tw`mr-2`} />
            <Text style={tw`text-lg`}>
              <Text style={tw`font-bold`}>Brand:</Text> {item.brand}
            </Text>
          </View>

          {/* Price */}
          <View style={tw`flex-row items-center mb-2`}>
            <Icon name="attach-money" size={20} color="#10B981" style={tw`mr-2`} />
            <Text style={tw`text-lg`}>
              <Text style={tw`font-bold`}>Price:</Text> ${item.price}
            </Text>
          </View>

          {/* Rating */}
          <View style={tw`flex-row items-center mb-2`}>
            <Icon name="star" size={20} color="#F59E0B" style={tw`mr-2`} />
            <Text style={tw`text-lg`}>
              <Text style={tw`font-bold`}>Rating:</Text> {item.rating}/5
            </Text>
          </View>

          {/* Stock */}
          <View style={tw`flex-row items-center mb-2`}>
            <Icon name="inventory" size={20} color="#EF4444" style={tw`mr-2`} />
            <Text style={tw`text-lg`}>
              <Text style={tw`font-bold`}>Stock:</Text> {item.stock} units available
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default DetailsScreen;