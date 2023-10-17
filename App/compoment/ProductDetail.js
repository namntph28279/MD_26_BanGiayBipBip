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
} from 'react-native';
import axios from 'axios';
import firebase from '../config/FirebaseConfig';
import { getDatabase, ref, push, get, child, onValue, remove } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getMonney } from "../util/money";


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
    useEffect(() => {
        const apiUrl = `https://md26bipbip-496b6598561d.herokuapp.com/product/${productId}`;

        fetch(apiUrl)
            .then((response) => response.json())
            .then((data) => {
                setProduct(data);
                setIsLoading(false);
                if (data && data.colors) {
                    setColorOptions(data.colors.map((color) => color.color_name));
                    setSelectedColor(data.colors[0].color_name);
                }
            })
            .catch((error) => {
                console.error('Lôi:', error);
                setIsLoading(false);
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
    // const colorOptions = ['Đỏ', 'xanh', 'vàng'];

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
    const favoRef = ref(database, `Favourite/${userId}`);

    // Kiểm tra xem sản phẩm đã tồn tại trong danh sách yêu thích
    get(favoRef).then((snapshot) => {
      if (snapshot.exists()) {
        const favoItems = snapshot.val();
        const productIds = Object.keys(favoItems);

        if (productIds.includes(product.id)) {
          // Sản phẩm đã tồn tại trong danh sách yêu thích, hiển thị thông báo
          alert('Sản phẩm đã tồn tại trong danh sách yêu thích.');
        } else {
          // Sản phẩm chưa tồn tại trong danh sách yêu thích, thêm sản phẩm vào danh sách
          const productWithQuantity = { ...product, quantity };

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
        }
      } else {
        // Danh sách yêu thích chưa tồn tại, tạo nó và thêm sản phẩm đầu tiên
        const productWithQuantity = { ...product, quantity };
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
      }
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
                        {isLoading ? (
                            <ActivityIndicator size="large" color="#0000ff" />
                        ) : (
                            <>
                                {product && (
                                    <Image source={{ uri: product.product_image }} style={styles.productImage} />
                                )}
                                {product && (
                                    <Text style={styles.productAdditionalInfo}>{product.product_title}</Text>
                                )}
                                <TouchableOpacity
                                    style={styles.favoriteButton}
                                    onPress={addToFavo}
                                >
                                    <HeartIcon isLiked={isLiked} onPress={handlePress} />
                                </TouchableOpacity>
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
                                            <Text>{color}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>

                                <ScrollView
                                    style={styles.sizeOptionsContainer}
                                    horizontal={true}
                                    showsHorizontalScrollIndicator={false}
                                >
                                    {sizeOptions.map((size, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={[
                                                styles.optionButton,
                                                selectedSize === size && styles.selectedOptionSize,
                                            ]}
                                            onPress={() => selectSize(size)}
                                        >
                                            <Text>{size}</Text>
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
                                    <TouchableOpacity style={styles.addToCartButton} onPress={addToCart}>
                                        <Text style={styles.addToCartButtonText}>Thêm vào giỏ hàng</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.addToCartButtonBuy} onPress={buyNow}>
                                        <Text style={styles.addToCartButtonText1}>Mua Ngay</Text>
                                    </TouchableOpacity>

                                </View>

                            </>
                        )}
                    </View>
                );
                //hiển
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
                    width: 200
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
                selectedOption: {
                    backgroundColor: 'grey',
                    color: 'black',
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