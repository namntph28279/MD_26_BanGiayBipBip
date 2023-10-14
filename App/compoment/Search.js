import React, { useEffect, useState } from "react";
import { StyleSheet, View, ScrollView, Text, Image, TextInput, FlatList, TouchableOpacity } from "react-native";
import { getMonney } from "../util/money";
function Search({ navigation }) {
  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [topSellingProducts, setTopSellingProducts] = useState([]);
  const [topSellingInProducts, setTopSellingInProducts] = useState([]);

 
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
 useEffect(() => {
    fetch("https://md26bipbip-496b6598561d.herokuapp.com/top-selling")
      .then((response) => response.json())
      .then((data) => {
        setTopSellingProducts(data);
      })
      .catch((error) => {
        console.error(error);
      });
      //console.log("Số phần tử trong topSelling", topSellingProducts.length);
  }, []);
  useEffect(() => {
    const filteredTopSellingProducts = topSellingProducts.map(item => {
      const matchingProduct = products.find(product => product._id === item.productId);
      return matchingProduct || null;
    });
    const filteredTopSellingInProducts = filteredTopSellingProducts.filter(product => product !== null);
    const limitedTopSellingInProducts = filteredTopSellingInProducts.slice(0, 4);
  
    setTopSellingInProducts(limitedTopSellingInProducts);
  
    //console.log("Số phần tử trong topSellingInProducts:", limitedTopSellingInProducts.length);
  }, [topSellingProducts, products]);

 

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

  const renderTopSellingProductItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("ProductDetail", { productId: item._id });
        }}
        style={styles.saleProductContainer}
      >
        <View style={styles.saleImageContainer}>
          <Image
            source={{ uri: item.product_image }}
            style={styles.saleProductImage}
          />
          <View style={styles.saleProductInfo}>
            <Text numberOfLines={1} style={styles.saleProductTitle}>
              {item.product_title}
            </Text>
            <Text style={styles.saleProductPrice}>
              Giá: {getMonney(item.product_price)}
            </Text>
          </View>
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
        <View>
        <FlatList
          data={topSellingInProducts}
          keyExtractor={(item) => item._id}
          renderItem={renderTopSellingProductItem}
          numColumns={2} // Hiển thị thành 2 cột
        />
        <TouchableOpacity 
              style={styles.showAll}
            onPress={()=>{
              navigation.navigate("AllShoes");}}
          ><Text>xem tất cả</Text></TouchableOpacity>
        </View>
        <FlatList  style={styles.prodList}
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
    marginTop: 14,
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    backgroundColor: "blue",
    borderRadius: 5,

  },
  prodList:{
    marginBottom: 400
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
    marginHorizontal: 200
  },
  showAll:{
    alignSelf: 'flex-end',
    marginTop: 0,
    width: 90,
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
  saleProductContainer: {
    height: "95%",
    marginTop: 0,
    flex: 1,
    alignItems: "center",
    margin: 5,
    borderRadius: 10,
    backgroundColor: "white",
    shadowColor: "gray",
   
   
    
  },
  saleImageContainer: {
    margin: 0,
    width: "100%",
    height: 200,
    paddingBottom: 3,
    borderRadius: 10,
  },
  saleProductImage: {
    width: "100%",
    height: "70%",
    borderRadius: 10,
  },
  saleProductInfo: {
    marginTop: 3,
  },
  saleProductTitle: {
    marginLeft: 15,
    marginTop: 3,
    fontSize: 17,
    fontWeight: "bold",
  },
  saleProductPrice: {
    marginLeft: 15,
    width: 140,
  },
});