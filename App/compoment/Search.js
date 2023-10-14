import React, { useEffect, useState } from "react";
import { StyleSheet, View, ScrollView, Text, Image, TextInput, FlatList, TouchableOpacity } from "react-native";

function Search({ navigation }) {
  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    fetch("https://md26bipbip-496b6598561d.herokuapp.com/")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const renderProductItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.productContainer}
        key={item._id}
        onPress={() => {
          navigation.navigate("ProductDetail", { productId: item._id });
        }}>
        <Image source={{ uri: item.product_image }} style={styles.productImage} />
        <View style={styles.productDetails}>
          <Text style={styles.productTitle}>{item.product_title}</Text>
          <Text style={styles.productPrice}>Giá: {item.product_price} đ</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const handleSearch = () => {
    setFilteredProducts(products.filter((item) =>
      item.product_title.toLowerCase().includes(searchText.toLowerCase()))
    );
    setIsSearching(true);
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm sản phẩm..."
            value={searchText}
            onChangeText={(text) => setSearchText(text)}
          />
          <TouchableOpacity
            style={styles.searchButton}
            onPress={handleSearch}
          >
            <View style={styles.searchButtonSquare}>
              <Text style={styles.searchButtonText}>Tìm</Text>
            </View>
          </TouchableOpacity>
        </View>
        <FlatList
          data={isSearching ? filteredProducts : products}
          keyExtractor={(item) => item._id}
          renderItem={renderProductItem}
        />
      </View>
    </View>
  );
}

export default Search;

const styles = StyleSheet.create({
  container: {
    paddingTop: 15,
    backgroundColor: "#dddddd",
    marginBottom: "15%"
  },
  searchContainer: {
    flexDirection: "row",
  },
  
  mainContainer: {
    height: "100%",
    backgroundColor: "#dddddd",
  },
 
  searchInput: {
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 10,
    width: "80%"
  },
  searchButton: {
    marginTop:14,
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    backgroundColor: "blue",
    borderRadius: 5,
    
  },
 
  searchButtonText: {
    color: "white",
  },
  productContainer: {
    width: "90%",
    margin: 10,
    marginLeft: "5%",
    padding: 10,
    backgroundColor: "white",
    elevation: 5,
    shadowColor: "gray",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  productDetails: {
    width: "70%",
    padding: 10,
  },
  productTitle: {
    fontSize: 17,
    fontWeight: "bold",
  },
  productPrice: {
    width: 140,
  },
  //...
});