import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";

const AllDiaChi = ({ route, navigation }) => {
    const userID = route.params?.userID || '';
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const isFromThanhToan = route.params?.fromThanhToan || false;
    const isFromCart = route.params?.fromCart || false;
    useEffect(() => {
        if (!userID) {
            console.log('Không có user ID.', userID);
            return;
        }
        fetchAddresses();
    }, [userID]);

    const fetchAddresses = async () => {
        try {
            const response = await fetch(`https://md26bipbip-496b6598561d.herokuapp.com/address/${userID}`);
            const data = await response.json();
            setAddresses(data);
            if (data.length > 0 && !selectedAddress) {
                setSelectedAddress(data[0]);
            }
        } catch (error) {
            console.error('Lỗi', error);
        }
    };

    const renderAddressItem = ({ item }) => (
        <TouchableOpacity
            style={[styles.addressItem, item === selectedAddress && styles.selectedAddress]}
            onPress={() => {
                setSelectedAddress(item);
                if (isFromThanhToan) {
                    navigation.navigate('ThanhToanScreen', { selectedAddress: item });
                    return;
                }else  if (isFromCart){
                    navigation.navigate('Cart', { selectedAddress: item });
                }
                else {
                    navigation.navigate('ScreenAddresst', { userID });
                }

            }}
        >
            <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>{item.name}</Text>
            <Text>{item.label}: {item.address}</Text>
            <Text>Số điện thoại: {item.phone}</Text>
        </TouchableOpacity>
    );

    const navigateToScreenAddresst = () => {
        navigation.navigate('ScreenAddresst', { userID });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Danh sách địa chỉ</Text>
            {addresses.length === 0 ? (
                <Text>Không có địa chỉ nào.</Text>
            ) : (
                <FlatList
                    data={addresses}
                    keyExtractor={(item) => item._id}
                    renderItem={renderAddressItem}
                />
            )}
            <TouchableOpacity
                style={styles.addButton}
                onPress={navigateToScreenAddresst}
            >
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                    <Text style={{ color: "white", fontSize: 20, fontWeight: "bold", textAlign: "center" }}>
                        Thêm Địa chỉ
                    </Text>
                    <Image source={require("../../image/next.png")} style={{ marginLeft: 10 }} />
                </View>
            </TouchableOpacity>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        position: 'relative',
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    addressItem: {
        padding: 12,
        marginVertical: 8,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    addButton: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#3498db',
        paddingVertical: 15,
        alignItems: 'center',
    },
});

export default AllDiaChi;