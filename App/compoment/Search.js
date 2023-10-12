import React, { useEffect, useState } from "react";
import { StyleSheet, View, ScrollView, Text, Image, TextInput, FlatList } from "react-native";

function Search() {
  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState(""); // State để lưu giá trị của thanh tìm kiếm

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
      <View style={styles.productContainer}>
        <Image source={{ uri: item.product_image }} style={styles.productImage} />
        <Text style={styles.productTitle}>{item.product_title}</Text>
        <Text style={styles.productPrice}>Giá: {item.product_price}</Text>
      </View>
    );
  };

  const filteredProducts = products.filter((item) =>
    item.product_title.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Thanh tìm kiếm */}
      <TextInput
        style={styles.searchInput}
        placeholder="Tìm kiếm sản phẩm..."
        value={searchText}
        onChangeText={(text) => setSearchText(text)}
      />

      <FlatList
        data={filteredProducts} // Sử dụng filteredProducts thay vì products
        keyExtractor={(item) => item._id}
        renderItem={renderProductItem}
      />
    </View>
  );
}

export default Search;

const styles = StyleSheet.create({
  container: {
    paddingTop: 15,
    backgroundColor: "#DDD",
  },
  searchInput: {
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 10,
  },
  productContainer: {
    width: "90%",
    margin: 10,
    marginLeft: 15,
    padding: 10,
    backgroundColor: "white",
    elevation: 5,
    shadowColor: "gray",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  productImage: {
    width: "50%",
    height: 100,
    borderRadius: 10,
    alignItems: "center",
  },
  productTitle: {
    marginLeft: 15,
    marginTop: 7,
    fontSize: 17,
    fontWeight: "bold",
  },
  productPrice: {
    marginLeft: 15,
    width: 140,
  },
  //...
});