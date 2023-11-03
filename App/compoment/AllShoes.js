import React, { useEffect, useState } from "react";
import { StyleSheet, View, FlatList, Image, TouchableOpacity, Text } from "react-native";
import { getMonney } from "../util/money";
import {useSelector} from "react-redux";

function AllShoes({ route,navigation }) {

  const products = useSelector((state) => state.dataAll.dataSP); //lấy toàn bộ mảng dữ liệu
  const userId = route.params?.userId || '';
  useEffect(() => {
    console.log('Giá trị userID ở màn allshowe:', userId);
    // Thực hiện các xử lý khác với userID
  }, [userId]);
  const renderProductItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("ProductDetail", { productId: item._id , userId : userId});
        }}
        style={styles.productContainer}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.product_image }}
            style={styles.productImage}
          />
          <View style={styles.productInfo}>
            <Text numberOfLines={1} style={styles.productTitle}>
              {item.product_title}
            </Text>
            <Text style={styles.productPrice}>
              Giá: {getMonney(item.product_price)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
     
      <FlatList
        data={products}
        renderItem={renderProductItem}
        keyExtractor={(item) => item._id.toString()}
        numColumns={2} // Display in two columns
      />
    </View>
  );
}

export default AllShoes;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DDD",
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 40,
    marginLeft: 15,
    marginBottom: 7,
  },
  productContainer: {
    marginTop: 5,
    flex: 1,
    alignItems: "center",
    margin: 5,
    borderRadius: 10,
    backgroundColor: "white",
    elevation: 5,
    shadowColor: "gray",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  imageContainer: {
    width: "100%",
    height: 200,
    paddingBottom: 3,
    borderRadius: 10,
  },
  productImage: {
    width: "100%",
    height: "70%",
    borderRadius: 10,
  },
  productInfo: {
    marginTop: 7,
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
});