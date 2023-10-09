import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Image,
    Text,
    TouchableOpacity,
    Modal,
    ScrollView,
} from 'react-native';
import firebase from '../config/FirebaseConfig';
import { getDatabase, ref, push, get, child, onValue } from 'firebase/database';
import { getAuth } from 'firebase/auth';

function ProductDetail({ route, navigation }) {
    const { product } = route.params;

    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [isModalVisible, setModalVisible] = useState(false);
    const [isBuyNowModalVisible, setBuyNowModalVisible] = useState(false);
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const addToCart = () => {
        if (selectedColor && selectedSize) {
            const auth = getAuth(firebase);
            const userId = auth.currentUser ? auth.currentUser.uid : null;
            if (userId) {
                const database = getDatabase(firebase);
                const productWithAttributes = {
                    ...product,
                    color: selectedColor,
                    size: selectedSize,
                    quantity,
                };
                push(ref(database, `Cart/${userId}`), productWithAttributes)
                    .then((newRef) => {
                        navigation.navigate('Cart');
                    })
                    .catch((error) => {
                        console.error('Lỗi thêm vào giỏ hàng:', error);
                    });
            } else {
                console.log('Vui lòng đăng nhập để tiếp tục');
                alert('Vui lòng đăng nhập để tiếp tục');
                navigation.navigate('Login');
            }
        } else {
            console.log('chưa chọn màu sắc hoặc kích cỡ');
            alert('chưa chọn màu sắc hoặc kích cỡ');
        }
    };

    const colorOptions = ['đỏ', 'xanh', 'vàng'];
    const sizeOptions = ['28', '29', '30', '31'];

    const selectColor = (color) => {
        setSelectedColor(color);
    };

    const selectSize = (size) => {
        setSelectedSize(size);
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
    const toggleBuyNowModal = () => {
        setBuyNowModalVisible(!isBuyNowModalVisible);
    };
    const buyNow = () => {
        toggleBuyNowModal();
    };

    return (
        <View style={styles.container}>
            <Image source={{ uri: product.search_image }} style={styles.productImage} />
            <TouchableOpacity style={{ position: 'absolute', marginTop: 16, marginLeft: 350 }} onPress={addToFavo}>
                <Image source={require('../image/fa.png')} style={{ height: 40, width: 40, }} />
            </TouchableOpacity>
            <View style={{ flexDirection: 'row' }}>
                <Text style={styles.productName}>{product.brands_filter_facet}</Text>
                <Text style={styles.productPrice}>{product.price}</Text>
            </View>
            <Text style={styles.productAdditionalInfo}>{product.product_additional_info}</Text>

            <TouchableOpacity style={styles.addToCartButton} onPress={toggleModal}>
                <Text style={styles.addToCartButtonText}>Thêm vào giỏ hàng</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addToCartButton} onPress={buyNow}>
                <Text style={styles.addToCartButtonText}>Mua Ngay</Text>
            </TouchableOpacity>

            <Modal visible={isModalVisible} transparent animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity
                            style={styles.closeModalButton}
                            onPress={toggleModal}>
                            <Text style={styles.closeModalButtonText}>X</Text>
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>Bảng Chọn Kích Cỡ</Text>
                        <Text style={{fontSize:15}}>Màu Sắc:</Text>
                        <ScrollView
                            style={styles.colorOptionsContainer}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}>
                            {colorOptions.map((color, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.optionButton,
                                        selectedColor === color && styles.selectedOption,
                                    ]}
                                    onPress={() => selectColor(color)}>
                                    <Text>{color}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        <Text style={{fontSize:15}}>Size:</Text>
                        <ScrollView
                            style={styles.sizeOptionsContainer}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}>
                            {sizeOptions.map((size, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.optionButton,
                                        selectedSize === size && styles.selectedOption,
                                    ]}
                                    onPress={() => selectSize(size)}>
                                    <Text>{size}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        <View style={styles.quantityContainer}>
                            <Text>Số Lượng:</Text>
                            <TouchableOpacity
                                style={styles.quantityButton}
                                onPress={decreaseQuantity}>
                                <Text style={styles.quantityButtonText}>-</Text>
                            </TouchableOpacity>
                            <Text style={styles.quantityText}>{quantity}</Text>
                            <TouchableOpacity
                                style={styles.quantityButton}
                                onPress={increaseQuantity}>
                                <Text style={styles.quantityButtonText}>+</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                            style={styles.addToCartButton}
                            onPress={() => {
                                addToCart();
                                toggleModal();
                            }}>
                            <Text style={styles.addToCartButtonText}>Thêm vào Giỏ hàng</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <Modal visible={isBuyNowModalVisible} transparent animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity
                            style={styles.closeModalButton}
                            onPress={toggleBuyNowModal}>
                            <Text style={styles.closeModalButtonText}>X</Text>
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>Bảng Chọn Kích Cỡ</Text>
                        <Text style={{fontSize:15}}>Màu Sắc:</Text>
                        <ScrollView
                            style={styles.colorOptionsContainer}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}>
                            {colorOptions.map((color, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.optionButton,
                                        selectedColor === color && styles.selectedOption,
                                    ]}
                                    onPress={() => selectColor(color)}>
                                    <Text>{color}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        <Text style={{fontSize:15}}>Size:</Text>
                        <ScrollView
                            style={styles.sizeOptionsContainer}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}>
                            {sizeOptions.map((size, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.optionButton,
                                        selectedSize === size && styles.selectedOption,
                                    ]}
                                    onPress={() => selectSize(size)}>
                                    <Text>{size}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        <View style={styles.quantityContainer}>
                            <Text>Số Lượng:</Text>
                            <TouchableOpacity
                                style={styles.quantityButton}
                                onPress={decreaseQuantity}>
                                <Text style={styles.quantityButtonText}>-</Text>
                            </TouchableOpacity>
                            <Text style={styles.quantityText}>{quantity}</Text>
                            <TouchableOpacity
                                style={styles.quantityButton}
                                onPress={increaseQuantity}>
                                <Text style={styles.quantityButtonText}>+</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                            style={styles.addToCartButton}
                            onPress={() => {
                                buyNow();
                                toggleBuyNowModal();
                            }}>
                            <Text style={styles.addToCartButtonText}>Mua Ngay</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
        height: 300,
    },
    favoriteButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        backgroundColor: 'transparent',
    },
    favoriteIcon: {
        width: 40,
        height: 40,
    },
    productInfo: {
        flexDirection: 'row',
        marginTop: 16,
    },
    productName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 16,
        marginLeft: 16
    },
    productPrice: {
        fontSize: 18,
        color: '#990000',
        marginTop: 20,
        marginLeft: 40
    },
    productAdditionalInfo: {
        fontSize: 14,
        marginTop: 8,
        marginLeft: 16
    },
    addToCartButton: {
        backgroundColor: '#666',
        paddingHorizontal: 20,
        paddingVertical: 18,
        borderRadius: 20,
        marginTop: 26,
    },
    addToCartButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },

    colorOptionsContainer: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    sizeOptionsContainer: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    optionButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginVertical: 4,
    },
    selectedOption: {
        backgroundColor: '#666',
        color: 'white',
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        marginTop:5,
    },
    quantityButton: {
        backgroundColor: '#666',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        marginHorizontal: 8,
    },

    quantityButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    quantityText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    closeModalButton: {
        paddingVertical: 10,
        borderRadius: 8,
        alignSelf: 'center',
        position: 'absolute',
        top: 0,
        right: 10,
    },
    closeModalButtonText: {
        color: 'red',
        fontSize: 30,
        fontWeight: 'bold',
    },
});
