import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import url from '../../api/url';
import { getMonney } from '../../util/money';
import Ionicons from 'react-native-vector-icons/Ionicons';
const InformationLine = ({ route }) => {
  const [orderProductsList, setOrderProductsList] = useState([]);
  const [status, setStatus] = useState('Chờ xác nhận');
  const [loading, setLoading] = useState(true);
  const [tab1DataLoaded, setTab1DataLoaded] = useState(false);
  const [datalist, setDatalist] = useState(orderProductsList);
  const { productId } = route.params;
  // console.log('Data List:', datalist);
  useEffect(() => {
    fetchDataList();
  }, []);
  const fetchDataList = async () => {
    const email = await AsyncStorage.getItem('Email');
    // console.log('================================', email);
    try {
      console.log('Fetching data...');
      const response = await url.get('/order/addOderDetail/All');
      const data = response.data;
      const filteredData = data.filter((order) => order.user === email);

      if (productId) {
        const trimmedProductId = productId.trim();
        const productOrder = filteredData.find((order) => {
          return order.products.some((product) => product.product === trimmedProductId);
        });
        console.log('Filtered Data:', JSON.stringify(filteredData, null, 2));
        console.log('Product ID to find:', productId);

        if (productOrder) {
          const formattedProduct = {
            id: productOrder.id,
            user: productOrder.user,
            status: productOrder.status,
            customerEmail: productOrder.customer_email,
            products: productOrder.products.map((product) => ({
              id: product._id,
              productId: product.product,
              img_product: product.img_product,
              name_Product: product.name_Product,
              name_Size: product.name_Size,
              name_Price: product.name_Price,
              name_Color: product.name_Color,
              quantityProduct: product.quantityProduct,
            })),
            address: productOrder.address,
            userName: productOrder.userName,
            phone: productOrder.phone,
            orderDate: productOrder.order_date,
          };
          setOrderProductsList([formattedProduct]);
          setDatalist([formattedProduct]);
          setLoading(false);
          setTab1DataLoaded(true);
          setStatus(productOrder.status); // Set the status based on the order status
        } else {
          console.log(`Product with ID ${productId} not found`);
          setLoading(false);
        }
      } else {
        const formattedData = filteredData.map((order) => ({
          id: order._id,
          user: order.user,
          status: order.status,
          customerEmail: order.customer_email,
          products: order.products.map((product) => ({
            id: product._id,
            productId: product.product,
            img_product: product.img_product,
            name_Product: product.name_Product,
            name_Size: product.name_Size,
            name_Price: product.name_Price,
            name_Color: product.name_Color,
            quantityProduct: product.quantityProduct,
          })),
          address: order.address,
          userName: order.userName,
          phone: order.phone,
          orderDate: order.order_date,
        }));

        if (formattedData.length > 0) {
          setStatus(formattedData[0].status); // Set the status based on the first item in the array
        }

        setOrderProductsList(formattedData);
        setDatalist(formattedData);
        setLoading(false);
        setTab1DataLoaded(true);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };


  // const renderItem = ({ item }) => (
  //   <View>
  //     <View style={styles.productBox}>
  //       {item.products.map((product) => (
  //         <View key={product.id} style={styles.productItemContainer}>

  //           <Image source={{ uri: product.img_product }} style={styles.productImage} />
  //           <View style={styles.productInfo}>
  //             <Text style={styles.productName}>{`Tên sản phẩm: ${product.productId}`}</Text>
  //             <Text style={styles.productName}>{`Tên sản phẩm: ${product.name_Product}`}</Text>
  //             <Text>{`Màu: ${product.name_Color}`}</Text>
  //             <View style={styles.quantityAndPriceContainer}>
  //               <Text>{`SL: ${product.quantityProduct}`}</Text>
  //               <Text style={{ color: '#FF0000', fontWeight: 'bold' }}>{`Giá: ${getMonney(product.name_Price)}`}</Text>
  //             </View>
  //           </View>
  //         </View>
  //       ))}
  //       <View style={styles.orderStatusContainer}>
  //         <Text style={styles.orderStatus}>{`Trạng thái: ${item.status}`}</Text>
  //       </View>
  //     </View>
  //   </View>
  // );



  return (
    <View style={styles.container}>
      <View style={styles.container}>
        {datalist.map((item) => (
          <View key={item.id}>
            {item.products.map((product) => (
              <View key={product.id}>
                <View style={styles.orderStatusContainer}>
                  <Text>{`Địa chỉ: ${item.address}`}</Text>
                  <Text>{`Họ tên: ${item.userName}`}</Text>
                  <Text>{`Số điện thoại: ${item.phone}`}</Text>
                </View>
                <View style={styles.productBox}>
                  <View style={styles.productItemContainer}>
                    <Image source={{ uri: product.img_product }} style={styles.productImage} />
                    <View style={styles.productInfo}>
                      <Text style={styles.productName}>{`Product ID: ${product.productId}`}</Text>
                      <Text style={styles.productName}>{`Tên sản phẩm: ${product.name_Product}`}</Text>
                      <Text>{`Màu: ${product.name_Color}`}</Text>
                      <Text>{`Size: ${product.name_Size}`}</Text>
                      <View style={styles.quantityAndPriceContainer}>
                        <Text>{`SL: ${product.quantityProduct}`}</Text>
                        <Text style={{ color: '#FF0000', fontWeight: 'bold' }}>{`Giá: ${getMonney(product.name_Price)}`}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.orderStatusContainer}>
                    <Text style={styles.orderStatus}>{`Trạng thái: ${product.status}`}</Text>
                  </View>
                </View>

                <View style={{ width: '100%', backgroundColor: 'black', height: 1 }} />
              </View>
            ))}
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
    width: 80,
    height: 80,
    marginRight: 16,
    marginTop: 10,
    marginLeft: 10,
    borderRadius: 8,
  },
  productName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
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
});

export default InformationLine;
