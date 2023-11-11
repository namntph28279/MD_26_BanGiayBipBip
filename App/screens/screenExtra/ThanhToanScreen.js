import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native';

const ThanhToanScreen = ({ route, navigation }) => {
    const userID = route.params?.userID || '';
    const [totalAmount, setTotalAmount] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [shippingAddress, setShippingAddress] = useState('');

    const productList = [
        { id: 1, name: 'Sản phẩm A', quantity: 2, price: 20, image: require('../../image/logo.png') },
        { id: 2, name: 'Sản phẩm B', quantity: 1, price: 30, image: require('../../image/logo.png') },
    ];
    useEffect(() => {
        if (!userID) {
            console.log('Không có user ID.', userID);
            return;
        }
    }, [userID]);
    useEffect(() => {
        calculateTotalAmount();
        if (route.params?.selectedAddress) {
            const selected = route.params.selectedAddress;
            setShippingAddress(selected);
        }
    }, [route.params?.selectedAddress]);

    const handleOrder = () => {
    };

    const calculateTotalAmount = () => {
        let total = 0;
        productList.forEach((product) => {
            total += product.quantity * product.price;
        });
        setTotalAmount(total);
    };

    const renderProductItem = (product) => (
        <View key={product.id} style={styles.productItem}>
            <Image source={product.image} style={styles.productImage} />
            <View style={styles.productDetails}>
                <Text>{product.name}</Text>
                <Text>Số lượng: {product.quantity}</Text>
                <Text>Giá: {product.price} VNĐ</Text>
            </View>
        </View>
    );

    const handleAddressPress = () => {
        navigation.navigate('AllDiaChi', { userID, fromThanhToan: true });
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollContainer}>
                <TouchableOpacity style={styles.addressContainer} onPress={handleAddressPress}>
                    <Text style={styles.addressLabel}>Địa chỉ nhận hàng:</Text>
                    <Text style={styles.addressText}>Tên: {shippingAddress.name}</Text>
                    <Text style={styles.addressText}>Số điện thoại: {shippingAddress.phone}</Text>
                    <Text style={styles.addressText}>Địa chỉ: {shippingAddress.label}: {shippingAddress.address}</Text>
                </TouchableOpacity>
                {productList.map(renderProductItem)}
                <View style={styles.paymentMethodContainer}>
                    <Text style={styles.inputLabel}>Phương thức thanh toán:</Text>
                    <Text>{paymentMethod}</Text>
                </View>
            </ScrollView>
            <View style={styles.bottomContainer}>
                <View style={styles.totalAmountContainer}>
                    <Text style={styles.totalAmountText}>Tổng giá: {totalAmount} VNĐ</Text>
                </View>
                <TouchableOpacity style={styles.orderButton} onPress={handleOrder}>
                    <Text style={styles.orderButtonText}>Đặt hàng</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        flex: 1,
        padding: 16,
    },
    productItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingBottom: 16,
    },
    productImage: {
        width: 80,
        height: 80,
        marginRight: 16,
    },
    productDetails: {
        flex: 1,
    },
    inputLabel: {
        fontSize: 16,
        marginTop: 16,
        marginBottom: 8,
    },
    addressContainer: {
        marginBottom: 16,
    },
    addressLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    addressText: {
        marginBottom: 8,
    },
    paymentMethodContainer: {
        marginBottom: 16,
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
        alignItems: 'flex-start',
    },
    totalAmountText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    orderButton: {
        backgroundColor: '#f39c12',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    orderButtonText: {
        color: '#ffffff',
        fontWeight: 'bold',
    },
});

export default ThanhToanScreen;
