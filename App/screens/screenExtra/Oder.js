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
    Modal,
    Alert,
    TextInput
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import url from '../../api/url';
import { getMonney } from '../../util/money';
import Ionicons from 'react-native-vector-icons/Ionicons';
const Order = ({ route }) => {
    const [orderProductsList, setOrderProductsList] = useState([]);
    const [status, setStatus] = useState('Chờ xác nhận');
    const [loading, setLoading] = useState(true);
    const [tab1DataLoaded, setTab1DataLoaded] = useState(false);
    const [isCancelModalVisible, setCancelModalVisible] = useState(false);
    const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);
    const [isReturnReasonVisible, setReturnReasonVisible] = useState(false);
    const [returnReason, setReturnReason] = useState('');

    useEffect(() => {
        fetchDataList();
    }, []);

    useEffect(() => {
        setStatusFilter('Chờ xác nhận');
    }, [orderProductsList]);

    const fetchDataList = async () => {
        const email = await AsyncStorage.getItem('Email');
        try {
            console.log('Fetching data...');
            const response = await url.get('/order/addOderDetail/All');
            const data = response.data;

            const formattedData = data
                .filter((order) => order.user === email)
                .map((order) => ({
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
                    total_amount: order.total_amount,
                    orderDate: order.order_date,
                }));

            setOrderProductsList(formattedData);
            // setDatalist(formattedData);
            setLoading(false);
            setTab1DataLoaded(true);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    const navigation = useNavigation();

    const listTab = [
        { status: 'Chờ xác nhận' },
        { status: 'Chờ lấy hàng' },
        { status: 'Chờ giao hàng' },
        { status: 'Đã giao' },
        { status: 'Đã hủy' },
        { status: 'Trả hàng' },
        { status: 'Tất cả sản phẩm đã đặt' },
    ];
    const handleCancelOrder = async (item) => {
        try {
            // Show confirmation dialog
            Alert.alert(
                'Xác nhận hủy đơn hàng',
                'Bạn có chắc muốn hủy đơn hàng?',
                [
                    { text: 'Hủy', style: 'cancel' },
                    { text: 'Đồng ý', onPress: () => confirmCancelOrder(item) },
                ],
                { cancelable: false }
            );
        } catch (error) {
            console.error('Lỗi', error);
        }
    };
    const confirmCancelOrder = async (item) => {
        try {
            const orderId = item.id;
            const response = await url.post(`/order/status/${orderId}`, {
                noiDung: 'Không muốn mua nữa...',
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                setCancelModalVisible(false);
                setSuccessModalVisible(true);
                showSuccessModal();
                fetchDataList();
            } else {
                console.error('Lỗi', response.statusText);
            }
        } catch (error) {
            console.error('Lỗi', error);
        }
    };
    const hideSuccessModal = () => {
        setSuccessModalVisible(false);
    };
    const showSuccessModal = () => {
        setSuccessModalVisible(true);
        setTimeout(() => {
            hideSuccessModal();
        }, 2000);
    };

    const renderSuccessModal = () => (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isSuccessModalVisible}
            onRequestClose={hideSuccessModal}
        >
            <TouchableOpacity
                style={styles.modalBackground}
                activeOpacity={1}
                onPress={hideSuccessModal}
            >
                <View style={styles.modalContainer}>
                    <Text>Xóa thành công</Text>
                </View>
            </TouchableOpacity>
        </Modal>
    );
    const handleReturnOrder = async (item) => {
        try {
            // Kiểm tra xem đơn hàng có ở tab "Đã giao" không
            if (item.status === 3) { // 3 là mã trạng thái của "Đã giao", điều này có thể thay đổi tùy vào mã trạng thái của bạn
                // Hiển thị TextInput khi ấn vào nút "Trả hàng"
                setReturnReasonVisible(true);
            } else {
                // Nếu đơn hàng không ở tab "Đã giao", có thể hiển thị cảnh báo hoặc không làm gì cả
                Alert.alert('Lưu ý', 'Bạn chỉ có thể trả hàng cho các đơn hàng ở tab "Đã giao".');
            }
        } catch (error) {
            console.error('Lỗi', error);
        }
    };

    const confirmReturnOrder = async (item) => {
        try {
            const orderId = item.id;

            if (!returnReason) {
                Alert.alert('Lưu ý', 'Vui lòng nhập lý do trả hàng.');
                return;
            }
            const response = await url.post(`/order/return/${orderId}`, {
                noiDung: 'Trả hàng',
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log('Server Response:', response); // Log the response

            if (response.status === 200) {
                setCancelModalVisible(false);
                setSuccessModalVisible(true);
                showSuccessModal();
                fetchDataList();
                setReturnReasonVisible(false); // Ẩn TextInput sau khi xác nhận trả hàng
                setReturnReason('');
            } else {
                console.error('Lỗi', response.statusText);
            }
        } catch (error) {
            console.error('Lỗi', error);
        }
    };



    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.frame}
            onPress={() => {
                // console.log('Item:', item);
                navigation.navigate('InformationLine', { productId: item.products[0].productId, orderId: item.id }); // Truyền product ID vào params
            }}
        >
            <View style={styles.productBox}>
                {item.products.map((product) => (
                    <View key={product.id} style={styles.productItemContainer}>
                        <Image source={{ uri: product.img_product }} style={styles.productImage} />
                        <View style={styles.productInfo}>
                            {/* <Text style={styles.productName}>{`Tên sản phẩm: ${product.productId}`}</Text> */}
                            <Text style={styles.productName}>{`${product.name_Product}`}</Text>
                            <Text>{`Màu: ${product.name_Color}`}</Text>
                            <Text>{`Size: ${product.name_Size}`}</Text>
                            <View style={styles.quantityAndPriceContainer}>
                                <Text>{`SL: ${product.quantityProduct}`}</Text>
                                <Text style={{ color: '#FF0000', fontWeight: 'bold' }}>{`Giá: ${getMonney(product.name_Price)}`}</Text>
                            </View>
                            {/* <View><Text style={styles.productItemContainer1}></Text></View> */}
                        </View>
                    </View>
                ))}
                <View style={styles.orderStatusContainer}>

                    <Text style={styles.orderStatus}>{`Tổng sản phẩm thành tiền: ${getMonney(item.total_amount)}`}</Text>
                    {/* <Text style={styles.orderStatus}>{`Tổng ${(item.status)}`}</Text> */}
                </View>
                <View style={styles.buttonContainer}>
                    {status === 'Chờ xác nhận' || status === 'Chờ lấy hàng' ? (
                        <TouchableOpacity style={styles.cancelOrderButton} onPress={() => handleCancelOrder(item)}>
                            <Ionicons name="close-outline" size={20} color="white" />
                            <Text style={styles.cancelOrderButtonText}>Hủy mua</Text>
                        </TouchableOpacity>
                    ) : null}
                </View>

                <View style={styles.buttonContainer}>
                    {status === 'Đã giao' ? (
                        <TouchableOpacity style={styles.cancelOrderButton}
                            onPress={() => handleReturnOrder(item)}
                        >
                            <Ionicons name="close-outline" size={20} color="white" />
                            <Text style={styles.cancelOrderButtonText}>Trả hàng</Text>
                        </TouchableOpacity>
                    ) : null}


                    {isReturnReasonVisible && status === 'Đã giao' && (
                        <View style={{ padding: 10 }}>
                            <TextInput
                                placeholder="Nhập lý do trả hàng"
                                value={returnReason}
                                onChangeText={(text) => setReturnReason(text)}
                                style={{ borderWidth: 1, borderColor: 'gray', borderRadius: 5, padding: 8 }}
                            />
                            <TouchableOpacity onPress={() => confirmReturnOrder(item)}>
                                <Text style={styles.xacnhan}>Xác nhận trả hàng</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                <View>
                    {status === 'Trả hàng' ? (
                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate("ChatScreen");
                            }}
                        >
                            <Text style={styles.cancelOrderButtonText1}>Mọi thắc mắc về đơn hàng hãy liên hệ đến shop ngay !</Text>
                        </TouchableOpacity>
                    ) : null}
                </View>
            </View>
        </TouchableOpacity>
    );


    const [datalist, setDatalist] = useState(orderProductsList);

    const setStatusFilter = (setStatusFilter) => {
        let filteredData;

        if (setStatusFilter === 'Chờ xác nhận') {
            filteredData = orderProductsList.filter((e) => e.status === 0);
        } else if (setStatusFilter === 'Tất cả sản phẩm đã đặt') {
            filteredData = orderProductsList;
        } else {
            filteredData = orderProductsList.filter(
                (e) => e.status === listTab.findIndex((tab) => tab.status === setStatusFilter)
            );
        }
        // console.log('Filtered Data:', filteredData); // Log filtered data
        setDatalist(filteredData);
        setStatus(setStatusFilter);

    };

    return (
        <View style={styles.container}>
            {/* {renderSuccessModal()} */}
            <SafeAreaView style={styles.container1}>
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={listTab}
                    keyExtractor={(item) => item.status}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[styles.btnTab, status === item.status && styles.btnTabActive]}
                            onPress={() => {
                                console.log(`Clicked on ${item.status} tab`);
                                setStatusFilter(item.status);
                            }}
                        >
                            <Text style={[styles.textTab, status === item.status && styles.textTabActive]}>
                                {item.status}
                            </Text>
                        </TouchableOpacity>
                    )}
                />
                <FlatList
                    style={styles.list}
                    data={datalist}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                />
            </SafeAreaView>
            <View style={{ width: '100%', backgroundColor: 'black', height: 1 }} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    xacnhan: {
        alignContent: 'center',
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
        backgroundColor: '#F33B3B',
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
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
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
        backgroundColor: '#E1E1E1',
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
        height: 70,
        marginRight: 16,
        // marginTop: 5,
        alignItems: 'center',
        marginLeft: 10,
        borderRadius: 8,
    },
    productName: {
        fontWeight: 'bold',
        fontSize: 16,
        // marginBottom: 5,
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
        // borderWidthColor: '#ddd',
        borderColor: '#CECDCD',
        borderRadius: 10,
        borderWidth: 1,
        // borderBottomWidth: 1,
        marginVertical: 5, // Adjust the margin as needed
    },
    // productItemContainer1: {
    //     flexDirection: 'row',
    //     alignItems: 'center',
    //     marginBottom: 10,
    //     // marginTop: 10,
    //     borderBottomColor: 'red',
    //     borderBottomWidth: 1,
    //     marginVertical: 5, // Adjust the margin as needed
    // },
    productInfo: {
        marginLeft: 14,
        flex: 1,
    },
    quantityAndPriceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    orderStatusContainer: {
        // marginTop: 5,
    },
    orderStatus: {
        marginLeft: 110,
        marginBottom: 10,

    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        // marginTop: 8,
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

export default Order;
