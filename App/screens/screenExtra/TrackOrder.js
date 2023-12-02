import React, {useEffect, useState} from 'react';
import {View, Text, Image, StyleSheet, ScrollView, FlatList} from 'react-native';
import {getMonney} from "../../util/money";
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
const TrackOrder = ({ route }) => {
    const { orderData } = route.params;
    const { orderProductsList } = route.params;
    const [orderDataList, setOrderDataList] = useState(orderProductsList);
    const [reloadCount, setReloadCount] = useState(0);
    const [orderData1, setOrderData1] = useState('');
    const orderStatus = [
        { title: 'Chờ Xác Nhận', icon: 'circle', color: '#f1f109' },
        { title: 'Đang Chuẩn Bị Hàng', icon: 'circle', color: '#f1f109' },
        { title: 'Đang Vận Chuyển', icon: 'circle', color: '#f1f109' },
        { title: 'Đang Giao Hàng', icon: 'circle', color: '#f1f109' },
        { title: 'Đã Nhận Hàng', icon: 'circle', color: '#f1f109' },
    ];

    useEffect(() => {
        const getStatus = async () => {
            const storedStatus = await AsyncStorage.getItem('orderData1');
            if (storedStatus) {
                const parsedStatus = JSON.parse(storedStatus);
                setOrderData1(parsedStatus);
            }
        };
        getStatus();
    }, []);

    useEffect(() => {
        // console.log('datalist', orderProductsList,orderData);
        const intervalId = setInterval(async () => {
            setReloadCount((prevCount) => prevCount + 1);
            setOrderDataList((prevOrderDataList) => [...prevOrderDataList]);
            const storedStatus = await AsyncStorage.getItem('orderData1');
            if (storedStatus) {
                const parsedStatus = JSON.parse(storedStatus);
                setOrderData1(parsedStatus);
            }
        }, 1000);
        return () => clearInterval(intervalId);
    }, [orderProductsList, reloadCount]);

    const statusIndex = orderData1[0]?.status;
    const renderProduct = ({ item }) => (
        <View style={styles.productItem} key={item.id}>
            <Image source={{ uri: item.img_product }} style={styles.productImage} />
            <View style={styles.productText}>
                <Text style={styles.productName}>{`Sản Phẩm: ${item.name_Product}`}</Text>
                <Text>{`SL: ${item.quantityProduct}`}</Text>
                <Text style={styles.amount}>{`Giá: ${getMonney(item.name_Price)}`}</Text>
            </View>
        </View>
    );
    return (
        <View style={styles.container}>
            <View style={styles.orderDetails}>
                {orderDataList.map((order) => (
                    <FlatList
                        key={order.id}
                        data={order.products}
                        renderItem={renderProduct}
                        keyExtractor={(item) => item.id.toString()}
                    />

                ))}
            </View>
            {statusIndex === 4 || statusIndex === 8 ? (
                <View style={styles.orderStatusContainerCancelled}>
                    <Text style={styles.cancelledText}>Đơn hàng đã bị hủy</Text>
                </View>
            ) : statusIndex === 5 ? (
                <View style={styles.orderStatusContainerRefunded}>
                    <Text style={styles.refundedText}>Đơn hàng đã được hoàn</Text>
                </View>
            ) : (
                <View style={styles.orderStatusContainer}>
                    {orderStatus.map((status, index) => {
                        const isActive = index === statusIndex;
                        return (
                            <View key={index} style={styles.statusBox}>
                                <View style={[styles.statusIconContainer, { backgroundColor: isActive ? '#55f802' : status.color }]}>
                                    {isActive ? (
                                        <Icon name="check" size={14} color="white" style={styles.statusIcon} />
                                    ) : (
                                        <Icon name={status.icon} size={14} color="white" style={styles.statusIcon} />
                                    )}
                                </View>
                                <Text style={[styles.statusTitle, { color: isActive ? '#55f802' : 'black', fontWeight: isActive ? '700' : 'normal' }]}>{status.title}</Text>
                            </View>
                        );
                    })}
                </View>
            )}
            <View style={styles.deliveryAddressContainer}>
                <View style={styles.deliveryAddressTextContainer}>
                    <Text style={styles.deliveryAddressTitle}>Địa chỉ giao hàng</Text>
                    <View style={styles.deliveryTextContainer}>
                        <Text style={styles.deliveryText}>{`Người Nhận: ${orderData.userName}`}</Text>
                        <Text style={styles.deliveryText}>{`Địa chỉ: ${orderData.address}`}</Text>
                    </View>
                </View>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#666666",
    },
    iconContainer: {
        width: 24,
        height: 24,
        position: 'absolute',
        top: 50,
        left: 35,
        backgroundColor: 'white',
    },

    productItemContainer: {
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    productItemContentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    productItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingVertical: 15,
    },
    productImage: {
        width: 100,
        height: 100,
        borderRadius: 8,
        marginRight: 16,
    },
    icon: {
        width: 20,
        height: 20,
        position: 'absolute',
        top: 3,
        left: 3,
        backgroundColor: '#699BF7',
    },
    orderDetails: {
        width: 325,
        height: 125,
        position: 'absolute',
        top: '10%',
        alignSelf:'center',
        backgroundColor: 'white',
        borderRadius: 5,
        shadowColor: 'black',
        shadowOffset: { width: 2, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        flexDirection: 'row',
    },
    productName: {
        color: 'black',
        fontSize: 14,
        fontWeight: '700',
    },
    expectingDate: {
        color: 'black',
        fontSize: 11,
        fontWeight: '400',
    },
    orderId: {
        color: 'black',
        fontSize: 11,
        fontWeight: '400',
    },
    amount: {
        color: 'black',
        fontSize: 14,
        fontWeight: '700',
    },
    amountPaidContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    amountPaid: {
        width: 86,
        height: 18,
        backgroundColor: '#D9D9D9',
        borderRadius: 6,
    },
    amountPaidText: {
        marginLeft: 9,
        color: '#0FA958',
        fontSize: 10,
        fontWeight: '700',
    },
    productInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 20,
        marginBottom: 10,
    },
    productText: {
        flex: 1,
    },
    orderStatusContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: 325,
        alignItems:'center',
        height: 370,
        backgroundColor: 'white',
        borderRadius: 12,
        shadowColor: 'rgba(0, 0, 0, 0.25)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        marginTop:10,
        padding: 20,
    },
    statusBox: {
        marginTop:10,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statusIconContainer: {
        width: 28,
        height: 28,
        marginTop: 15,
        borderRadius: 9999,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statusIcon: {
        color: 'white',
    },
    statusTitle: {
        marginTop: 10,
        marginBottom:15,
        color: 'black',
        fontSize: 14,
        textAlign: 'center',
        wordWrap: 'break-word',
    },
    deliveryAddressContainer: {
        width: 325,
        height: 115,
        position: 'absolute',
        top: '80%',
        alignSelf:'center',
        backgroundColor: 'white',
        borderRadius: 12,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    deliveryAddressTitle: {
        color: 'black',
        fontSize: 16,
        alignSelf:'center',
        fontWeight: '700',
    },
    deliveryAddressText: {
        color: 'black',
        fontSize: 12,
        fontWeight: '400',
    },
    deliveryAddressTextContainer: {
        marginLeft: 10,
        flex: 1,
    },

    deliveryTextContainer: {
        flex: 1,
    },

    deliveryText: {
        marginTop:5,
        flex: 1,
        marginLeft: 5,
    },
    orderStatusContainerCancelled: {
        width: 325,
        alignItems: 'center',
        justifyContent: 'center',
        height: 150,
        backgroundColor: '#f10e09',
        borderRadius: 12,
        shadowColor: 'rgba(0, 0, 0, 0.25)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        marginTop: 10,
    },
    cancelledText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '700',
        textAlign: 'center',
    },
    orderStatusContainerRefunded: {
        width: 325,
        alignItems: 'center',
        justifyContent: 'center',
        height: 150,
        backgroundColor: '#f1f109',
        borderRadius: 12,
        shadowColor: 'rgba(0, 0, 0, 0.25)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        marginTop: 10,
    },
    refundedText: {
        color: 'black',
        fontSize: 16,
        fontWeight: '700',
        textAlign: 'center',
    },


});

export default TrackOrder;
