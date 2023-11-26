import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import url from '../../api/url';
import { getMonney } from '../../util/money';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Button } from 'react-native-elements';
const InformationLine = ({ route, navigation }) => {
  const [orderProductsList, setOrderProductsList] = useState([]);
  const [status, setStatus] = useState('Chờ xác nhận');
  const [loading, setLoading] = useState(true);
  const [tab1DataLoaded, setTab1DataLoaded] = useState(false);
  const [datalist, setDatalist] = useState(orderProductsList);
  const { productId } = route.params;
  const [reloadData, setReloadData] = useState(false);
  useEffect(() => {
    fetchDataList();
  }, []);
  useEffect(() => {
    const fetchDataInterval = setInterval(() => {
      fetchDataList();
    }, 1000);
    return () => clearInterval(fetchDataInterval);
  }, []);
  const fetchDataList = async () => {
    const email = await AsyncStorage.getItem('Email');
    const { orderId } = route.params;

    try {
      // console.log('Fetching data...');
      const response = await url.get(`/order/detail/${orderId}`);
      const data = response.data;

      if (!data) {
        console.log('Order not found');
        setLoading(false);
        return;
      }

      const formattedProducts = data.products.map((product) => ({
        id: product._id,
        productId: product.product,
        img_product: product.img_product,
        name_Product: product.name_Product,
        name_Size: product.name_Size,
        name_Price: product.name_Price,
        name_Color: product.name_Color,
        quantityProduct: product.quantityProduct,
      }));

      const formattedOrder = {
        id: data._id,
        user: data.user,
        status: data.status,
        customerEmail: data.customer_email,
        products: formattedProducts,
        total_amount: data.total_amount,
        total_insurance_amount: data.total_insurance_amount,
        total_shipping_fee: data.total_shipping_fee,
        address: data.address,
        userName: data.userName,
        phone: data.phone,
        orderDate: data.order_date,
      };

      setOrderProductsList([formattedOrder]);
      setDatalist([formattedOrder]);
      setLoading(false);
      setTab1DataLoaded(true);
      setStatus(data.status);
      const statusObject = [formattedOrder]
      await AsyncStorage.setItem('orderData1', JSON.stringify(statusObject));
      setTimeout(() => {
        setOrderProductsList([formattedOrder]);
      }, 1000);
      // console.log(formattedOrder)
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };
  return (
      <View style={styles.container}>
        <View style={styles.container}>
          {datalist.map((item) => (
              <View key={item.id}>
                <View style={styles.addressContainer}>
                  <View>
                    <Text style={styles.addressLabel}>Địa chỉ nhận hàng:</Text>
                    <Text style={styles.addressText}>{`Họ tên: ${item.userName}`}</Text>
                    <Text style={styles.addressText}>{`Số điện thoại: ${item.phone}`}</Text>
                    <Text style={styles.addressText}>{`Địa chỉ: ${item.address}`}</Text>
                  </View>
                  <Icon name="globe" size={100} color="#1abc9c" />
                </View>
                <TouchableOpacity
                    style={styles.paymentMethodContainer_chat1}
                    onPress={() => {
                      navigation.navigate("TrackOrder", { orderData: item ,orderProductsList: datalist});
                    }}
                >
                  <Text>Lịch Sử Giao Hàng</Text>
                </TouchableOpacity>
                <ScrollView style={styles.productScrollView}>
                  {item.products.map((product) => (
                      <View key={product.id} style={styles.productBox}>
                        <View style={styles.productItemContainer}>
                          <Image source={{ uri: product.img_product }} style={styles.productImage} />
                          <View style={styles.productInfo}>
                            <Text style={styles.productName}>{`${product.name_Product}`}</Text>
                            <Text>{`Màu: ${product.name_Color}`}</Text>
                            <Text>{`Size: ${product.name_Size}`}</Text>
                            <View style={styles.quantityAndPriceContainer}>
                              <Text>{`SL: ${product.quantityProduct}`}</Text>
                              <Text style={{ color: '#FF0000', fontWeight: 'bold' }}>{`Giá: ${getMonney(product.name_Price)}`}</Text>
                            </View>
                          </View>
                        </View>
                      </View>
                  ))}
                </ScrollView>

                <View style={styles.paymentDetailsContainer}>
                  <View style={styles.paymentDetailHeader}>
                    <Icon name="dollar" size={20} color="red" style={styles.invoiceIcon} />
                    <Text style={styles.paymentDetailHeaderText}>Chi Tiết Thanh Toán</Text>
                  </View>
                  <View style={styles.paymentDetailItem}>
                    <Text style={styles.detailLabel}>Tổng tiền hàng:</Text>
                    <Text style={styles.detailValue}>{`${getMonney(item.total_amount)}`}</Text>
                  </View>
                  <View style={styles.paymentDetailItem}>
                    <Text style={styles.detailLabel}>Phí bảo hiểm:</Text>
                    <Text style={styles.detailValue}>{`${getMonney(item.total_insurance_amount)}`}</Text>
                  </View>
                  <View style={styles.paymentDetailItem}>
                    <Text style={styles.detailLabel}>Phí vận chuyển:</Text>
                    <Text style={styles.detailValue}>{`${getMonney(item.total_shipping_fee)}`}</Text>
                  </View>
                  <View style={styles.paymentDetailItem}>
                    <Text style={styles.detailLabel1}>Tổng thanh toán:</Text>
                    <Text style={styles.detailValue1}>{`${getMonney(item.total_amount)}`}</Text>
                  </View>
                </View>

                <View style={styles.paymentMethodContainer}>
                  <Icon name="credit-card" size={30} color="#3498db" />
                  <View>
                    <Text style={styles.inputLabel}>Phương Thức Thanh Toán:</Text>
                    <Text style={{ alignSelf: 'center' }}>Thanh toán khi nhận hàng</Text>
                  </View>
                </View>

                <TouchableOpacity
                    style={styles.paymentMethodContainer_chat}
                    onPress={() => {
                      navigation.navigate("ChatScreen");
                    }}
                >
                  <Icon name="comment" size={20} color="green" />
                  <Text style={styles.textChat}>Liên hệ shop</Text>
                </TouchableOpacity>
              </View>
          ))}
        </View>
      </View>
  );

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  container1: {
    flex: 1,
    paddingHorizontal: 10,
    justifyContent: 'center',
    height: '100%',
  },
  btnTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 0.5,
    borderColor: '#EBEBEB',
    justifyContent: 'center',
  },
  textTab: {
    fontSize: 16,
    textAlign: 'center',
  },
  listTab: {
    flexDirection: 'row',
  },
  btnTabActive: {
    backgroundColor: '#E6838D',
  },
  textTabActive: {
    color: '#fff',
  },
  itemContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  scrollContainer: {
    flexDirection: 'row',
    height: 100,
  },
  itemBody: {
    flex: 1,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  itemName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  itemLogo: {
    padding: 10,
  },
  itemImage: {
    width: 50,
    height: 50,
  },
  list: {
    width: '100%',
    height: '100%',
  },
  frame: {
    marginRight: '3%',
    marginLeft: '3%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 40,
    marginLeft: 15,
    marginBottom: 7,
  },
  productScrollView: {
    maxHeight: 200,
    marginBottom: 10,
  },
  button2: {
    backgroundColor: '#444444',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 1,
  },
  title1: {
    color: 'white',
    fontSize: 16,
  },
  productContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  productBox: {
    backgroundColor: '#CCC',
    borderRadius: 20,
    flexDirection: 'column',
    alignItems: 'center',
    padding: 8,
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
  },
  productBox1: {
    backgroundColor: 'white',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    margin: 8,
    width: '95%',
  },
  productImage: {
    width: 100,
    height: 100,
    marginRight: 16,
    marginTop: 10,
    marginLeft: 10,
    borderRadius: 8,
  },
  productName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  productquantity: {
    fontSize: 15,
    marginBottom: 5,
  },
  cancelOrderButton: {
    backgroundColor: 'red',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  cancelOrderButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  editText: {
    position: 'absolute',
    top: 0,
    right: 0,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#f00',
  },
  productItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  productInfo: {
    marginLeft: 14,
    flex: 1,
  },
  quantityAndPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  orderStatusContainer: {
    marginTop: 10,
  },
  orderStatus: {
    fontWeight: 'bold',
    color: 'green',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  buyAgainButton: {
    backgroundColor: '#e81d1d',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  buyAgainButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  quantity: {
    fontSize: 16,
  },

  productDetails: {
    flex: 1,
    marginTop: 10,
    justifyContent: 'center',
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: 16,
    marginLeft: 15,
    marginBottom: 8,
  },
  addressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  addressContainer_chat: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  addressLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  addressText: {
    fontSize: 15,
    marginBottom: 8,
  },
  paymentMethodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop:10,
    marginBottom: 5,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  paymentMethodContainer_chat: {
    padding: 16,
    borderTopWidth: 2,
    borderTopColor: '#d71a1a',
    borderWidth: 2,
    borderColor: '#da0c0c',
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    paddingVertical: 12,
    borderRadius: 55,
  },
  paymentMethodContainer_chat1: {
    padding: 16,
    borderTopWidth: 2,
    borderTopColor: '#d71a1a',
    borderWidth: 2,
    backgroundColor:'violet',
    borderColor: '#da0c0c',
    flexDirection: "row",
    alignSelf: "center",
    borderBottomWidth: 1,
    paddingVertical: 12,
    borderRadius: 55,
  },
  textChat: {
    textAlign: "center",
    fontSize: 16,
    color: "black",
    marginLeft: 8,
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  totalAmountContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalAmountText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 15,
  },
  orderButton: {
    backgroundColor: '#f39c12',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  orderButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  checkboxLabel: {
    marginLeft: 8,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    padding: 0,
    margin: 0,
  },
  checkboxText: {
    fontSize: 16,
    marginLeft: 8,
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  paymentIcon: {
    flexDirection: 'row',
  },
  paymentText: {
    marginTop: 10,
    fontSize: 16,
    width: 200
  },
  modalCloseButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f39c12',
    borderRadius: 5,
  },
  modalCloseText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  paymentDetailsContainer: {
    padding: 16,
    borderTopWidth: 2,
    borderTopColor: '#d71a1a',
    marginTop: 25,
    borderWidth: 2,
    borderColor: '#da0c0c',
  },

  paymentDetailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  detailLabel1: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  detailValue: {
    fontSize: 13,
  },
  detailValue1: {
    fontSize: 16,
    color: 'red',
    fontWeight: 'bold'
  },
  invoiceIcon: {
    marginRight: 10,
  },
  paymentDetailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  paymentDetailHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});



export default InformationLine;
