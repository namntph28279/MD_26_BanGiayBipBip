
import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    Image,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    Modal,
    ScrollView,
    TouchableWithoutFeedback,
    SafeAreaView,
} from 'react-native';
import { Animated } from 'react-native';

import { PinchGestureHandler, State } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getMonney } from "../../util/money";
import AsyncStorage from "@react-native-async-storage/async-storage";
import url from "../../api/url";
import ipAddress from "../../api/config";

import io from 'socket.io-client';
import { getUrl } from "../../api/socketio";
import { useDispatch , useSelector} from 'react-redux';
import {fetchDataAndSetToRedux} from "../../redux/AllData";

function ProductDetail({ route, navigation }) {
    const { productId } = route.params;
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [isModalVisible, setModalVisible] = useState(false);
    const [isBuyNowModalVisible, setBuyNowModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [colorOptions, setColorOptions] = useState([]);
    const [cartItemId1, setCartItemId] = useState(null);
    const [colorImages, setColorImages] = useState({});
    const [isFavorite, setIsFavorite] = useState(false);
    const [userFavorites, setUserFavorites] = useState([]);
    const [sizeOptions, setSizeOptions] = useState([]);
    const [isImageModalVisible, setImageModalVisible] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [productImageURL, setProductImageURL] = useState(null);
    const [selectedColorData, setSelectedColorData] = useState(null);
    const [selectedColorImage, setSelectedColorImage] = useState(null);
    const [availableSizes, setAvailableSizes] = useState([]);

    // const userId = '64ab9784b65d14d1076c3477';
    const dispatch = useDispatch();
    useEffect(() => {
        const socket = io(getUrl());
        socket.on('data-deleted', (data) => {
            navigation.navigate('Home');
        });
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
        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                
                const response = await url.get(`/product/${productId}`);
                const data = response.data;

                setProduct(data);
                setIsLoading(false);

                if (data && data.colors) {
                    setColorOptions(data.colors.map((color) => color.color_name));

                    const firstColorId = data.colors[0]._id;

                    setSelectedColor(data.colors[0].color_name);
                    const colorImagesData = {};
                    data.colors.forEach((color) => {
                        colorImagesData[color.color_name] = color.color_image.replace('http://localhost', ipAddress);
                    });

                    setColorImages(colorImagesData);
                    setProductImageURL(data.product_image.replace('http://localhost', ipAddress));

                    setSelectedColorData(firstColorId);
                    fetchSizesForColor(firstColorId);
                }
            } catch (error) {
                console.error('Error:', error);
                setIsLoading(false);
            }
        };

        fetchData();
    }, [productId]);

    const fetchSizesForColor = async (colorId) => {
        try {
            const response = await url.get(`/sizes/${colorId}`);
            const data = response.data;

            setSizeOptions(data);
            const availableSizesData = data.map((size) => ({
                ...size,
                available: size.size_quantity > 0,
            }));
            setAvailableSizes(availableSizesData);
            setSelectedSize(availableSizesData.find((size) => size.available));
        } catch (error) {
            console.error('Error:', error);
        }
    };



    useEffect(() => {
        fetchUserFavorites();
    }, []);
    const fetchUserFavorites = async () => {
        try {
            const email = await AsyncStorage.getItem('Email');
            if (!email) {
                return;
            }

            const response = await url.get(`/favourite/${email}`);
            const favoriteItems = response.data;

            setUserFavorites(favoriteItems);

            const likedProductIds = favoriteItems.map((item) => item.product);
            const isProductLiked = likedProductIds.includes(productId);

            setIsLiked(isProductLiked);
        } catch (error) {
            console.error('Lỗi khi lấy sản phẩm trong favorites:', error);
        }
    };



    const openImageModal = () => {
        setImageModalVisible(true);
    };
    const closeModal = () => {
        setImageModalVisible(false);
    };

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };
    const handleToggleFavorite = () => {
        if (isLiked) {
            removeFavoriteProduct();
        } else {
            addFavoriteProduct();
        }
    };

    const addFavoriteProduct = async () => {
        try {
            const email = await AsyncStorage.getItem('Email');

            if (email) {
                await url.post('/favourite/add', {
                    product_id: productId,
                    user_id: email,
                });

                setIsLiked(true);
                fetchUserFavorites();
            } else {
                console.log('Vui lòng đăng nhập để tiếp tục');
                alert('Vui lòng đăng nhập để tiếp tục');
                navigation.navigate('Login');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };


    const removeFavoriteProduct = async () => {
        try {
            const email = await AsyncStorage.getItem('Email');

            if (email) {
                const favoriteItemToDelete = userFavorites.find((item) => item.product === productId);

                if (favoriteItemToDelete) {
                    const favoriteItemId = favoriteItemToDelete._id;

                    await url.delete(`/favourite/delete/${favoriteItemId}`);

                    setIsLiked(false);
                    fetchUserFavorites(); // Update the favorites list after deletion
                } else {
                    console.error('Không tìm thấy mục yêu thích với productId:', productId, userFavorites);
                }
            } else {
                console.log('Vui lòng đăng nhập để tiếp tục');
                alert('Vui lòng đăng nhập để tiếp tục');
                navigation.navigate('Login');
            }
        } catch (error) {
            console.error('Error:', error);
        }
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

    //


    const addToCart = async () => {
        try {
            const email = await AsyncStorage.getItem('Email');

            if (!email) {
                alert('Vui lòng đăng nhập');
                navigation.navigate('Login');
                return;
            }

            if (selectedColor && selectedSize) {
                const cartItem = {
                    user_id: email,
                    product_id: productId,
                    size_id: selectedSize._id,
                    color_id: selectedColorData,
                    quantity: quantity,
                };

                await url.post('/cart/add', cartItem);
                navigation.navigate('Giỏ Hàng');
            } else {
                console.log('chưa chọn màu sắc hoặc kích cỡ');
                alert('chưa chọn màu sắc hoặc kích cỡ');
            }
        } catch (error) {
            console.error('Lỗi thêm vào giỏ hàng:', error);
        }
    };
    const checkUserStatus = async () => {

        try {
            const email = await AsyncStorage.getItem("Email");

            if (email !== null) {
                const response = await url.get(`/user/${email}`);
                const userData = response.data;

                if (userData.status) {
                    const { date, block_reason } = userData;
                    console.log(`Tài khoản đã bị khóa. ngày: ${date}, nội dung: ${block_reason}`);
                    alert('Tài khoản của bạn đã bị chặn vào lúc: \n'+ userData.date);
                    await AsyncStorage.removeItem("Email");

                    navigation.navigate('Login');
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    const checkAddCard = () => {
        checkUserStatus();
        addToCart();
    }
    const checkBuy = () => {
        checkUserStatus();
        buyNow();
    }


    // const sizeOptions = ['28', '29', '30', '31'];
    // const colorOptions = ['Đỏ', 'xanh', 'vàng'];

    const selectColor = (color) => {
        setSelectedColor(color);
        if (product && product.colors) {
            const colorData = product.colors.find((c) => c.color_name === color);
            setSelectedColorData(colorData._id);
            fetchSizesForColor(colorData._id);
            //ảnh
            setSelectedColorImage(colorImages[color]);
        }
        console.log('màu của color', selectedColorData)
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
    //zoomimage
    const zoom = new Animated.Value(1);
    const handleZoom = Animated.event(
        [{ nativeEvent: { scale: zoom } }],
        { useNativeDriver: false }
    );
    const handleZoomState = ({ nativeEvent }) => {
        if (nativeEvent.state === State.END) {
            const newZoom = Math.min(Math.max(nativeEvent.scale, 1), 3);
            zoom.setValue(newZoom);
        }
    };
    //endzômimage



    const toggleBuyNowModal = () => {
        setBuyNowModalVisible(!isBuyNowModalVisible);
    };
    const buyNow = async () => {
        const email = await AsyncStorage.getItem('Email');
        if (!email) {
            alert("Vui lòng đăng nhập");
            navigation.navigate('Login');
            return
        }

        if (selectedColor && selectedSize) {
            if (email) {
                const productInfo = {
                    product: productId,
                    colorId: selectedSize.colorId,
                    sizeId: selectedSize._id,
                    quantity: quantity,
                    color: selectedColor,
                    size: selectedSize.size_name,
                };
                const updatedSelectedProducts = [...selectedProducts, productInfo];

                navigation.navigate('ThanhToanScreen', { userID: email, selectedProducts: updatedSelectedProducts });
            }
        } else {
            console.log('chưa chọn màu sắc hoặc kích cỡ');
            alert('chưa chọn màu sắc hoặc kích cỡ');
        }
    };


    return (
        <SafeAreaView style={styles.container}>
            {isLoading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <>
                    {/*{product && (*/}
                    {/*    <TouchableOpacity onPress={openImageModal}>*/}
                    {/*        <Image source={{ uri: product.product_image }} style={styles.productImage} />*/}
                    {/*    </TouchableOpacity>*/}
                    {/*)}*/}
                    {productImageURL && (
                        <TouchableOpacity onPress={openImageModal}>
                            {/*<Image source={{ uri: productImageURL }} style={styles.productImage} />*/}
                            <Image
                                source={{ uri: selectedColorImage || productImageURL }}
                                style={styles.productImage}
                            />
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity
                        style={styles.favoriteButton}
                        onPress={handleToggleFavorite}
                    >
                        <HeartIcon isLiked={isLiked} onPress={handleToggleFavorite} />
                    </TouchableOpacity>
                    <ScrollView>
                        {product && (
                            <Text style={styles.productAdditionalInfo}>{product.product_title}</Text>
                        )}
                        <View style={styles.priceContainer}>
                            {product && (
                                <Text style={styles.productPrice}>{getMonney(product.product_price)}</Text>
                            )}
                        </View>
                        {/* Add a product description */}
                        {product && (
                            <Text style={styles.productDescription}>{product.product_description}</Text>
                        )}
                        <ScrollView
                            style={styles.colorOptionsContainer}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                        >
                            {colorOptions.map((color, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.optionButton,
                                        selectedColor === color && styles.selectedOption,
                                    ]}
                                    onPress={() => selectColor(color)}
                                >
                                    {colorImages[color] && (
                                        <Image source={{ uri: colorImages[color] }} style={styles.colorOptionImage} />
                                    )}
                                    <Text style={styles.optionButtonText}>{color}</Text>

                                </TouchableOpacity>
                            ))}
                        </ScrollView>



                        <ScrollView
                            style={styles.sizeOptionsContainer}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                        >
                            {availableSizes.map((size, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.optionButton,
                                        selectedSize === size && styles.selectedOptionSize,
                                        !size.available && styles.disabledOption,
                                    ]}
                                    onPress={() => size.available && selectSize(size)}
                                    activeOpacity={size.available ? 0.8 : 1}
                                >
                                    <Text style={size.available ? {} : styles.disabledOptionText}>
                                        {size.size_name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>



                        <View style={styles.quantityContainer}>
                            <TouchableOpacity style={styles.quantityButton} onPress={decreaseQuantity}>
                                <Text style={styles.quantityButtonText}>-</Text>
                            </TouchableOpacity>
                            <Text style={styles.quantityText}>{quantity}</Text>
                            <TouchableOpacity style={styles.quantityButton} onPress={increaseQuantity}>
                                <Text style={styles.quantityButtonText}>+</Text>
                            </TouchableOpacity>

                        </View>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.addToCartButton} onPress={checkAddCard}>
                                <Text style={styles.addToCartButtonText}>Thêm vào giỏ hàng</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.addToCartButtonBuy} onPress={checkBuy}>
                                <Text style={styles.addToCartButtonText1}>Mua Ngay</Text>
                            </TouchableOpacity>

                        </View>
                    </ScrollView>

                </>
            )}

            <Modal
                visible={isImageModalVisible}
                transparent={true}
                animationType="slide"
            >
                <TouchableWithoutFeedback onPress={closeModal}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <TouchableOpacity style={styles.closeModalButton} onPress={() => setImageModalVisible(false)}>
                                <Text style={styles.closeModalButtonText}>X</Text>
                            </TouchableOpacity>

                            {product && (
                                <PinchGestureHandler onGestureEvent={handleZoom} onHandlerStateChange={handleZoomState}>
                                    {/*<Animated.Image*/}
                                    {/*    source={{ uri: product.product_image }}*/}
                                    {/*    style={[styles.productImage, { transform: [{ scale: zoom }] }]}*/}
                                    {/*        />*/}
                                    <Animated.Image
                                        source={{ uri: selectedColorImage || productImageURL }}
                                        style={[styles.productImage, { transform: [{ scale: zoom }] }]}
                                    />
                                </PinchGestureHandler>
                            )}
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </SafeAreaView>
    );
    //hiển
}

export default ProductDetail;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    productImage: {
        width: '100%',
        height: 250,
        resizeMode: 'contain',
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
    optionButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginVertical: 4,
        marginRight: 10,
    },
    selectedOption: {
        backgroundColor: 'grey',
        color: 'black',
    },
    disabledOption: {
        backgroundColor: '#ccc',
        opacity: 0.7,
    },

    disabledOptionText: {
        color: '#888',
    },

    optionButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 2,
        alignSelf: 'center'
    },
    colorOptionImage: {
        width: 100,
        height: 100,
        marginTop: 8,
    },
    productInfo: {
        flexDirection: 'row',
        marginTop: 16,
    },
    productColorImage: {
        width: 100,
        height: 100,
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
        flex: 1,
        backgroundColor: '#666',
        paddingHorizontal: 20,
        paddingVertical: 18,
        borderRadius: 20,
        marginTop: 26,
        marginHorizontal: 16,
        width: '40%',
        marginLeft: 15
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    addToCartButtonBuy: {
        flex: 1,
        backgroundColor: '#666',
        paddingHorizontal: 20,
        paddingVertical: 18,
        borderRadius: 20,
        marginTop: 26,
        marginHorizontal: 16,
        height: '75%',
        width: '40%',
    },
    addToCartButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        alignContent: 'center'
    },
    addToCartButtonText1: {
        color: 'white',
        fontSize: 16,
        marginTop: 10,
        fontWeight: 'bold',
        textAlign: 'center',
        alignContent: 'center'
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
        marginTop: 7,
        borderRadius: 8,
    },
    sizeOptionsContainer: {
        flexDirection: 'row',
        marginBottom: 10,
        marginLeft: 20,
        marginTop: 10,

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
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    closeModalButtonText: {
        color: 'black',
        fontSize: 20,
        fontWeight: 'bold',
    },
    imageModalContent: {
        width: '80%',
        height: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
    },


});