import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  ScrollView,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { CheckBox } from "react-native-elements";
import { getMonney } from "../util/money";

import { useDispatch, useSelector } from "react-redux";
import { fetchDataAndSetToRedux } from "../redux/AllData";
import axios from "axios";

function Cart({ route, navigation }) {
  const userID = route.params?.userID || "";
  const [userData, setUserData] = useState(null);
  const [cartProducts, setCartProducts] = useState([]);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [shippingAddress, setShippingAddress] = useState("");

  const dispatch = useDispatch(); //trả về một đối tượng điều phối
  const dataProduct = useSelector((state) => state.dataAll.dataSP);
  const [dataSP, setDataSP] = useState([]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      dispatch(fetchDataAndSetToRedux());
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    fetchShippingAddress();
    fetchData();
    setDataSP(dataProduct);
  }, [dataProduct]);

  const fetchData = async () => {
    const cartRef = await fetch(
      "https://md26bipbip-496b6598561d.herokuapp.com/cart/" + userID
    );
    const cartData = await cartRef.json();
    if (cartData) {
      const products = Object.keys(cartData).map((key) => ({
        id: key,
        ...cartData[key],
        selected: false,
      }));

      setCartProducts(products);
    } else {
      setCartProducts([]);
    }
    ///
    // const userRef = ref(database, `registrations/${userId}`);
    // onValue(userRef, (snapshot) => {
    //   const userData = snapshot.val();
    //   if (userData) {
    //     setUserData(userData);
    //   } else {
    //     setUserData(null);
    //   }
    // });
  };

  const fetchShippingAddress = () => {
    // const userId = auth.currentUser.uid;
    // const userRef = ref(database, `registrations/${userId}`);
    // onValue(userRef, (snapshot) => {
    //   const userData = snapshot.val();
    //   if (userData) {
    //     const address = userData.address;
    //     setShippingAddress(address);
    //   } else {
    //     setShippingAddress("");
    //   }
    // });
  };
  const handleToggleSwitch = (productId) => {
    setCartProducts((prevCartProducts) => {
      const updatedProducts = prevCartProducts.map((product) => {
        if (product.id === productId) {
          return { ...product, selected: !product.selected };
        }
        return product;
      });
      return updatedProducts;
    });
  };
  const handleBuyNowAll = () => {
    // const userId = auth.currentUser.uid;
    // const orderRef = ref(database, `Order/${userId}`);
    // const selectedProductIds = selectedProducts.map((product) => product.id);
    // selectedProductIds.forEach((productId) => {
    //   // Xóa sản phẩm đã chọn thanh toán
    //   handleRemoveProduct(productId);
    // });
    // // Thêm các sản phẩm đã chọn vào bảng order
    // push(orderRef, selectedProducts)
    //   .then((newRef) => {
    //     const orderItemId = newRef.key;
    //     console.log("Người dùng với id:", userId);
    //     console.log("Đã thêm sản phẩm vào giỏ hàng:", selectedProducts);
    //     console.log("ID của sản phẩm trong giỏ hàng:", orderItemId);
    //     navigation.navigate("Oder", { userId: userId });
    //   })
    //   .catch((error) => {
    //     console.error("Lỗi thêm sản phẩm vào đơn hàng:", error);
    //   });
  };

  const handleRemoveProduct = (productId) => {
    axios
      .delete(
        "https://md26bipbip-496b6598561d.herokuapp.com/cart/delete/" + productId
      )
      .then((response) => {
        fetchData();
      })
      .catch((error) => {
        console.error("Lỗi khi xóa khỏi giỏ hàng", error);
      });
  };

  const startAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const sumSelectedProductsPrice = () => {
    let sum = 0;
    selectedProducts.forEach((product) => {
      const item = dataSP.find((item) => item._id === product.product);
      sum += item.product_price * product.quantity;
    });
    return sum;
  };
  const sumProductsPrice = (product, quantity) => {
    return product.product_price * quantity;
  };

  const countSelectedProducts = () => {
    return cartProducts.length;
  };

  const increaseQuantity = () => {
    // setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    // if (quantity > 1) {
    // setQuantity(quantity - 1);
    // }
  };

  useEffect(() => {
    // update sphẩm
    const updatedSelectedProducts = cartProducts.filter(
      (product) => product.selected
    );
    setSelectedProducts(updatedSelectedProducts);
  }, [cartProducts]);

  const renderItems = (product) => {
    const item = dataSP.find((item) => item._id === product.product);
    return (
      <View key={product._id} style={styles.productContainer}>
        <View style={styles.productBox}>
          <View style={{ width: 45 }}>
            <CheckBox
              checked={product.selected}
              checkedColor="gray"
              style={styles.buttonCheckbox}
              onPress={() => handleToggleSwitch(product.id)}
            />
          </View>

          <Image
            //uri product image
            source={{ uri: item.product_image }}
            style={styles.productImage}
          />
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{item.product_title}</Text>
            <Text style={styles.productType}>Phân loại : Vàng/37</Text>
            <Text style={styles.productPrice}>
              Giá: {getMonney(sumProductsPrice(item, product.quantity))}
            </Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={decreaseQuantity}
              >
                <Text style={styles.quantityButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantityText}>{product.quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={increaseQuantity}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonDel}
                onPress={() => handleRemoveProduct(product._id)}
              >
                <Ionicons name="trash-outline" size={20} color="red" />
              </TouchableOpacity>
            </View>
            {/* <Animated.Text
              style={[styles.editText, { opacity: fadeAnim }]}
              onLayout={startAnimation}
            >
              Nhấn vào để chỉnh sửa
            </Animated.Text> */}
            <View style={styles.buttonContainer}>
              {/*<TouchableOpacity style={styles.button1} onPress={() => handleBuyNow(product)}>*/}
              {/*    <Ionicons name="cart-outline" size={24} color="#ff6" />*/}
              {/*    <Text style={styles.buttonText1}>Mua</Text>*/}
              {/*</TouchableOpacity>*/}
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>GIỎ HÀNG ({countSelectedProducts()})</Text>
      <View style={{ width: "100%", backgroundColor: "black", height: 1 }} />
      <ScrollView style={{ padding: 10 }}>
        {cartProducts.map((product) => renderItems(product))}
      </ScrollView>
      <View style={{ width: "100%", backgroundColor: "black", height: 1 }} />
      <View
        style={{
          margin: 15,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: "bold", marginLeft: 10 }}>
          Tổng:
        </Text>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: "red",
            marginRight: 10,
          }}
        >
          {getMonney(sumSelectedProductsPrice())}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("EditProfile", {
            userId: auth.currentUser.uid,
            userData,
          })
        }
      >
        <View
          style={{
            margin: 5,
            flexDirection: "row",
            justifyContent: "flex-end",
          }}
        >
          <Text style={styles.addressText}>{shippingAddress}</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          backgroundColor: "#666666",
          margin: 7,
          padding: 15,
          borderRadius: 20,
        }}
        onPress={handleBuyNowAll}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
            THANH TOÁN
          </Text>
          <Image source={require("../image/next.png")} />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  addressText: {
    marginRight: 15,
    fontSize: 14,
    fontWeight: "normal",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 40,
    marginLeft: 15,
    marginBottom: 7,
  },
  productContainer: {
    alignItems: "center",
    marginBottom: 10,
    padding: 0,
  },
  productBox: {
    backgroundColor: "white",
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  productImage: {
    width: 95,
    height: 95,
    borderRadius: 20,
  },
  productInfo: {
    flex: 1,
    marginLeft: 10,
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  productType: {
    fontSize: 14,
    color: "gray",
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 5,
  },
  editText: {
    position: "absolute",
    top: 0,
    right: 0,
    fontSize: 12,
    fontWeight: "bold",
    color: "#f00",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
  },
  buttonDel: {
    backgroundColor: "#C0C0C0",
    borderRadius: 10,
    padding: 5,
    position: "absolute",
    top: 2,
    right: 5,
  },
  buttonCheckbox: {
    flexDirection: "row",
    alignItems: "center",
    color: "gray",
  },
  buttonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "bold",
    marginLeft: 4,
  },
  buttonText1: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 4,
  },

  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    backgroundColor: "#C0C0C0",
    height: "100%",
    paddingHorizontal: 10,
    borderRadius: 8,
    marginHorizontal: 8,
    alignItems: "center",
  },

  quantityButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Cart;
