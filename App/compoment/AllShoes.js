import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import Swiper from "react-native-swiper";
import { getMonney } from "../util/money";
import { useDispatch, useSelector } from "react-redux";
import { fetchDataAndSetToRedux } from "../redux/AllData";
import axios from "axios";

function Home({ route, navigation }) {
  const dispatch = useDispatch();
  const dataSP1 = useSelector((state) => state.dataAll.dataSP);
  const dataSPFav = useSelector((state) => state.dataAll.dataSPFav);
  const idSPFavs = dataSPFav.map((item) => item.product);

  const [valueSortBy, setValueSortBy] = useState(0);
  const [valueFilter, setValueFilter] = useState(null);

  const [dataSP, setDataSP] = useState([]);
  const [dataSwiper, setDataSwiper] = useState([]);
  const userID = route.params?.userID || "";

  useEffect(() => {
    console.log("Giá trị userID từ home:", userID);
    if (!userID) {
      console.log("không có user");
      return;
    }
  }, [userID]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      dispatch(fetchDataAndSetToRedux());
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (dataSP1) {
      const products = Object.keys(dataSP1).map((key) => ({
        id: key,
        ...dataSP1[key],
        isFav: false,
      }));

      setDataSP(products);
    } else {
      setDataSP([]);
    }

    setDataSwiper(dataSP1);
  }, [dataSP1, dataSPFav]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (swiperRef.current && swiperRef.current.scrollBy) {
        swiperRef.current.scrollBy(1);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const sortByPrice = (item) => {
    setValueSortBy(item.value);
    const dataSort = [...dataSP1];

    if (item.value == 2) {
      dataSort.sort((a, b) => (a.product_price < b.product_price ? 1 : -1));
      setDataSP(dataSort);
    }
    if (item.value == 3) {
      dataSort.sort((a, b) => (a.product_price > b.product_price ? 1 : -1));
      setDataSP(dataSort);
    }
  };

  const filterByCategory = (value) => {
    setValueFilter(value);
    const dataCategory = [...dataSP1];

    if (value == 1) {
      setDataSP(dataCategory);
    }
    if (value == 2) {
      const filteredData = dataCategory.filter(
        (product) => product.product_category === "men"
      );
      setDataSP(filteredData);
    }
    if (value == 3) {
      const filteredData = dataCategory.filter(
        (product) => product.product_category === "women"
      );
      setDataSP(filteredData);
    }
  };

  const renderProductItem = (item) => {
    item.isFav = idSPFavs.includes(item._id);
    const toggleHeartColor = () => {
      if (item.isFav == false) {
        axios
          .post("https://md26bipbip-496b6598561d.herokuapp.com/favourite/add", {
            product_id: item._id,
            user_id: "64ab9784b65d14d1076c3477",
          })
          .then((response) => {})
          .catch((error) => {
            console.error("Lỗi:", error);
          });
      } else {
        const favoriteItemToDelete = dataSPFav.find(
          (itemFav) => itemFav.product === item._id
        );
        if (favoriteItemToDelete) {
          const favoriteItemId = favoriteItemToDelete._id;
          axios
            .delete(
              `https://md26bipbip-496b6598561d.herokuapp.com/favourite/delete/${favoriteItemId}`
            )
            .then((response) => {})
            .catch((error) => {
              console.error("Lỗi khi xóa khỏi danh sách yêu thích:", error);
            });
        } else {
          console.error(
            "Không tìm thấy mục yêu thích với productId:",
            item._id,
            dataSPFav
          );
        }
      }
    };
    return (
      <View style={styles.productContainer}>
        <TouchableOpacity
          key={item._id}
          onPress={() => {
            navigation.navigate("ProductDetail", { productId: item._id, userId: userID });
          }}
        >
          <View
            style={{
              width: "100%",
              height: 200,
              paddingBottom: 3,
              borderRadius: 10,
            }}
          >
            <Image
              source={{ uri: item.product_image }}
              style={{
                width: "100%",
                height: "70%",
                borderRadius: 10,
              }}
            />

            <View>
              <Text
                numberOfLines={1}
                style={{
                  marginLeft: 15,
                  marginTop: 7,
                  fontSize: 17,
                  fontWeight: "bold",
                }}
              >
                {item.product_title}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 7,
                }}
              >
                <Text style={{ marginLeft: 15, width: 140 }}>
                  Giá : {getMonney(item.product_price)}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ position: "absolute", left: 10, top: 7 }}
          onPress={toggleHeartColor}
        >
          <MaterialIcons
            name={item.isFav ? "favorite" : "favorite-outline"}
            size={30}
            color={item.isFav ? "red" : "black"}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const setSwiper = () => {
    if (dataSwiper.length != 0) {
      const arrLength = dataSwiper.length;
      const arrSwiper = dataSwiper.slice(arrLength - 3, arrLength);
      return (
        <Swiper ref={swiperRef} autoplay={false} showsPagination={true}>
          {arrSwiper.map((item) => (
            <View key={item._id}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("ProductDetail", { productId: item._id });
                }}
              >
                <Image
                  source={{ uri: item.product_image }}
                  style={styles.imageBackground}
                />
              </TouchableOpacity>
            </View>
          ))}
        </Swiper>
      );
    } else {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="blue" />
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={dataSP}
        keyExtractor={(item) => item._id}
        numColumns={2}
        renderItem={({ item }) => (
          <View style={styles.columnItem}>
            {renderProductItem(item)}
          </View>
        )}
      />
    </SafeAreaView>
  );
}

export default Home;

const styles = StyleSheet.create({
  columnItem: {
    width: "48%",
    marginTop: 10,
    marginLeft: 7,
  },
  productContainer: {
    width: "100%",
    borderRadius: 10,
    backgroundColor: "white",
    elevation: 5,
    shadowColor: "gray",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  container: {
    paddingTop: 15,
    backgroundColor: "#DDD",
  },
  imageBackground: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    resizeMode: "contain",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
