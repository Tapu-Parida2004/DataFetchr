import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Button,
  TextInput,
  Image,
  Modal,
  Pressable,
  Alert,
} from "react-native";
import axios from "axios";
import tw from "tailwind-react-native-classnames";
import AsyncStorage from "@react-native-async-storage/async-storage";
import debounce from "lodash.debounce";
import Icon from "react-native-vector-icons/MaterialIcons"; // Import Material Icons

// Constants
const API_URL = "https://dummyjson.com/products";
const SORT_OPTIONS = {
  NONE: "none",
  ASC: "asc",
  DESC: "desc",
};

// Reusable Item Card Component
const ItemCard = ({ item, onPress }) => (
  <TouchableOpacity
    style={tw`bg-white shadow-lg rounded-lg p-4 mb-4`}
    onPress={onPress}
  >
    <View style={tw`flex-row items-center`}>
      <Image
        source={{ uri: item.thumbnail }}
        style={tw`w-20 h-20 rounded-lg mr-4`}
      />
      <View style={tw`flex-1`}>
        <Text style={tw`text-lg font-bold`}>{item.title}</Text>
        <Text style={tw`text-gray-600`}>{item.brand}</Text>
        <Text style={tw`text-green-600 font-bold`}>${item.price}</Text>
        <Text style={tw`text-sm text-gray-500`}>{item.description}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

const HomeScreen = ({ navigation }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [allItems, setAllItems] = useState([]);
  const [sortOrder, setSortOrder] = useState(SORT_OPTIONS.NONE);
  const [maxPrice, setMaxPrice] = useState("");
  const [isSortModalVisible, setIsSortModalVisible] = useState(false);

  // Logout functionality
  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    navigation.navigate("Login");
  };

  // Add a logout button in the header
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleLogout} style={tw`mr-4`}>
          <Icon name="logout" size={24} color="#000" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  // Fetch items with pagination
  const fetchItems = useCallback(async (pageNumber = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_URL}?limit=10&skip=${(pageNumber - 1) * 10}`
      );
      if (pageNumber === 1) {
        setAllItems(response.data.products);
        setItems(response.data.products);
      } else {
        setAllItems((prevItems) => [...prevItems, ...response.data.products]);
        setItems((prevItems) => [...prevItems, ...response.data.products]);
      }
      setHasMore(response.data.products.length > 0);
    } catch (error) {
      console.error("Error fetching items:", error);
      Alert.alert("Error", "Failed to fetch items. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems(page);
  }, [page, fetchItems]);

  // Debounced Search
  const debouncedSearch = useCallback(
    debounce((query) => {
      if (query) {
        const filteredItems = allItems.filter((item) =>
          item.title.toLowerCase().includes(query.toLowerCase())
        );
        setItems(filteredItems);
      } else {
        setItems(allItems);
      }
    }, 300),
    [allItems]
  );

  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);

  // Handle sorting
  const handleSort = useCallback((order) => {
    setSortOrder(order);
    let sortedItems = [...items];
    if (order === SORT_OPTIONS.ASC) {
      sortedItems.sort((a, b) => a.price - b.price);
    } else if (order === SORT_OPTIONS.DESC) {
      sortedItems.sort((a, b) => b.price - a.price);
    }
    setItems(sortedItems);
    setIsSortModalVisible(false);
  }, [items]);

  // Handle price filter
  const handlePriceFilter = useCallback((price) => {
    setMaxPrice(price);
    if (price) {
      const filteredItems = allItems.filter((item) => item.price <= parseFloat(price));
      setItems(filteredItems);
    } else {
      setItems(allItems);
    }
  }, [allItems]);

  // Load more items for infinite scrolling
  const loadMoreItems = useCallback(() => {
    if (hasMore && !loading) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [hasMore, loading]);

  // Render each item in the list
  const renderItem = useCallback(
    ({ item }) => (
      <ItemCard
        item={item}
        onPress={() => navigation.navigate("Details", { id: item.id })}
      />
    ),
    [navigation]
  );

  // Render the footer for loading more items
  const renderFooter = useCallback(() => {
    if (!hasMore) return null;
    return <ActivityIndicator size="small" color="#0000ff" style={tw`my-4`} />;
  }, [hasMore]);

  return (
    <View style={tw`flex-1 p-4 bg-gray-100`}>
      {/* Search Bar */}
      <View style={tw`flex-row items-center bg-white rounded-lg shadow-sm mb-4`}>
        <Icon name="search" size={24} color="#9CA3AF" style={tw`ml-3`} />
        <TextInput
          style={tw`flex-1 p-3`}
          placeholder="Search items..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Sorting and Price Filter Controls */}
      <View style={tw`flex-row justify-between mb-4`}>
        {/* Sorting Button */}
        <TouchableOpacity
          style={tw`flex-1 mr-2 bg-white rounded-lg p-3 justify-center flex-row items-center`}
          onPress={() => setIsSortModalVisible(true)}
        >
          <Icon
            name={sortOrder === SORT_OPTIONS.ASC ? "arrow-upward" : sortOrder === SORT_OPTIONS.DESC ? "arrow-downward" : "sort"}
            size={20}
            color="#4B5563"
            style={tw`mr-2`}
          />
          <Text style={tw`text-gray-700`}>
            {sortOrder === SORT_OPTIONS.NONE
              ? "Sort by Price"
              : sortOrder === SORT_OPTIONS.ASC
              ? "Price: Low to High"
              : "Price: High to Low"}
          </Text>
        </TouchableOpacity>

        {/* Price Filter Input */}
        <View style={tw`flex-1 bg-white rounded-lg shadow-sm flex-row items-center`}>
          <Icon name="attach-money" size={24} color="#9CA3AF" style={tw`ml-3`} />
          <TextInput
            style={tw`flex-1 p-3`}
            placeholder="Max Price"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
            value={maxPrice}
            onChangeText={handlePriceFilter}
          />
        </View>
      </View>

      {/* Sorting Modal */}
      <Modal
        visible={isSortModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsSortModalVisible(false)}
      >
        <Pressable
          style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}
          onPress={() => setIsSortModalVisible(false)}
        >
          <View style={tw`w-80 bg-white rounded-lg p-4`}>
            <Pressable
              style={tw`p-3 flex-row items-center`}
              onPress={() => handleSort(SORT_OPTIONS.NONE)}
            >
              <Icon name="sort" size={20} color="#4B5563" style={tw`mr-2`} />
              <Text style={tw`text-lg`}>Sort by Price</Text>
            </Pressable>
            <Pressable
              style={tw`p-3 flex-row items-center`}
              onPress={() => handleSort(SORT_OPTIONS.ASC)}
            >
              <Icon name="arrow-upward" size={20} color="#4B5563" style={tw`mr-2`} />
              <Text style={tw`text-lg`}>Price: Low to High</Text>
            </Pressable>
            <Pressable
              style={tw`p-3 flex-row items-center`}
              onPress={() => handleSort(SORT_OPTIONS.DESC)}
            >
              <Icon name="arrow-downward" size={20} color="#4B5563" style={tw`mr-2`} />
              <Text style={tw`text-lg`}>Price: High to Low</Text>
            </Pressable>
            <Button title="Close" onPress={() => setIsSortModalVisible(false)} />
          </View>
        </Pressable>
      </Modal>

      {/* Item List */}
      {loading && page === 1 ? (
        <ActivityIndicator size="large" color="#0000ff" style={tw`mt-8`} />
      ) : (
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => `${item.id}-${item.title}`}
          onEndReached={loadMoreItems}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          contentContainerStyle={tw`pb-4`}
        />
      )}
    </View>
  );
};

export default HomeScreen;