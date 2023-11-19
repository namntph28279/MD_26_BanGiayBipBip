import React, { Children, useEffect, useState } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, ScrollView, SafeAreaView, Dimensions, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import url from "../../api/url";

const Oder = ({ route }) => {
    const [orderProductsList, setOrderProductsList] = useState([]);
    const [status, setStatus] = useState('Chờ xác nhận');
    const [loading, setLoading] = useState(true);

    const fetchDataList = async () => {
        const email = await AsyncStorage.getItem("Email");
        // const email = '654e236c065edfb9cbd65957';
        console.log("oder", email);
        try {
            console.log('Fetching data...');
            const response = await url.get('/order');

            const data = response.data;

            const formattedData = data
                .filter(order => order.user === email)
                .map(order => ({
                    id: order._id,
                    user: order.user,
                    status: order.status,
                    customerEmail: order.customer_email,
                    products: order.products.map(product => ({
                        id: product._id,
                        productId: product.product,
                        quantity: product.quantity,
                        colorId: product.colorId,
                        sizeId: product.sizeId,
                    })),
                    addressId: order.address,
                    orderDate: order.order_date,
                }));
            // console.log('Formatted data', formattedData);
            setOrderProductsList(formattedData);
            // setDatalist(formattedData);
            setLoading(false);

        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDataList();
        setStatusFilter('Chờ xác nhận')
    }, []);

    const navigation = useNavigation();

    const listTab = [
        { status: 'Chờ xác nhận' },
        { status: 'Chờ lấy hàng' },
        { status: 'Chờ giao hàng' },
        { status: 'Đã giao' },
        { status: 'Đã hủy' },
    ];

    const renderItem = ({ item, index }) => {
        const fetchProductDetails = async (productId) => {
            try {
                const productApiUrl = `http://192.168.100.6/product/${productId}`;
                const response = await fetch(productApiUrl);
                const productDetails = await response.json();

                return productDetails;
            } catch (error) {
                console.error('Error fetching product details:', error);
                return null;
            }
        };

        // Fetch details for each product in the order
        const productDetailsPromises = item.products.map(async (product) => {
            const details = await fetchProductDetails(product.productId);
            return {
                ...product,
                details,
            };
        });
        

        return (
            <TouchableOpacity
            style={styles.frame}
            onPress={() => {
                console.log('Product ID:', item.productId);
                navigation.navigate("InformationLine", { productId: item.product });
            }}
        >
            <View key={index} style={styles.productBox}>
                <Text>{`user ID: ${item.user}`}</Text>
                <Text>{`Status: ${item.status}`}</Text>
                <Text style={styles.itemName}>{`Email: ${item.customerEmail}`}</Text>
                {item.products.map(product => (
                    <View key={product.id}>
                        <Text>{`Product ID: ${product.productId}`}</Text>
                        <Text>{`Quantity: ${product.quantity}`}</Text>
                        {/* Display product details */}
                        {product.details && (
                            <View>
                                <Text>{`Product Name: ${product.details.product_title}`}</Text>
                                <Text>{`Product Price: ${product.details.product_price}`}</Text>
                                {/* Display colors */}
                                <Text>Colors:</Text>
                                {product.details.colors.map(color => (
                                    <View key={color._id}>
                                        <Text>{`Color Name: ${color.color_name}`}</Text>
                                        <Text>{`Color Image: ${color.color_image}`}</Text>
                                    </View>
                                ))}
                                {/* Display sizes */}
                                <Text>Sizes:</Text>
                                {product.details.sizes.map(size => (
                                    <View key={size._id}>
                                        <Text>{`Size Name: ${size.size_name}`}</Text>
                                        <Text>{`Size Quantity: ${size.size_quantity}`}</Text>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>
                ))}
            </View>
        </TouchableOpacity>
        );
    };

    const [datalist, setDatalist] = useState(orderProductsList);

    const setStatusFilter = setStatusFilter => {
        let filteredData;

        if (setStatusFilter === 'Chờ xác nhận') {
            // For 'Chờ giao hàng', show all items with status 'none'
            filteredData = orderProductsList.filter(e => e.status === 0);
        } else if (setStatusFilter === 'Chờ lấy hàng') {
            // For other statuses, filter based on the selected status
            filteredData = orderProductsList.filter(e => e.status === 1);
        } else if (setStatusFilter === 'Chờ giao hàng') {
            // For other statuses, filter based on the selected status
            filteredData = orderProductsList.filter(e => e.status === 3);
        } else if (setStatusFilter === 'Đã giao') {
            // For other statuses, filter based on the selected status
            filteredData = orderProductsList.filter(e => e.status === 4);
        } else if (setStatusFilter === 'Đã hủy') {
            // For other statuses, filter based on the selected status
            filteredData = orderProductsList.filter(e => e.status === 5);
        } else {
            // For 'All', show all items
            filteredData = orderProductsList;
        }

        setDatalist(filteredData);
        setStatus(setStatusFilter);
    };

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.container1}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContainer}
                >
                    <View style={styles.listTab}>
                        {listTab.map(e => (
                            <TouchableOpacity
                                key={e.status}
                                style={[styles.btnTab, status === e.status && styles.btnTabActive]}
                                onPress={() => {
                                    console.log(`Clicked on ${e.status} tab`);
                                    setStatusFilter(e.status);
                                }}
                            >
                                <Text style={[styles.textTab, status === e.status && styles.textTabActive]}>
                                    {e.status}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
                {loading ? (
                    <Text>Loading...</Text>
                ) : (
                    <FlatList
                        style={styles.list}
                        data={datalist}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderItem}
                    />
                )}
            </SafeAreaView>
            <View style={{ width: '100%', backgroundColor: 'black', height: 1 }} />
        </View>
    );
}

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
    listTab: {
        // height: '10%',
        textAlign: 'center',
        flexDirection: 'row',
        alignSelf: 'center',
        marginBottom: 20,
    },

    btnTab: {
        width: Dimensions.get('window').width / 3.5,
        flexDirection: 'row',
        borderWidth: 0.5,
        borderColor: '#EBEBEB',
        padding: 10,
        justifyContent: 'center',
    },

    textTab: {
        fontSize: 16,
    },

    btnTabActive: {
        backgroundColor: '#E6838D'
    },

    textTabActive: {
        color: '#fff'
    },

    itemContainer: {
        flexDirection: 'row',
        paddingVertical: 10,
    },

    scrollContainer: {
        // width: '1000%',
        height: 74,
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
        padding: 10
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
        marginBottom: 7

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
    // itemEmail: {
    //     width:'100%',
    // },

    productContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    productItemContainer: {
        flexDirection: 'row',
    },
    productBox: {
        backgroundColor: '#CCC',
        borderRadius: 20,
        flexDirection: 'column',
        alignItems: 'center',
        padding: 8,
        width: '100%',
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
        borderRadius: 20,
    },
    productInfo: {
        flex: 1,
        marginLeft: 16,
    },
    productName: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 8,
        marginTop: 8,
    },
    productquantity: {
        fontSize: 15,
        marginBottom: 5,
        // color:'blue'
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
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 8,
    },
    button: {
        backgroundColor: '#e81d1d',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 8,
    },
    button1: {
        backgroundColor: '#444444',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 4,
    },
    buttonText1: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 4,
    },
})

export default Oder;
