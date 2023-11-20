import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Image,
    StyleSheet,
    Modal,
    TouchableWithoutFeedback,
    ActivityIndicator
} from 'react-native';
import { CheckBox } from "react-native-elements";
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from "@react-native-async-storage/async-storage";
import url from "../../api/url";
import { Alert } from 'react-native';
import { getMonney } from '../../util/money';
const ThanhToanScreen = ({ route, navigation }) => {
    const [selectedProducts, setSelectedProducts] = useState([]);
    const userID = route.params?.userID || '';
    const [soLuong,setSoLuong ]= useState();
    const [paymentMethod, setPaymentMethod] = useState('');
    const [shippingAddress, setShippingAddress] = useState('');
    const [isAddressSelected, setIsAddressSelected] = useState(false);
    const [isPaymentModalVisible, setPaymentModalVisible] = useState(false);
    const [isMomoSelected, setIsMomoSelected] = useState(false);
    const [isCODSelected, setIsCODSelected] = useState(false);
    //
    const [productTotal, setProductTotal] = useState(0);
    const [insuranceFee, setInsuranceFee] = useState(0);
    const [shippingFee, setShippingFee] = useState(30000);
    const [totalPayment, setTotalPayment] = useState(0);
    const [isPaymentSuccessModalVisible, setPaymentSuccessModalVisible] = useState(false);
    const [isPaymentFailureModalVisible, setPaymentFailureModalVisible] = useState(false);
    const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
    const [isCheckmarkVisible, setIsCheckmarkVisible] = useState(true);
    //


    useEffect(() => {
        console.log('Selected Products:', selectedProducts);
        if (!userID) {
            console.log('Không có user ID.', userID);
            return;
        }
        if (!isMomoSelected && !isCODSelected) {
            setIsCODSelected(true);
        }
    }, [userID]);
    useEffect(() => {
        setSelectedProducts(route.params?.selectedProducts || []);
    }, [route.params?.selectedProducts]);
    useEffect(() => {
        const fetchDefaultAddress = async () => {
            try {
                const defaultAddress = await AsyncStorage.getItem('DefaultAddress');
                if (defaultAddress) {
                    const parsedDefaultAddress = JSON.parse(defaultAddress);
                    setShippingAddress(parsedDefaultAddress);
                }
            } catch (error) {
                console.error('Lỗi lấy dữ liệu ', error);
            }
        };

        fetchDefaultAddress();
    }, []);
    useEffect(() => {
        calculateTotalAmount();
    }, [selectedProducts, insuranceFee, shippingFee]);

    useEffect(() => {
        calculateTotalAmount();
        if (route.params?.selectedAddress) {
            const selected = route.params.selectedAddress;
            setShippingAddress(selected);
        }
    }, [route.params?.selectedAddress]);

    const calculateTotalAmount = () => {
        let productTotal = 0;
        let productSoLuong = 0;
        selectedProducts.forEach((product) => {
            productSoLuong += product.quantity;
            productTotal += product.quantity * product.productPrice;
        });
        setSoLuong(productSoLuong);
        setProductTotal(productTotal);
        const insurance = productTotal * 0.01;
        setInsuranceFee(insurance > 3000 ? insurance : 3000);
        setInsuranceFee(insurance);
        const total = productTotal + insuranceFee + shippingFee;
        setTotalPayment(total);
    };


    const handleQuantityChange = (productId, action) => {
        const updatedProducts = selectedProducts.map((product) => {
            if (product.id === productId) {
                if (action === 'increase') {
                    return { ...product, quantity: product.quantity + 1 };
                } else if (action === 'decrease' && product.quantity > 1) {
                    return { ...product, quantity: product.quantity - 1 };
                }
            }
            return product;
        });

        setSelectedProducts(updatedProducts);
        calculateTotalAmount();
    };


    const renderProductItem = (product) => (
        <View key={product.productId} style={styles.productItem}>
            <Image source={{ uri: product.productImageURL }} style={styles.productImage} />
            <View style={styles.productDetails}>
                <Text>Giày: {product.productName}</Text>
                <Text>Màu: {product.selectedColor}</Text>
                <Text>Kích thước: {product.selectedSize.size_name}</Text>
                <Text>Giá: {getMonney(product.productPrice)}</Text>
                {/*<Text>id color: {product.selectedColorId}</Text>*/}
                <View style={styles.quantityContainer}>
                    <TouchableOpacity onPress={() => handleQuantityChange(product.id, 'decrease')}>
                        <Text style={styles.quantityButton}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantity}>{product.quantity}</Text>
                    <TouchableOpacity onPress={() => handleQuantityChange(product.id, 'increase')}>
                        <Text style={styles.quantityButton}>+</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );





    const handleAddressPress = () => {
        navigation.navigate('AllDiaChi', { userID, fromThanhToan: true, selectedProducts });

    };
    const handlePaymentSuccess = () => {
        setPaymentSuccessModalVisible(true);
    };

    const handlePaymentFailure = () => {
        setPaymentFailureModalVisible(true);
    };

    const handlePaymentModalClose = () => {
        setPaymentModalVisible(false);
        setPaymentSuccessModalVisible(false);
        setPaymentFailureModalVisible(false);
    };

    const handlePaymentMethodPress = () => {
        setPaymentModalVisible(true);
    };

    const handleMomoCheckboxChange = () => {
        setIsMomoSelected(true);
        setIsCODSelected(false);
    };

    const handleCODCheckboxChange = () => {
        setIsCODSelected(true);
        setIsMomoSelected(false);
    };
    const handleOrder = async () => {
        if (!shippingAddress) {
            Alert.alert('Hãy Thao Tác Lại', 'Vui lòng chọn địa chỉ nhận hàng trước khi thanh toán.');
            return;
        }
        const name = await AsyncStorage.getItem('Name1');
        try {
            const products = selectedProducts.map(product => ({

                product: product.productId,
                img_product:product.productImageURL,
                name_Product:product.productName,
                name_Size:product.selectedSize.size_name,
                name_Price:product.productPrice * product.quantity,
                name_Color:product.selectedColor,
                quantityProduct:product.quantity
            }));
            console.log(products)

            const orderData = {
                user: userID || '',
                customer_email: name || '',
                products: products || [],
                total_amount:totalPayment ,
                userName:shippingAddress.name,
                phone:shippingAddress.phone,
                address: shippingAddress.address,
                total_product:productTotal,
                total_insurance_amount:insuranceFee,
                total_shipping_fee:shippingFee,
                total_All:totalPayment,
                total_quantity:soLuong
            };



            const response = await url.post('/order/addOderDetail', orderData);

            if (response.status === 201) {
                const result = response.data;
                console.log('Đặt hàng thành công:', result);
                handlePaymentSuccess();
                setTimeout(() => {
                    setIsCheckmarkVisible(true);
                    setTimeout(() => {
                        setIsCheckmarkVisible(false);
                        setPaymentSuccessModalVisible(false);
                    }, 2000);
                }, 2000);
            } else {
                console.error('Lỗi đặt hàng:', response.status, response.statusText);
                console.error('Server response:', response.data);
                handlePaymentFailure();
                    setTimeout(() => {
                        setIsCheckmarkVisible(false);
                        setPaymentSuccessModalVisible(true);
                    }, 2000);
            }

        } catch (error) {
            console.error('Lỗi đặt hàng:', error);
            handlePaymentFailure();
            setTimeout(() => {
                setIsCheckmarkVisible(false);
                setPaymentSuccessModalVisible(true);
            }, 2000);
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.addressContainer} onPress={handleAddressPress}>

                <View>
                    <Text style={styles.addressLabel}>Địa chỉ nhận hàng:</Text>
                    <Text style={styles.addressText}>Tên: {shippingAddress.name}</Text>
                    <Text style={styles.addressText}>Số điện thoại: {shippingAddress.phone}</Text>
                    <Text style={styles.addressText}>Địa chỉ: {shippingAddress.label}: {shippingAddress.address}</Text>
                </View>
                <Icon name="globe" size={100} color="#1abc9c" />
            </TouchableOpacity>
            <ScrollView style={styles.scrollContainer}>
                {selectedProducts.map(renderProductItem)}
            </ScrollView>
            <View style={styles.paymentDetailsContainer}>
                <View style={styles.paymentDetailHeader}>
                    <Icon name="dollar" size={20} color="red" style={styles.invoiceIcon} />

                    <Text style={styles.paymentDetailHeaderText}>Chi Tiết Thanh Toán</Text>
                </View>
                <View style={styles.paymentDetailItem}>
                    <Text style={styles.detailLabel}>Tổng tiền hàng:</Text>
                    <Text style={styles.detailValue}>{getMonney(productTotal)}</Text>
                </View>
                <View style={styles.paymentDetailItem}>
                    <Text style={styles.detailLabel}>Phí bảo hiểm:</Text>
                    <Text style={styles.detailValue}>{getMonney(insuranceFee)}</Text>
                </View>
                <View style={styles.paymentDetailItem}>
                    <Text style={styles.detailLabel}>Phí vận chuyển:</Text>
                    <Text style={styles.detailValue}>{getMonney(shippingFee)}</Text>
                </View>
                <View style={styles.paymentDetailItem}>
                    <Text style={styles.detailLabel1}>Tổng thanh toán:</Text>
                    <Text style={styles.detailValue1}>{getMonney(totalPayment)}</Text>
                </View>
            </View>

            <TouchableOpacity style={styles.paymentMethodContainer} onPress={handlePaymentMethodPress}>
                <Icon name="credit-card" size={30} color="#3498db" />
                <View>
                    <Text style={styles.inputLabel}>Phương Thức Thanh Toán:</Text>
                    <Text style={{alignSelf: 'center'}}>{isMomoSelected ? 'MoMo' : isCODSelected ? 'Thanh Toán Khi Nhận Hàng' : ''}</Text>
                </View>
            </TouchableOpacity>
            <View style={styles.bottomContainer}>
                <View style={styles.totalAmountContainer}>
                    <Text style={styles.totalAmountText}>Tổng Tiền:</Text>
                    <Text style={styles.detailValue1}>{getMonney(totalPayment)}</Text>
                </View>
                <TouchableOpacity
                    style={{
                        backgroundColor: "#666666",
                        margin: 7,
                        padding: 15,
                        borderRadius: 20,
                    }}
                    onPress={handleOrder}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                        }}
                    >
                        <Text
                            style={{ color: "white", fontSize: 15, fontWeight: "bold", marginRight: 10 }}
                        >
                            THANH TOÁN
                        </Text>
                        <Image style={{
                            alignSelf:'center',
                        }} source={require("../../image/next.png")} />
                    </View>
                </TouchableOpacity>
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={isPaymentSuccessModalVisible}
                onRequestClose={handlePaymentModalClose}>
                <View style={styles.centeredView}>
                    <View style={styles.modalContent}>
                        {isCheckmarkVisible ? (
                            <>
                                <Icon name="check-circle" size={50} color="#1abc9c" />
                                <Text style={styles.modalTitle}>Thanh toán thành công!</Text>
                            </>
                        ) : (
                            <ActivityIndicator size="large" color="#1abc9c" />
                        )}
                    </View>
                </View>
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={isPaymentFailureModalVisible}
                onRequestClose={() => setPaymentFailureModalVisible(false)}>
                <View style={styles.centeredView}>
                    <View style={styles.modalContent}>
                        {isCheckmarkVisible ? (
                            <>
                                <Icon name="times-circle" size={50} color="red" />
                                <Text style={styles.modalTitle}>Thanh toán thất bại!</Text>
                            </>
                        ) : (
                            <ActivityIndicator size="large" color="#1abc9c" />
                        )}
                    </View>
                </View>
            </Modal>
            <Modal animationType="slide" transparent={true} visible={isPaymentModalVisible} onRequestClose={handlePaymentModalClose}>
                <TouchableWithoutFeedback onPress={handlePaymentModalClose}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Chọn phương thức thanh toán</Text>
                            <TouchableOpacity onPress={handleMomoCheckboxChange} style={styles.paymentIcon}>
                                <Icon name={isMomoSelected ? 'check-circle' : 'circle'} size={30} color="#000" width={40} />
                                <Text style={styles.paymentText}>Ví MoMo</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleCODCheckboxChange} style={styles.paymentIcon}>
                                <Icon name={isCODSelected ? 'check-circle' : 'circle'} size={30} color="#000" width={40}/>
                                <Text style={styles.paymentText}>Thanh Toán Khi Nhận Hàng</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handlePaymentModalClose} style={styles.modalCloseButton}>
                                <Text style={styles.modalCloseText}>Đóng</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
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
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        right: 0,
        marginBottom: 8,
        marginRight: 8,
        alignSelf: 'flex-end',
    },
    quantityButton: {
        fontSize: 18,
        fontWeight: 'bold',
        marginHorizontal: 8,
        color: '#3498db',
    },
    quantity: {
        fontSize: 16,
    },

    productItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingBottom: 16,
        backgroundColor: '#cbb9b9',
        borderRadius: 8,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    successModalContent: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
    },
    productImage: {
        width: 80,
        height: 80,
        marginRight: 16,
        marginTop: 10,
        marginLeft: 10,
        borderRadius: 8,
    },
    productDetails: {
        flex: 1,
        marginTop: 10,
        justifyContent: 'center',
    },
    productName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    inputLabel: {
        fontSize: 13,
        fontWeight:'bold',
        marginTop: 16,
        marginLeft:15,
        marginBottom: 8,
    },
    addressContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
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
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    totalAmountText: {
        fontSize: 14,
        fontWeight: 'bold',
        marginRight: 15,
    },
    orderButton: {
        backgroundColor: '#f39c12',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    orderButtonText: {
        color: '#ffffff',
        fontWeight: 'bold',
        marginLeft: 8,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    checkboxLabel: {
        marginLeft: 8,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        backgroundColor: 'transparent',
        borderWidth: 0,
        padding: 0,
        margin: 0,
    },
    checkboxText: {
        fontSize: 16,
        marginLeft: 8,
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    paymentIcon: {
        flexDirection: 'row',
    },
    paymentText: {
        marginTop: 10,
        fontSize: 16,
        width: 200
    },
    modalCloseButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#f39c12',
        borderRadius: 5,
    },
    modalCloseText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
    paymentDetailsContainer: {
        padding: 16,
        borderTopWidth: 2,
        borderTopColor: '#d71a1a',
        marginTop: 16,
        borderWidth: 2,
        borderColor: '#da0c0c',
    },

    paymentDetailItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    detailLabel: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    detailLabel1: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    detailValue: {
        fontSize: 10,
    },
    detailValue1: {
        fontSize: 16,
        color:'red',
        fontWeight:'bold'
    },
    invoiceIcon: {
        marginRight: 10,
    },
    paymentDetailHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    paymentDetailHeaderText: {
        fontSize: 18,
        fontWeight: 'bold',
    },



});

export default ThanhToanScreen;
