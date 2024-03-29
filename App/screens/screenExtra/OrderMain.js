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
import { io } from "socket.io-client";
import { getUrl } from "../../api/socketio";
import ipAddress from "../../api/config";


export default function OrderMain({ navigation }) {
    const layout = useWindowDimensions();
    const dataOrder = useSelector((state) => state.dataAll.dataDonHang);
    const dataUserID = useSelector((state) => state.dataAll.dataUserID);
    const dispatch = useDispatch();
    const [choXacNhanDon, setChoXacNhan] = useState([]);
    const [cholayHangDon, setlayHang] = useState([]);
    const [chogiaoHang, setGiaoHang] = useState([]);
    const [daGiaoHang, setDaGiaoHang] = useState([]);
    const [huyDonHang, setHuyDonHang] = useState([]);
    const [traDonHang, setTraDonHang] = useState([]);
    const [tatCaDon, setTatCaDon] = useState([]);
    const [returnReason, setReturnReason] = useState('');
    const [socket, setSocket] = useState(null);
    const [receivedOrders, setReceivedOrders] = useState([]);


    useEffect(() => {

        const fetchData = async () => {

            const socket = io(getUrl());

            socket.on('data-block', async (data) => {
                console.log('Nhận được sự kiện data-block:', data);
                try {
                    const idFromAsyncStorage = await AsyncStorage.getItem("Email");

                    if (idFromAsyncStorage === data.userId) {
                        await AsyncStorage.setItem("Email", "");
                        await AsyncStorage.setItem("DefaultAddress", "");
                        navigation.navigate('Login');

                    }

                } catch (error) {
                    console.error('Lỗi khi lấy dữ liệu từ AsyncStorage:', error);
                }
            });
            socket.on('data-deleted', (data) => {
                dispatch(fetchDataAndSetToRedux());
            });

            return () => {
                socket.disconnect();
            };
        };

        fetchData();
    }, [navigation]);

    const fetchData = async () => {
        console.log("start")//Khi component được tạo, gọi fetchData để lấy dữ liệu đơn hàng từ Redux store thông qua useSelector và dispatch.
        dispatch(fetchDataOrder())
    };
    useEffect(() => {
        const socketInstance = io(getUrl());
        setSocket(socketInstance);
        return () => {
            socketInstance.disconnect();
        };
    }, []);

    useEffect(() => {
        if (socket) {
            socket.on('server-send', function (data) {
                fetchData() // mỗi khi có sự kiện từ máy chủ sẽ gọi lại fechData
            });
        }
    }, [socket]);

    useEffect(() => {
        //Sử dụng useEffect để lọc và cập nhật các danh sách đơn hàng theo trạng thái khác nhau 
        const filterchoXacNhanDon = dataOrder.filter(item => item.status === 0);
        setChoXacNhan(filterchoXacNhanDon)

        const filterlayHang = dataOrder.filter(item => item.status === 1);
        setlayHang(filterlayHang)

        const filterGiaoHang = dataOrder.filter(item => item.status === 2);
        setGiaoHang(filterGiaoHang)

        const filterDaGiaoHang = dataOrder.filter(item => item.status === 3 || item.status === 5 || item.status === 9 || item.status === 7);
        setDaGiaoHang(filterDaGiaoHang)

        const filterchoHuyDonHang = dataOrder.filter(item => item.status === 4 || item.status === 8);
        setHuyDonHang(filterchoHuyDonHang)

        const filterchoTraDonHang = dataOrder.filter(item => item.status === 6);
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
        Alert.alert(
            'Xác nhận hủy đơn hàng',
            'Bạn có chắc muốn hủy đơn hàng?',
            [
                { text: 'Hủy', style: 'cancel' },
                { text: 'Đồng ý', onPress: () => confirmCancelOrder(item) },
            ],
            { cancelable: false }
        );
    };
    const confirmCancelOrder = async (item) => {
        try {

            const orderId = item._id;

            const response = await url.post(`/order/statusAPP/${orderId}`);

            if (response.status === 200) {

                if (socket) {

                    socket.emit('client-send');
                } else {
                    fetchData();
                }
                Alert.alert("Hủy Thành Công")
            } else {
                console.error('Lỗi', response.statusText);
            }
        } catch (error) {
            console.error('Lỗi', error);
        }
    };

    const confirmReturnOrder = async (item) => {
        try {
            const orderId = item._id;

            // Thay đổi trạng thái và lý do trả hàng
            const response = await url.post(`/order/return/${orderId}`, {
                status: 'waiting_approval',  // Trạng thái chờ xét duyệt trả hàng
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                // Nếu thành công, cập nhật lại danh sách đơn hàng
                fetchData();

                if (socket) {
                    socket.emit('client-send');
                }

                Alert.alert("Đang chờ xét duyệt")
            }
        } catch (error) {
            console.error('Lỗi', error);
        }
    };

    const confirmOutOrder = async (item) => {
        try {
            const orderId = item._id;

            // Thay đổi trạng thái và lý do trả hàng
            const response = await url.post(`/order/out/${orderId}`, {
                status: 'hh',  // Trạng thái chờ xét duyệt trả hàng
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                // Nếu thành công, cập nhật lại danh sách đơn hàng
                fetchData();

                if (socket) {
                    socket.emit('client-send');
                }
                const updatedOrders = receivedOrders.map((order) => {
                    if (order._id === item._id) {
                        return { ...order, status: 7 }; // Assuming 7 means "Đã nhận"
                    }
                    return order;
                });

                setReceivedOrders(updatedOrders);
            }
        } catch (error) {
            console.error('Lỗi', error);
        }
    };

    const handleOutOrder = async (item) => {
        Alert.alert(
            'Xác nhận đã nhận đơn hàng',
            'Bạn có chắc chắn đã nhận đơn hàng?',
            [
                { text: 'Hủy', style: 'cancel' },
                { text: 'Đồng ý', onPress: () => confirmOutOrder(item) },
            ],
            { cancelable: false }
        );
    };


    const handleReturnOrderAndNavigate = async (item, returnReason) => {
        // Thực hiện xử lý trả hàng
        confirmReturnOrder(item);

        // Chuẩn bị nội dung tin nhắn
        let currentDate = new Date();
        let formattedDate = `${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}`;
        //Tạo một biến returnMessage chứa nội dung tin nhắn.

        let returnMessage = `Đã yêu cầu trả hàng với mã đơn hàng: ${item._id},${formattedDate} . Lý do: `;

        // Thêm mã đơn hàng và lý do trả hàng vào tin nhắn. Trong trường hợp này, chỉ có một lý do cụ thể là "Sản phẩm không đúng mô tả."
        switch (returnReason) {
            case 'wrong_description':
                returnMessage += 'Tôi muốn trả đơn hàng.';
                break;
        }
        const name = await AsyncStorage.getItem('Name');
        await url.post("/home/chatShop", { user: dataUserID, fullName: name, beLong: "user", conTenMain: returnMessage, status: "true" });

        socket.emit('client-send');
        // Chuyển màn hình InformationLine và gửi tin nhắn
        navigation.navigate("ChatScreen");
    };

    const getStatusText = (status) => {
        if (returnReason) {
            return 'Chờ duyệt';
        }
        switch (status) {
            case 0:
                return 'Chờ xác nhận';
            case 1:
                return 'Chờ lấy hàng';
            case 2:
                return 'Chờ giao hàng';
            case 3:
                return 'Đã giao';
            case 4:
            case 8:
                return 'Đã hủy';
            case 5:
            case 6:
                return 'Trả hàng';
            default:
                return 'không';
        }
    };
    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.frame}
            onPress={() => {
                // console.log('Item:', productId);
                navigation.navigate('InformationLine',
                    {
                        orderId: item._id,
                    });
            }}
        >
            <View style={styles.productBox}>
                {item.products.map((product) => (
                    <View key={product._id} style={styles.productItemContainer}>
                        <Image source={{ uri: product.img_product.replace('http://localhost', ipAddress) }} style={styles.productImage} />
                        <View style={styles.productInfo}>
                            {/* <Text style={styles.productName}>{`ID sản phẩm: ${product.product}`}</Text> */}
                            <Text style={styles.productName}>{`${product.name_Product}`}</Text>
                            <Text>{`Màu: ${product.name_Color}`}</Text>
                            <Text>{`Size: ${product.name_Size}`}</Text>
                            <View style={styles.quantityAndPriceContainer}>
                                <Text>{`SL: ${product.quantityProduct}`}</Text>
                                <Text style={{ color: '#FF0000', fontWeight: 'bold' , marginRight:10}}>{`Giá: ${getMonney(product.name_Price)}`}</Text>
                            </View>

                            {/* <View><Text style={styles.productItemContainer1}></Text></View> */}
                        </View>
                    </View>
                ))}

                <View style={styles.orderStatusContainer}>

                    <Text style={styles.orderStatus}>{`Tổng sản phẩm thành tiền: ${getMonney(item.total_amount)}`}</Text>

                    <TouchableOpacity
                        style={{
                            ...styles.orderStatusContainer,
                            borderRadius: 10,
                            overflow: 'hidden',
                        }}
                        onPress={() => {
                            Alert.alert(getStatusText(item.status));
                        }}
                    >
                        {/* <Text style={styles.orderStatus1}>{`Trạng Thái: ${getStatusText(item.status)}`}</Text> */}
                    </TouchableOpacity>

                </View>
                <View style={styles.buttonContainer}>
                    {item.status === 0 || item.status === 1 ? (
                        <TouchableOpacity style={styles.cancelOrderButton} onPress={() => handleCancelOrder(item)}>
                            <Ionicons name="close-outline" size={20} color="white" />
                            <Text style={styles.cancelOrderButtonText}>Hủy mua</Text>
                        </TouchableOpacity>
                    ) : null}
                </View>

                <View style={styles.buttonContainer22}>
                    {item.status === 3 && (
                        <Text>Lưu ý: Đơn hàng chỉ được hoàn trả trong 7 ngày! </Text>
                    )}
                </View>

                <View style={styles.buttonContainer}>
                    {item.status === 3 && (
                        <TouchableOpacity style={styles.cancelOrderButton}
                            onPress={() => handleReturnOrderAndNavigate(item, 'wrong_description')}
                        >
                            <Text style={styles.cancelOrderButtonText}>Trả hàng</Text>
                        </TouchableOpacity>
                    )}

                    {/* {item.status === 3 && (
                        <TouchableOpacity style={styles.cancelOrderButton}
                            onPress={() => handleOutOrder(item)}
                        >
                            <Text style={styles.cancelOrderButtonText}>Đã nhận</Text>
                        </TouchableOpacity>
                    )} */}
                </View>


                <View style={styles.buttonContainer22}>
                    {item.status === 5 && (

                        <Text>Lưu ý: Đơn hàng chỉ được hoàn trả trong 7 ngày! </Text>

                    )}
                </View>


                <View style={styles.buttonContainer}>
                    {item.status === 5 && (
                        <Text style={styles.cancelOrderButtonText2}>Đang yêu cầu trả hàng</Text>
                    )}
                </View>


                <View style={styles.buttonContainer}>
                    {item.status === 7 && (
                        <Text style={styles.cancelOrderButtonText2}>Đã giao hàng thành công</Text>
                    )}
                </View>
                <View style={styles.buttonContainer}>
                    {item.status === 9 && (
                        <Text style={styles.cancelOrderButtonText3}>Từ chối trả hàng</Text>
                    )}
                </View>

                <View>
                    {item.status === 6 ? (
                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate("ChatScreen");
                            }}
                        >
                            <Text style={styles.cancelOrderButtonText1}>Hãy liên hệ với shop để được hỗ trợ !</Text>
                        </TouchableOpacity>
                    ) : null}
                </View>
            </View>
        </TouchableOpacity>
    )

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
                renderItem={renderItem}
            />
        </View>
    );

    const choGiaoHang = () => (
        <View>
            <FlatList
                style={styles.list}
                data={chogiaoHang}
                keyExtractor={(item) => item._id.toString()}
                renderItem={renderItem}
            />
        </View>
    );
    const daGiao = () => (
        <View>
            <FlatList
                style={styles.list}
                data={daGiaoHang}
                keyExtractor={(item) => item._id.toString()}
                renderItem={renderItem}
            />
        </View>
    );

    const daHuy = () => (
        <View>
            <FlatList
                style={styles.list}
                data={huyDonHang}
                keyExtractor={(item) => item._id.toString()}
                renderItem={renderItem}
            />
        </View>
    );

    const traHang = () => (
        <View>
            <FlatList
                style={styles.list}
                data={traDonHang}
                keyExtractor={(item) => item._id.toString()}
                renderItem={renderItem}
            />
        </View>
    );

    const sanPhamDat = () => (
        <View>
            <FlatList
                style={styles.list}
                data={tatCaDon}
                keyExtractor={(item) => item._id.toString()}
                renderItem={renderItem}
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
    orderStatus1: {
        marginLeft: 110,
        marginRight: 12,
        marginBottom: 10,
        color: 'blue',
        backgroundColor: '#ffff',
        borderWidth: 1,
        alignSelf: 'center',
        borderColor: 'black',
        borderRadius: 5,
        overflow: 'hidden',
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
        width: 120,
        height: 100,
        
        // marginTop: 5,
        alignItems: 'center',
       
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
        marginTop: 8,
    },
    cancelOrderButton1: {
        backgroundColor: 'red',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        // marginLeft: 2,

    },
    cancelOrderButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: 4,
    },
    cancelOrderButtonText1: {
        color: 'black',
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: 4,
    },
    cancelOrderButtonText2: {
        color: 'black',
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: 4,
        marginTop: 4,
    },
    cancelOrderButtonText3: {
        color: 'red',
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: 4,
        marginTop: 4,
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
        borderColor: '#EEEEEE',
        borderRadius: 10,
        borderWidth: 1,
        // borderBottomWidth: 1,
        marginVertical: 5, // Adjust the margin as needed
        backgroundColor:'#EEEEEE',
        height:100
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
       
    },
    orderStatus: {
        marginLeft: 110,
        marginBottom: 5,

    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        // marginTop: 8,
    },
    buttonContainer22: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        fontSize: 10,
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