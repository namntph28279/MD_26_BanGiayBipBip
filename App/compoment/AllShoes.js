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
import AsyncStorage from "@react-native-async-storage/async-storage";
import url from "../api/url";

function Home({ route, navigation }) {
  const dispatch = useDispatch();
  const dataSP1 = useSelector((state) => state.dataAll.dataSP); //lấy toàn bộ mảng dữ liệu
  const dataSPFav = useSelector((state) => state.dataAll.dataSPFav); //lấy toàn bộ mảng dữ liệu Fav
//lấy id sp Fav
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkColorFav,setCheckColorFav] = useState([]);
  const swiperRef = useRef(null);

  const [dataSP, setDataSP] = useState([]);
  const [dataSwiper, setDataSwiper] = useState([]);
  useEffect(() => {
    setDataSP(dataSP1);
    setDataSwiper(dataSP1);
    setCheckColorFav(dataSPFav.map((item) => item.product))
  }, [dataSP1,dataSPFav]);

  const renderProductItem = (item) => {
    const isFav =  checkColorFav.includes(item._id);
    const toggleHeartColor = async () => {
      const checkLogin = await AsyncStorage.getItem('Email');

      if (!checkLogin){
        alert("Vui lòng đăng nhập");
        navigation.navigate('Login');
        return
      }
      if (isProcessing) {
        console.log("Chặn click nhiều lần ")
        return; // Chặn tương tác nếu đang xử lý
      }
      setIsProcessing(true);
      const idFavourite = item._id;
      const email = await AsyncStorage.getItem('Email');
      if ( isFav === false) {
        await url.post("/favourite/addFav", {product_id: idFavourite, user_id: email})
        checkColorFav.push(item._id)
        dispatch(fetchDataAndSetToRedux());
        setIsProcessing(false);
        console.log("Them")
      } else {
        await url.post("/favourite/addFav", {product_id: idFavourite, user_id: email})
        let index = checkColorFav.indexOf(item._id);
        checkColorFav.splice(index, item._id)
        dispatch(fetchDataAndSetToRedux());
        setIsProcessing(false);
        console.log("Xoa")
      }
    };

    return (
      <View style={styles.productContainer}>
        <TouchableOpacity
          key={item._id}
          onPress={() => {
            navigation.navigate("ProductDetail", { productId: item._id});
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
            name={isFav ? "favorite" : "favorite-outline"}
            size={30}
            color={isFav ? "red" : "black"}
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
