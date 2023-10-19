import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import {
  FontAwesome,
  FontAwesome5,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import Swiper from "react-native-swiper";
import { Dropdown } from "react-native-element-dropdown";
import { getMonney } from "../util/money";

function Home({ navigation }) {
  const [products, setProducts] = useState([]);
  const [listBackground, setListBackground] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [valueSortBy, setValueSortBy] = useState(0);
  const [valueFilter, setValueFilter] = useState(null);
  const swiperRef = useRef(null);

  const [check, setCheck] = useState(true);
  const [check1, setCheck1] = useState(false);
  const [check2, setCheck2] = useState(false);
  const [check3, setCheck3] = useState(false);
  const [check4, setCheck4] = useState(false);

  useEffect(() => {
    fetch("https://md26bipbip-496b6598561d.herokuapp.com/")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
        setIsLoading(false);
        setListBackground(data);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });

    const interval = setInterval(() => {
      if (swiperRef.current && swiperRef.current.scrollBy) {
        swiperRef.current.scrollBy(1); //di chuyen anh tiep
      }
    }, 5000); // Thời gian tự động chuyển ảnh (ms)

    return () => clearInterval(interval);
  }, []);


  //array for dropdown
  const sortBy = [
    { label: "Nổi bật", value: "1" },
    { label: "Giá Cao - Thấp", value: "2" },
    { label: "Giá Thấp - Cao ", value: "3" },
  ];
  const Filter = [
    { label: "Tất cả", value: "1" },
    { label: "Nam", value: "2" },
    { label: "Nữ", value: "3" },
  ];

  //Chưa có nổi bật nên chỉ sắp sếp theo giá
  const sortByPrice = (item) => {
    setValueSortBy(item.value);
    if (item.value == 2) {
      products.sort((a, b) => (a.product_price < b.product_price ? 1 : -1));
    }
    if (item.value == 3) {
      products.sort((a, b) => (a.product_price > b.product_price ? 1 : -1));
    }
  };

  const filterByCategory = (value) => {
    setValueFilter(value);

    const apiUrl = "https://md26bipbip-496b6598561d.herokuapp.com/";

    if (value == 1) {
      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          setProducts(data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
    if (value == 2) {
      fetch(apiUrl + "products/men")
        .then((response) => response.json())
        .then((data) => {
          setProducts(data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
    if (value == 3) {
      fetch(apiUrl + "products/women")
        .then((response) => response.json())
        .then((data) => {
          setProducts(data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  //checked
  const checkAll = () => {
    setCheck(true);
    setCheck1(false);
    setCheck2(false);
    setCheck3(false);
    setCheck4(false);
    console.log(1);
  };
  const checkRunning = () => {
    setCheck(false);
    setCheck1(true);
    setCheck2(false);
    setCheck3(false);
    setCheck4(false);
    console.log(2);
  };
  const checkBoots = () => {
    setCheck(false);
    setCheck1(false);
    setCheck2(true);
    setCheck3(false);
    setCheck4(false);
    console.log(3);
  };
  const checkDress = () => {
    setCheck(false);
    setCheck1(false);
    setCheck2(false);
    setCheck3(true);
    setCheck4(false);
    console.log(4);
  };
  const checkKids = () => {
    setCheck(false);
    setCheck1(false);
    setCheck2(false);
    setCheck3(false);
    setCheck4(true);
    console.log(5);
  };

  //item layout
  const renderItemSortBy = (item) => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.label}</Text>
      </View>
    );
  };
  const renderItemFilter = (item) => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.label}</Text>
      </View>
    );
  };

  const renderProductItem = (item) => {
    return (
      <View style={styles.productContainer}>
        <TouchableOpacity
          key={item._id}
          onPress={() => {
            navigation.navigate("ProductDetail", { productId: item._id });
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
          style={
            { position: "absolute", left: 10, top: 7 }
            // onPress={} add to favorites
          }
        >
        {/* HÌnh trái tim */}
          {/* <MaterialIcons name={"favorite-outline"} size={30} color="black" /> */}
        </TouchableOpacity>
        {/* <TouchableOpacity
                    style={{position: "absolute", right: 10, bottom: 7}}
                    // onPress={} add to cart
                >
                    <FontAwesome5 name="cart-plus" size={24} color="black"/>
                </TouchableOpacity> */}
      </View>
    );
  };

  //swiper layout
  const setSwiper = () => {
    const arrLength = listBackground.length;
    const arrSwiper = listBackground.slice(arrLength-3,arrLength);
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="blue" />
        </View>
      );
    }
    return (
      <Swiper
        ref={swiperRef}
        autoplay={false} // Tắt chế độ autoplay của Swiper
        showsPagination={true}
      >
        {arrSwiper.map((item) => (
          <View key={item._id}>
            <Image
              source={{ uri: item.product_image }}
              style={styles.imageBackground}
            />
          </View>
        ))}
      </Swiper>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={{ alignItems: "center" }}>
          <View style={styles.slide}>{setSwiper()}</View>
        </View>

        <View style={styles.option}>
          <TouchableOpacity style={styles.select} onPress={checkAll}>
            <Image
              source={require("../image/All.jpg")}
              style={[styles.icon, check ? styles.check : null]}
            />
            <Text>ALL</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.select} onPress={checkRunning}>
            <Image
              source={require("../image/Running.jpg")}
              style={[styles.icon, check1 ? styles.check : null]}
            />
            <Text>Running</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.select} onPress={checkBoots}>
            <Image
              source={require("../image/Boots.jpg")}
              style={[styles.icon, check2 ? styles.check : null]}
            />
            <Text>Boots</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.select} onPress={checkDress}>
            <Image
              source={require("../image/Dress.jpg")}
              style={[styles.icon, check3 ? styles.check : null]}
            />
            <Text>Dress</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.select} onPress={checkKids}>
            <Image
              source={require("../image/Kids.jpg")}
              style={[styles.icon, check4 ? styles.check : null]}
            />
            <Text>Kids</Text>
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: "row", marginLeft: 10 }}>
          <Dropdown
            style={styles.dropdown}
            data={sortBy}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Sắp xếp"
            value={valueSortBy}
            onChange={(item) => {
              sortByPrice(item);
            }}
            renderItem={renderItemSortBy}
          />

          <Dropdown
            style={[styles.dropdown, { width: 100 }, { marginLeft: 10 }]}
            data={Filter}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Lọc"
            value={valueFilter}
            labelStyle={{ fontWeight: "bold" }}
            onChange={(item) => {
              filterByCategory(item.value);
            }}
            renderItem={renderItemFilter}
          />
        </View>

        <View style={styles.columnsContainer}>
          {products.map((item) => (
            <View key={item._id} style={styles.columnItem}>
              {renderProductItem(item)}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

export default Home;

const styles = StyleSheet.create({
  check: {
    width: 80,
    height: 80,
  },
  columnsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    marginTop: 10,
  },
  columnItem: {
    width: "48%", // Display two items per row
    marginTop: 10,
    marginLeft: 7,
  },
  slide: {
    height: 200,
    width: "95%",
    backgroundColor: "white",
    borderRadius: 30,
    marginTop: 8,
  },

  productContainer: {
    width: "100%",
    borderRadius: 10,
    backgroundColor: "white", // Màu nền của View
    elevation: 5, // Độ đổ bóng
    shadowColor: "gray", // Màu đổ bóng
    shadowOffset: { width: 0, height: 2 }, // Độ dịch chuyển đổ bóng
    shadowOpacity: 0.5, // Độ trong suốt của đổ bóng
    shadowRadius: 5, // Độ mờ của đổ bóng
  },
  container: {
    paddingTop: 15,
    backgroundColor: "#DDD",
  },
  textArrange: {
    fontSize: 15,
    fontWeight: "bold",
    color: "white",
  },
  arrange: {
    backgroundColor: "#362C2C",
    padding: 8,
    marginRight: 14,
    borderRadius: 10,
  },
  icon: {
    width: 60,
    height: 60,
    borderRadius: 100,
    margin: 7,
  },
  select: {
    alignItems: "center",
  },
  button_slide: {
    height: 50,
    width: 120,
    backgroundColor: "red",
    position: "absolute",
    zIndex: 2,
    marginTop: 139,
    marginLeft: 35,
    borderRadius: 10,
  },
  text_slide: {
    color: "white",
    fontSize: 20,
    textAlign: "center",
    marginTop: 10,
    fontWeight: "bold",
  },
  imageBackground: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    resizeMode: "contain",
  },
  option: {
    flexDirection: "row",
    justifyContent: "center",
  },

  dropdown: {
    marginTop: 14,
    height: 50,
    width: 160,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },

  item: {
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textItem: {
    flex: 1,
    fontSize: 16,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
