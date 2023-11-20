import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Image,
  TextInput,
  FlatList,
  TouchableOpacity,
  LogBox,
  SafeAreaView,
} from "react-native";
import { getMonney } from "../../util/money";
import axios from "axios";
import _ from "lodash";
import { useSelector } from "react-redux";
import url from "../../api/url";

function Search({ navigation }) {
  const [searchText, setSearchText] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [topSellingInProducts, setTopSellingInProducts] = useState([]);
  useEffect(() => {
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"])
  }, [])

  const products = useSelector((state) => state.dataAll.dataSP); //lấy toàn bộ mảng dữ liệu
  const topSellingProducts = useSelector(
    (state) => state.dataAll.dataSPBestSale
  );

  useEffect(() => {
    const filteredTopSellingProducts = topSellingProducts.map((item) => {
      const matchingProduct = products.find(
        (product) => product._id === item.productId
      );
      return matchingProduct || null;
    });
    const filteredTopSellingInProducts = filteredTopSellingProducts.filter(
      (product) => product !== null
    );

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
        }}
      >
        <Image
          source={{ uri: item.product_image }}
          style={styles.productImage}
        />
        <View style={styles.productDetails}>
          <Text style={styles.productTitle}>{item.product_title}</Text>
          <Text style={styles.productPrice}>
            Giá: {getMonney(item.product_price)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  const chunkSize = topSellingInProducts.length / 2;
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
  // const handleSearch = () => {
  //   if (!searchText) {
  //     setIsSearching(false);
  //     setFilteredProducts([]); // Clear the filtered products
  //   } else {
  //     setFilteredProducts(
  //       products.filter((item) =>
  //         item.product_title.toLowerCase().includes(searchText.toLowerCase())
  //       )
  //     );
  //     setIsSearching(true);

  //   }

  // };
  const handleSearch = async () => {
    try {
      if (!searchText) {
        setIsSearching(false);
        setFilteredProducts([]); // Clear the filtered products
      } else {
        const requestData = {
          title: searchText,
        };

        // const response = await axios.post(
        //   //"https://md26bipbip-496b6598561d.herokuapp.com/products/search",
        //   "http://192.168.1.125/products/search",
        //   requestData,
        //   {
        //     headers: {
        //       "Content-Type": "application/json", // Đảm bảo rằng dữ liệu được gửi dưới dạng JSON
        //     },
        //   }
        // );
        const response = await url.post(
          "/products/search",
          requestData,
          {
            headers: {
              "Content-Type": "application/json", // Đảm bảo rằng dữ liệu được gửi dưới dạng JSON
            },
          }
        );
       
        // Assuming the response data is an array of products
        const products = response.data;
       
        setFilteredProducts(products);
        setIsSearching(true);
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm sản phẩm..."
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <View>
            {/* <Text style={styles.searchButtonText}>Tìm</Text> */}
            <Image
              source={require("../../image/search.png")}
              // style={styles.imageBackground}
            />
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView>
        {filteredProducts.length === 0 && (
          <View style={{ display: "flex" }}>
            <Text style={{ fontSize: 18, fontWeight: "500", marginLeft: 20 }}>
              Sản phẩm bán chạy
            </Text>

            <ScrollView horizontal={true} contentContainerStyle={{ flex: 1, justifyContent: 'center' }}>
  <View style={{ flexDirection: 'column', marginTop: 3 }}>

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
              <Text style={{ fontSize: 15, fontWeight: "500" }}>
                Xem tất cả
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {isSearching && filteredProducts.length === 0 && (
          <Text style={{ textAlign: "center", fontSize: 18, color: "gray" }}>
            Không có sản phẩm nào
          </Text>
        )}
        <FlatList
          style={[
            styles.prodList,
            {
              height: filteredProducts.length === 0 ? "42%" : "100%",
              marginTop: filteredProducts.length === 7 ? -10 : 0,
            },
          ]}
          data={isSearching ? filteredProducts : products}
          keyExtractor={(item) => item._id}
          renderItem={renderProductItem}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

export default Search;

const styles = StyleSheet.create({
  container: {
    paddingTop: 15,
    backgroundColor: "#dddddd",
    marginBottom: "15%",
  },
  searchContainer: {
    margin: 10,
    flexDirection: "row",
    paddingHorizontal: 16,
    alignItems: "center",
  },
  searchInput: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 10,
    width: "85%",
  },
  searchButton: {
    justifyContent: "center",
    marginLeft: "auto",
    width: 40,
    height: 40,
  },
  prodList: {
    marginTop: 7,
    height: "42%",
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
    marginHorizontal: 200,
  },
  showAll: {
    alignSelf: "flex-end",
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
    marginLeft:20
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
  },
});
