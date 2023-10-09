
import React, { useState } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, SizeButton } from 'react-native';
import firebase from '../config/FirebaseConfig';
import { getDatabase, set, ref, push, remove, onValue } from "firebase/database";
import { getAuth } from "firebase/auth";
import { RectButton, ScrollView } from 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


function ProductDetail({ route, navigation }) {
    const { product } = route.params;
    const [quantity, setQuantity] = useState(1);

    const [selectedSize, setSelectedSize] = useState(null);

    const sizes = ['28', '29', '30', '31', '32', '33', '34'];

    const handleSizePress = (size) => {
        setSelectedSize(size);
    };

    const addToCart = () => {
        // Xử lý thêm sản phẩm vào giỏ hàng
        const auth = getAuth(firebase);
        const userId = auth.currentUser ? auth.currentUser.uid : null;
        if (userId) {
            const database = getDatabase(firebase);
            const productWithQuantity = { ...product, quantity };
            push(ref(database, `Cart/${userId}`), productWithQuantity)
                .then((newRef) => {
                    const cartItemId = newRef.key;
                    console.log('Người dùng với id:', userId);
                    console.log('Đã thêm sản phẩm vào giỏ hàng:', productWithQuantity);
                    console.log('ID của sản phẩm trong giỏ hàng:', cartItemId);
                    navigation.navigate('Cart');
                })
                .catch((error) => {
                    console.error('Lỗi thêm sản phẩm vào giỏ hàng:', error);
                });
        } else {
            console.log('Người dùng chưa đăng nhập');
            alert('Chưa đăng nhập, vui lòng đăng nhập');
            navigation.navigate('Login');
        }
    };
    const buyNow = () => {
        alert('Chức năng đang phát triển');
    };


    const increaseQuantity = () => {
        setQuantity(quantity + 1);
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };
    const addToFavo = () => {
        // Xử lý thêm sản phẩm vào giỏ hàng
        const auth = getAuth(firebase);

        // const userId = auth.currentUser.uid;
        const userId = auth.currentUser ? auth.currentUser.uid : null;
        if (userId) {
            const database = getDatabase(firebase);
            const productWithQuantity = { ...product, quantity };
            console.log(product);
            push(ref(database, `Favourite/${userId}`), productWithQuantity)
                .then((newRef) => {
                    const cartItemId = newRef.key;
                    console.log('người dùng với id:', userId);
                    console.log('Đã thêm sản phẩm vào yêu thích:', productWithQuantity);
                    console.log('ID của sản phẩm trong yêu thích:', cartItemId);
                })
                .catch((error) => {
                    console.error('Lỗi thêm sản phẩm vào yêu thích:', error);
                });
        } else {

            console.log('Người dùng chưa đăng nhập');
            alert('Chưa đăng nhập, vui lòng đăng nhập');
            navigation.navigate('Login');

        }
    };
    return (
        <View style={styles.container}>
            <Image source={{ uri: product.search_image }} style={styles.productImage} />
            <TouchableOpacity style={{ position: 'absolute', marginTop: 16, marginLeft: 350 }} onPress={addToFavo}>
                <Image source={require('../image/fa.png')} style={{ height: 30, width: 30, marginTop: 410 }} />
            </TouchableOpacity>
            <Text style={styles.productAdditionalInfo}>{product.product_additional_info}</Text>
            <View style={{ flexDirection: 'row' }}>
                {/* <Text style={styles.productName}>{product.brands_filter_facet}</Text> */}
                <Text style={styles.productPrice}>₫{product.price}</Text>
            </View>

            <View>
                <Text style={{ marginLeft: 20, marginTop: 5, marginBottom: 15 }}>Chỗ này là mô tả của giày</Text>
            </View>

            <View style={{ flexDirection: 'row', marginLeft: 13 }}>
                {sizes.map((size) => (
                    <TouchableOpacity
                        key={size}
                        style={[
                            styles.sizeButton,
                            selectedSize === size ? styles.selectedSizeButton : null,
                        ]}
                        onPress={() => handleSizePress(size)}
                    >
                        <Text
                            style={[
                                styles.quantityButtonTextsize,
                                selectedSize === size ? styles.selectedSizeText : null,
                            ]}
                        >
                            {size}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            

            <View style={styles.quantityContainer}>
                <TouchableOpacity style={styles.quantityButton} onPress={decreaseQuantity}>
                    <Text style={styles.quantityButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantityText}>{quantity}</Text>
                <TouchableOpacity style={styles.quantityButton} onPress={increaseQuantity}>
                    <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
            </View>

            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity style={styles.addToCartButton} onPress={addToCart}>
                    <Text style={styles.addToCartButtonText}>Thêm vào giỏ hàng</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.addToCartButton} onPress={buyNow}>
                    <Text style={styles.addToCartButtonText}>Mua Ngay</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
}

export default ProductDetail;

const styles = StyleSheet.create({
    // container: {
    //     flex: 1,
    //     alignItems: 'center',
    //     justifyContent: 'center',
    // },
    productImage: {
        width: '100%',
        height: '45%',
    },
    productName: {
        fontSize: 4,
        fontWeight: 'bold',
        marginTop: 16,
        marginLeft: 16
    },
    productPrice: {
        fontSize: 30,
        color: '#990000',
        marginTop: 5,
        marginLeft: 20
    },
    productAdditionalInfo: {
        fontSize: 34,
        opacity: 0.7,
        marginTop: 8,
        marginLeft: 16
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16,
        marginLeft: 10
    },
    quantityButton: {
        backgroundColor: '#666',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        marginHorizontal: 8,
    },
    sizeButton: {
        backgroundColor: '#FFF',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        marginHorizontal: 2,
    },
    quantityButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    quantityButtonTextsize: {
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold',
    },
    quantityText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    addToCartButton: {
        backgroundColor: '#666',
        paddingHorizontal: 20,
        paddingVertical: 18,
        borderRadius: 20,
        marginTop: 26,
        marginLeft: 25,
        marginHorizontal: 6,
        width: 200
    },
    addToCartButtonText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
        fontWeight: 'bold',
    },

    sizeButton: {
        backgroundColor: 'white',
        padding: 10,
        margin: 5,
        borderRadius: 5,
      },
      selectedSizeButton: {
        backgroundColor: 'black',
      },
      quantityButtonTextsize: {
        color: 'black',
      },
      selectedSizeText: {
        color: 'white',
      },
});
