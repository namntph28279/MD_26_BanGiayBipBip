import React, { useEffect, useState } from "react";
import { StyleSheet, View, ScrollView, Text, Image, TextInput, FlatList, TouchableOpacity } from "react-native";
import { getMonney } from "../util/money";
import axios from 'axios';
import _ from 'lodash';

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


    setTopSellingInProducts(filteredTopSellingInProducts);

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
          <Text style={styles.productPrice}>Giá: {getMonney(item.product_price)}</Text>
        </View>
      </TouchableOpacity>
    );
  };
  const chunkSize = topSellingInProducts.length / 2
  const chunkedArrays = _.chunk(topSellingInProducts, Math.round(chunkSize));


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
    if (!searchText) {
      setIsSearching(false);
      setFilteredProducts([]); // Clear the filtered products
    } else {
      setFilteredProducts(
        products.filter((item) =>
          item.product_title.toLowerCase().includes(searchText.toLowerCase())
        )
      );
      setIsSearching(true);

    }

  };
  // const handleSearch = async () => {
  //   try {
  //     if (!searchText) {
  //       setIsSearching(false);
  //       setFilteredProducts([]); // Clear the filtered products
  //     } else {
  //       const response = await axios.post('https://md26bipbip-496b6598561d.herokuapp.com/products/search', {
  //         title: searchText,
  //       });

  //       // Assuming the response data is an array of products
  //       const products = response.data;

  //       setFilteredProducts(products);
  //       setIsSearching(true);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };
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
            <View >
              {/* <Text style={styles.searchButtonText}>Tìm</Text> */}
              <Image
                source={require("../image/search.png")}
              // style={styles.imageBackground}
              />
            </View>
          </TouchableOpacity>
        </View>


        {filteredProducts.length === 0 && (
          <View>
            <Text style={{ fontSize: 20, fontWeight: '500', marginLeft: 20, marginTop: -5 }}>Sản phẩm bán chạy</Text>
            <ScrollView horizontal={true}>
              <View style={{ flexDirection: 'column',marginTop: 3 }}>
           
                <FlatList
                  data={chunkedArrays[0]}
                  renderItem={renderTopSellingProductItem}
                  keyExtractor={(item) => item._id}
                  horizontal={true}
                />
                
                <FlatList
                  data={chunkedArrays[1]}
                  renderItem={renderTopSellingProductItem}
                  keyExtractor={(item) => item._id}
                  horizontal={true}
                 
                />
              </View>
            </ScrollView>
            <TouchableOpacity
              style={styles.showAll}
              onPress={() => {
                navigation.navigate("AllShoes");
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: '500', marginTop: -15 }}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>
        )}
        {isSearching && filteredProducts.length === 0 && (
          <Text style={{ textAlign: 'center', fontSize: 18, color: 'gray' }}>Không có sản phẩm nào</Text>
        )}
        <FlatList
          style={[styles.prodList, { height: filteredProducts.length === 0 ? '50%' : '100%', marginTop: filteredProducts.length === 0 ? -10 : 0 }]}
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
    paddingHorizontal: 16
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
  },
  prodList: {
    marginBottom: 400,
    height: "100%",
    marginTop: -15,
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
  showAll: {
    alignSelf: 'flex-end',
    marginVertical: 10,
    marginRight: 18,
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
    width: 170,
    marginTop: 0,
    marginBottom: -15,
    flex: 1,
    alignItems: "center",
    margin: 5,
    borderRadius: 10,
    backgroundColor: "white",
    shadowColor: "gray",
    marginLeft: 15
  },
  saleImageContainer: {
    width: "100%",
    height: 160,
    paddingBottom: 3,
    borderRadius: 10,
  },
  saleProductImage: {
    width: "100%",
    height: "60%",
    borderRadius: 10,
  },
  saleProductInfo: {
    marginTop: -3,
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
  list: {
    marginHorizontal: 16,

  }
});