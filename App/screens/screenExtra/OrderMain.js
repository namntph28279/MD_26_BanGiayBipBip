import * as React from 'react';
import {
    View,
    useWindowDimensions,
    Text,
    FlatList,
    TouchableOpacity,
    Image,
    TextInput,
    StyleSheet,
    Alert
} from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchDataAndSetToRedux, fetchDataOrder } from "../../redux/AllData";
import { getMonney } from "../../util/money";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import url from "../../api/url";


export default function OrderMain({ navigation }) {
    const layout = useWindowDimensions();
    const dataOrder = useSelector((state) => state.dataAll.dataDonHang);
    const dispatch = useDispatch();
    const [choXacNhanDon, setChoXacNhan] = useState([]);
    const [cholayHangDon, setlayHang] = useState([]);
    const [chogiaoHang, setGiaoHang] = useState([]);
    const [daGiaoHang, setDaGiaoHang] = useState([]);
    const [huyDonHang, setHuyDonHang] = useState([]);
    const [traDonHang, setTraDonHang] = useState([]);
    const [tatCaDon, setTatCaDon] = useState([]);
    const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);
    const [isReturnReasonVisible, setReturnReasonVisible] = useState(false);
    const [returnReason, setReturnReason] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            dispatch(fetchDataOrder())
        };
        const intervalId = setInterval(fetchData, 3000);
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        const filterchoXacNhanDon = dataOrder.filter(item => item.status === 0);
        setChoXacNhan(filterchoXacNhanDon)

        const filterlayHang = dataOrder.filter(item => item.status === 1);
        setlayHang(filterlayHang)

        const filterGiaoHang = dataOrder.filter(item => item.status === 2);
        setGiaoHang(filterGiaoHang)

        const filterDaGiaoHang = dataOrder.filter(item => item.status === 3);
        setDaGiaoHang(filterDaGiaoHang)

        const filterchoHuyDonHang = dataOrder.filter(item => item.status === 4 || item.status === 8);
        setHuyDonHang(filterchoHuyDonHang)

        const filterchoTraDonHang = dataOrder.filter(item => item.status === 5 || item.status === 6);
        setTraDonHang(filterchoTraDonHang)

        setTatCaDon(dataOrder)


    }, [dataOrder]);


    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'xacNhan', title: 'Chờ xác nhận' },
        { key: 'layHang', title: 'Chờ lấy hàng' },
        { key: 'giaoHang', title: 'Chờ giao hàng' },
        { key: 'giao', title: 'Đã giao' },
        { key: 'huy', title: 'Đã hủy' },
        { key: 'tra', title: 'Trả hàng' },
        { key: 'allSP', title: 'Tất cả đơn' },
    ]);


        const handleCancelOrder = async (item) => {
            try {
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
            const orderId = item._id;
            const response = await url.post(`/order/statusAPP/${orderId}`, {
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
                noiDung: returnReason,

            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log('returnReason:', returnReason);
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
        <View>
            {item.products.map((product) => {
                const productId = product.product;
                return (
                    <TouchableOpacity
                    key={product._id}
                        style={styles.frame}
                        onPress={() => {
                            // console.log('Item:', productId);
                            navigation.navigate('InformationLine',
                                {
                                    productId: product.product,
                                    orderId: item._id,
                                });
                        }}
                    >
                        <View style={styles.productBox}>
                            {item.products.map((product) => (

                                <View key={product._id} style={styles.productItemContainer}>
                                    <Image source={{ uri: product.img_product }} style={styles.productImage} />
                                    <View style={styles.productInfo}>
                                        <Text style={styles.productName}>{`ID sản phẩm: ${product.product}`}</Text>
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
                                <Text style={styles.orderStatus}>{`status ${(item.status)}`}</Text>
                            </View>
                            <View style={styles.buttonContainer}>
                                {item.status === 0 || item.status === 1 ? (
                                    <TouchableOpacity style={styles.cancelOrderButton} onPress={() => handleCancelOrder(item)}>
                                        <Ionicons name="close-outline" size={20} color="white" />
                                        <Text style={styles.cancelOrderButtonText}>Hủy mua</Text>
                                    </TouchableOpacity>
                                ) : null}
                            </View>
                            <View style={styles.buttonContainer}>
                                {item.status === 3 ? (
                                    <TouchableOpacity style={styles.cancelOrderButton}
                                        onPress={() => handleReturnOrder(item)}
                                    >
                                        <Ionicons name="close-outline" size={20} color="white" />
                                        <Text style={styles.cancelOrderButtonText}>Trả hàng</Text>
                                    </TouchableOpacity>
                                ) : null}


                                {isReturnReasonVisible && item.status === 3 && (
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
                                {item.status === 5 ? (
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
                )
            })}
        </View>
    );

    const choXacNhan = () => (

        <View>
            <FlatList
                style={styles.list}
                data={choXacNhanDon}
                keyExtractor={(item) => item._id.toString()}
                renderItem={renderItem}
            />
        </View>
    );

    const choLayHang = () => (
        <View>
            <FlatList
                style={styles.list}
                data={cholayHangDon}
                keyExtractor={(item) => item._id.toString()}
                renderItem={({ item }) => {
                    return renderItem({ item });
                }}
            />
        </View>
    );

    const choGiaoHang = () => (
        <View>
            <FlatList
                style={styles.list}
                data={chogiaoHang}
                keyExtractor={(item) => item._id.toString()}
                renderItem={({ item }) => {
                    return renderItem({ item });
                }}
            />
        </View>
    );
    const daGiao = () => (
        <View>
            <FlatList
                style={styles.list}
                data={daGiaoHang}
                keyExtractor={(item) => item._id.toString()}
                renderItem={({ item }) => {
                    return renderItem({ item });
                }}
            />
        </View>
    );

    const daHuy = () => (
        <View>
            <FlatList
                style={styles.list}
                data={huyDonHang}
                keyExtractor={(item) => item._id.toString()}
                renderItem={({ item }) => {
                    return renderItem({ item });
                }}
            />
        </View>
    );

    const traHang = () => (
        <View>
            <FlatList
                style={styles.list}
                data={traDonHang}
                keyExtractor={(item) => item._id.toString()}
                renderItem={({ item }) => {
                    return renderItem({ item });
                }}
            />
        </View>
    );

    const sanPhamDat = () => (
        <View>
            <FlatList
                style={styles.list}
                data={tatCaDon}
                keyExtractor={(item) => item._id.toString()}
                renderItem={({ item }) => {
                    // console.log('Item:', item); // Add this line to log the item
                    return renderItem({ item });
                }}
            />
        </View>
    );

    const renderScene = SceneMap({
        xacNhan: choXacNhan,
        layHang: choLayHang,
        giaoHang: choGiaoHang,
        giao: daGiao,
        huy: daHuy,
        tra: traHang,
        allSP: sanPhamDat,
    });


    return (
        <TabView
            navigationState={{ index, routes }}
            swipeEnabled={false}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width }}
            activeTintColor="black"
            inactiveTintColor="black"
            renderTabBar={props => (
                <TabBar
                    {...props}
                    scrollEnabled
                    activeColor="black"
                    inactiveColor="black"
                    indicatorStyle={{ backgroundColor: 'black' }}
                    style={{ backgroundColor: '#f2f4f8', }}
                />
            )}
        />
    );
}
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