import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Image } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native';
import { useState } from 'react';
import { useEffect } from 'react';
import { getMonney } from "../util/money";

export default function AllShoes({ navigation }) {
    const [products, setProducts] = useState([]);
    const handleProductPress = (product) => {
        navigation.navigate('ProductDetail', { product });
    };
    useEffect(() => {
        const fetchData = async () => {
            let isLoading = true; // Định nghĩa biến isLoading
            try {
                const response = await fetch('https://md26bipbip-496b6598561d.herokuapp.com/');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error('Lỗi khi gọi API:', error);
            } finally {
                isLoading = false; // Đánh dấu rằng đã tải xong hoặc xảy ra lỗi
            }
        };

        fetchData();
    }, []);
    return (
        <View>

            <ScrollView contentContainerStyle={styles.contentContainer} showsHorizontalScrollIndicator={false}>
                {products.map((product) => (
                    <TouchableOpacity
                        key={product._id}
                        onPress={() => {
                            navigation.navigate("ProductDetail", { productId: product._id });
                        }}
                    >
                        <View style={styles.productFrame}>
                            <Image source={{ uri: product.product_image }} style={styles.productImage} />
                            <View>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={styles.productName}>{product.product_title}</Text>
                                </View>

                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={styles.productPrice}>Giá: </Text>

                                    <Text style={styles.productPrice}>{getMonney(product.product_price)}</Text>
                                </View>
                                <Text numberOfLines={1} style={styles.productAdditionalInfo}>{product.product_category} </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    productFrame: {
        margin: 10,
        borderRadius: 16,
        backgroundColor: 'white',
        alignItems: 'center',
        flexDirection: 'row'
    },
    productImage: {
        width: 123,
        height: 123,
        borderRadius: 16,
        margin: '5%'
    },
    productName: {
        fontSize: 17,
        width:'80%',
        height:'100%',
        fontWeight: 'bold',


    },
    productPrice: {
        fontSize: 15,
        color: '#888',
        marginTop: 10,

    },
    productAdditionalInfo: {
        fontSize: 14,
        color: '#888',
        marginTop: 10,
        width: 190

    },
})