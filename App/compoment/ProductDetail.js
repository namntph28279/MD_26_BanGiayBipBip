import React, {useEffect, useState} from 'react';
import {
    StyleSheet,
    View,
    Image,
    Text,
    TouchableOpacity,
    Modal,
    ScrollView,
} from 'react-native';
import axios from 'axios';
import firebase from '../config/FirebaseConfig';
import {getDatabase, ref, push, get, child, onValue, remove} from 'firebase/database';
import { getAuth } from 'firebase/auth';
import Icon from 'react-native-vector-icons/FontAwesome';


function ProductDetail({ route, navigation }) {
    const { productId } = route.params;
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [isModalVisible, setModalVisible] = useState(false);
    const [isBuyNowModalVisible, setBuyNowModalVisible] = useState(false);
    useEffect(() => {
        const apiUrl = `https://md26bipbip-496b6598561d.herokuapp.com/product/${productId}`;

        fetch(apiUrl)
            .then((response) => response.json())
            .then((data) => {
                setProduct(data);
            })
            .catch((error) => {
                console.error('Lôi:', error);
                return;
            });
    }, [productId]);


    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    // Hình trái tim
    const HeartIcon = ({ isLiked, onPress }) => (
        <TouchableOpacity onPress={onPress}>
            <Icon
                name={isLiked ? 'heart' : 'heart-o'}
                size={30}
                color={isLiked ? 'red' : 'black'}
            />
        </TouchableOpacity>
    );

    const [isLiked, setIsLiked] = useState(false);
    const checkIfProductIsLiked = () => {
        const auth = getAuth(firebase);
        const userId = auth.currentUser ? auth.currentUser.uid : null;
        if (userId) {
            const database = getDatabase(firebase);
            const favoRef = ref(database, `Favourite/${userId}`);

            get(favoRef).then((snapshot) => {
                if (snapshot.exists()) {
                    const favoItems = snapshot.val();
                    const productIds = Object.keys(favoItems);
                    if (productIds.includes(product.id)) {
                        // Sản phẩm đã tồn tại trong danh sách yêu thích, cập nhật trạng thái isLiked
                        setIsLiked(true);
                    }
                }
            });
        }
    };

    useEffect(() => {
        checkIfProductIsLiked();
    }, []);

    const handlePress = () => {
        if (isLiked) {
            removeProductFromFavo();
        } else {
            addToFavo();
        }
    };
    //


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

    const sizeOptions = ['28', '29', '30', '31'];
    const colorOptions = ['Đỏ', 'xanh', 'vàng'];

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
        const auth = getAuth(firebase);
        const userId = auth.currentUser ? auth.currentUser.uid : null;
        if (userId) {
            const database = getDatabase(firebase);
            const productWithQuantity = { ...product, quantity };

            // Thêm sản phẩm vào danh sách yêu thích
            push(ref(database, `Favourite/${userId}`), productWithQuantity)
                .then((newRef) => {
                    const cartItemId = newRef.key;
                    console.log('Người dùng với id:', userId);
                    console.log('Đã thêm sản phẩm vào yêu thích:', productWithQuantity);
                    console.log('ID của sản phẩm trong yêu thích:', cartItemId);

                    // Sau khi thêm vào danh sách yêu thích, cập nhật trạng thái isLiked
                    setIsLiked(true);
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


    const removeProductFromFavo = () => {
        // Xóa sản phẩm khỏi danh sách yêu thích
        const auth = getAuth(firebase);
        const userId = auth.currentUser ? auth.currentUser.uid : null;
        if (userId) {
            const database = getDatabase(firebase);
            const favoRef = ref(database, `Favourite/${userId}/${product.id}`);

            // Xóa sản phẩm
            remove(favoRef)
                .then(() => {
                    console.log('Sản phẩm đã bị xóa khỏi danh sách yêu thích');
                    setIsLiked(false); // Cập nhật trạng thái isLiked
                })
                .catch((error) => {
                    console.error('Lỗi xóa sản phẩm khỏi danh sách yêu thích:', error);
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
            {product && (
                <Image source={{ uri: product.product_image }} style={styles.productImage} />
            )}


            {product && (
                <Text style={styles.productAdditionalInfo}>{product.product_title}</Text>
            )}

            <View style={{ flexDirection: 'row' }}>
                {/* <Text style={styles.productName}>{product.brands_filter_facet}</Text> */}
                {product && (
                    <Text style={styles.productPrice}>₫{product.product_price}</Text>
                )}
            </View>

            {/* <View>
                <Text style= {{marginLeft:20, marginTop:15}}>
                    Chỗ này thêm mô tả của giày
                </Text>
            </View> */}


            {/* chọn màu */}
            <ScrollView
                style={[
                    styles.colorOptionsContainer,
                    selectedColor === 'Đỏ' && { backgroundColor: 'red' },
                    selectedColor === 'xanh' && { backgroundColor: 'blue' },
                    selectedColor === 'vàng' && { backgroundColor: 'yellow' },
                ]}
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

            {/* Chọn size */}
            <ScrollView
                style={styles.sizeOptionsContainer}
                horizontal={true}
                showsHorizontalScrollIndicator={false}>
                {sizeOptions.map((size, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.optionButton,
                            selectedSize === size && styles.selectedOptionSize,
                        ]}
                        onPress={() => selectSize(size)}>
                        <Text>{size}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* tăng giảm số lượng */}
            <View style={styles.quantityContainer}>
                <TouchableOpacity style={styles.quantityButton} onPress={decreaseQuantity}>
                    <Text style={styles.quantityButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantityText}>{quantity}</Text>
                <TouchableOpacity style={styles.quantityButton} onPress={increaseQuantity}>
                    <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>

                {/* Trái tim yêu thích */}
                <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} onPress={addToFavo}>
                    <HeartIcon isLiked={isLiked} onPress={handlePress} />
                </TouchableOpacity>

            </View>

            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity style={styles.addToCartButton} onPress={addToCart}>
                    <Text style={styles.addToCartButtonText}>Thêm vào giỏ hàng</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.addToCartButtonBuy} onPress={buyNow}>
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
        fontSize: 22,
        color: '#990000',
        marginTop: 10,
        marginLeft: 20
    },
    productAdditionalInfo: {
        fontSize: 24,
        marginTop: 8,
        marginLeft: 16
    },
    addToCartButton: {
        backgroundColor: '#666',
        paddingHorizontal: 20,
        paddingVertical: 18,
        borderRadius: 20,
        marginTop: 26,
        marginHorizontal: 16,
        width: '50%',
        marginLeft:15
    },
    addToCartButtonBuy: {
        backgroundColor: '#666',
        paddingHorizontal: 20,
        paddingVertical: 18,
        borderRadius: 20,
        marginTop: 26,
        marginHorizontal: 16,
        width: '29%',
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
        marginLeft: 20,
        marginTop: 15,
        borderRadius: 8,
        width: 175
    },
    sizeOptionsContainer: {
        flexDirection: 'row',
        marginBottom: 10,
        marginLeft: 20,
        marginTop: 10,

    },
    optionButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginVertical: 4,
    },
    selectedOptionSize: {
        backgroundColor: '#666',
        color: 'white',
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
        marginTop: 15,
        marginLeft: 14
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