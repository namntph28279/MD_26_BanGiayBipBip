    import React, { useEffect, useState } from 'react';
    import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
    import AsyncStorage from "@react-native-async-storage/async-storage";
    import { useFocusEffect } from '@react-navigation/native';
    import url from "../../api/url";
    const AllDiaChi = ({ route, navigation }) => {
        const userID = route.params?.userID || '';
        const selectedProducts = route.params?.selectedProducts || [];
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
        useFocusEffect(
            React.useCallback(() => {
                fetchAddresses();
            }, [userID])
        );
        // const fetchAddresses = async () => {
        //     try {
        //         const response = await fetch(`https://md26bipbip-496b6598561d.herokuapp.com/address/${userID}`);
        //         const data = await response.json();
        //         setAddresses(data);
        //         if (data.length > 0 && !selectedAddress) {
        //             setSelectedAddress(data[0]);
        //             AsyncStorage.setItem('DefaultAddress', JSON.stringify(data[0]));
        //         }
        //     } catch (error) {
        //         console.error('Lỗi', error);
        //     }
        // };
        const fetchAddresses = async () => {
            try {
                const response = await url.get(`/address/${userID}`);
                const data = response.data;
                setAddresses(data);
                if (data.length > 0 && !selectedAddress) {
                    setSelectedAddress(data[0]);
                    AsyncStorage.setItem('DefaultAddress', JSON.stringify(data[0]));
                }
            } catch (error) {
                console.error('Lỗi', error);
            }
        };

        const renderAddressItem = ({ item }) => (
            <TouchableOpacity style={[styles.addressItem, item === selectedAddress && styles.selectedAddress]}
            onPress={() => {
                setSelectedAddress(item);
                if (isFromThanhToan) {
                    navigation.navigate('ThanhToanScreen', { selectedAddress: item, userID, selectedProducts });
                } else if (isFromCart) {
                    navigation.navigate('Cart', { selectedAddress: item, userID ,selectedProducts});
                } else {
                    navigation.navigate('ScreenAddresst', { userID });
                }
            }}
            
            >
            <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>{item.name}</Text>
            <Text>Địa chỉ: {item.label}: {item.address}</Text>
            <Text>Số điện thoại: {item.phone}</Text>
            <View style={{ position: 'absolute', right: 0 }}>
                <TouchableOpacity onPress={() => {Delete(item)}}>
                    <Text style={{ color: 'red',marginTop: 30,marginRight: 20  }}>Xóa</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
        );


        const removeAddress = (addressToRemove) => {
            setAddresses([]);
        };

        const navigateToScreenAddresst = () => {
            navigation.navigate('ScreenAddresst', { userID });
        };
        const Delete = (item) => {
            url.delete(
                `/address/delete/${item._id}`
            )
                .then((response) => {
                console.log("Dữ liệu đã được gửi thành công lên máy chủ:", response.data);
                removeAddress(item);
                console.log(addresses.length);
                
                })  
                .catch((error) => {
                console.error("Lỗi trong quá trình gửi dữ liệu lên máy chủ:", error);
                console.log(deleteID._id);
                });
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
