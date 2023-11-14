// import React, { useState, useEffect } from 'react';
// import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native';
//
// const ThanhToanScreen = ({ route, navigation }) => {
//     const userID = route.params?.userID || '';
//     const [totalAmount, setTotalAmount] = useState(0);
//     const [paymentMethod, setPaymentMethod] = useState('');
//     const [shippingAddress, setShippingAddress] = useState('');
//
//     const productList = [
//         { id: 1, name: 'Sản phẩm A', quantity: 2, price: 20, image: require('../../image/logo.png') },
//         { id: 2, name: 'Sản phẩm B', quantity: 1, price: 30, image: require('../../image/logo.png') },
//     ];
//     useEffect(() => {
//         if (!userID) {
//             console.log('Không có user ID.', userID);
//             return;
//         }
//     }, [userID]);
//     useEffect(() => {
//         calculateTotalAmount();
//         if (route.params?.selectedAddress) {
//             const selected = route.params.selectedAddress;
//             setShippingAddress(selected);
//         }
//     }, [route.params?.selectedAddress]);
//
//     const handleOrder = () => {
//     };
//
//     const calculateTotalAmount = () => {
//         let total = 0;
//         productList.forEach((product) => {
//             total += product.quantity * product.price;
//         });
//         setTotalAmount(total);
//     };
//
//     const renderProductItem = (product) => (
//         <View key={product.id} style={styles.productItem}>
//             <Image source={product.image} style={styles.productImage} />
//             <View style={styles.productDetails}>
//                 <Text>{product.name}</Text>
//                 <Text>Số lượng: {product.quantity}</Text>
//                 <Text>Giá: {product.price} VNĐ</Text>
//             </View>
//         </View>
//     );
//
//     const handleAddressPress = () => {
//         navigation.navigate('AllDiaChi', { userID, fromThanhToan: true });
//     };
//
//     return (
//         <View style={styles.container}>
//             <ScrollView style={styles.scrollContainer}>
//                 <TouchableOpacity style={styles.addressContainer} onPress={handleAddressPress}>
//                     <Text style={styles.addressLabel}>Địa chỉ nhận hàng:</Text>
//                     <Text style={styles.addressText}>Tên: {shippingAddress.name}</Text>
//                     <Text style={styles.addressText}>Số điện thoại: {shippingAddress.phone}</Text>
//                     <Text style={styles.addressText}>Địa chỉ: {shippingAddress.label}: {shippingAddress.address}</Text>
//                 </TouchableOpacity>
//                 {productList.map(renderProductItem)}
//                 <View style={styles.paymentMethodContainer}>
//                     <Text style={styles.inputLabel}>Phương thức thanh toán:</Text>
//                     <Text>{paymentMethod}</Text>
//                 </View>
//             </ScrollView>
//             <View style={styles.bottomContainer}>
//                 <View style={styles.totalAmountContainer}>
//                     <Text style={styles.totalAmountText}>Tổng giá: {totalAmount} VNĐ</Text>
//                 </View>
//                 <TouchableOpacity style={styles.orderButton} onPress={handleOrder}>
//                     <Text style={styles.orderButtonText}>Đặt hàng</Text>
//                 </TouchableOpacity>
//             </View>
//         </View>
//     );
//
//
// };
//
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//     },
//     scrollContainer: {
//         flex: 1,
//         padding: 16,
//     },
//     productItem: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginBottom: 16,
//         borderBottomWidth: 1,
//         borderBottomColor: '#ddd',
//         paddingBottom: 16,
//     },
//     productImage: {
//         width: 80,
//         height: 80,
//         marginRight: 16,
//     },
//     productDetails: {
//         flex: 1,
//     },
//     inputLabel: {
//         fontSize: 16,
//         marginTop: 16,
//         marginBottom: 8,
//     },
//     addressContainer: {
//         marginBottom: 16,
//     },
//     addressLabel: {
//         fontSize: 16,
//         fontWeight: 'bold',
//         marginBottom: 8,
//     },
//     addressText: {
//         marginBottom: 8,
//     },
//     paymentMethodContainer: {
//         marginBottom: 16,
//     },
//     bottomContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         padding: 16,
//         borderTopWidth: 1,
//         borderTopColor: '#ddd',
//     },
//     totalAmountContainer: {
//         alignItems: 'flex-start',
//     },
//     totalAmountText: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         marginBottom: 8,
//     },
//     orderButton: {
//         backgroundColor: '#f39c12',
//         paddingVertical: 10,
//         paddingHorizontal: 20,
//         borderRadius: 5,
//     },
//     orderButtonText: {
//         color: '#ffffff',
//         fontWeight: 'bold',
//     },
// });
//
// export default ThanhToanScreen;
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet ,Modal,TouchableWithoutFeedback} from 'react-native';
import { CheckBox } from "react-native-elements";
import Icon from 'react-native-vector-icons/FontAwesome';
const ThanhToanScreen = ({ route, navigation }) => {
    const selectedProducts = route.params?.selectedProducts || [];
    const userID = route.params?.userID || '';
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

    //

    const productList = [
        { id: 1, name: 'Sản phẩm A', quantity: 2, price: 20, image: require('../../image/logo.png') },
        { id: 2, name: 'Sản phẩm B', quantity: 1, price: 30, image: require('../../image/logo.png') },
    ];
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
        calculateTotalAmount();
        if (route.params?.selectedAddress) {
            const selected = route.params.selectedAddress;
            setShippingAddress(selected);
        }
    }, [route.params?.selectedAddress]);

    const calculateTotalAmount = () => {
        let productTotal = 0;
        selectedProducts.forEach((product) => {
            productTotal += product.quantity * product.productPrice;
        });
        setProductTotal(productTotal);
        const insurance = productTotal * 0.01;
        setInsuranceFee(insurance > 3000 ? insurance : 3000);
        setInsuranceFee(insurance);
        const total = productTotal + insuranceFee + shippingFee;
        setTotalPayment(total);
    };




    const renderProductItem = (product) => (
        <View key={product.productId} style={styles.productItem}>
            <Image source={{ uri: product.productImageURL }} style={styles.productImage} />
            <View style={styles.productDetails}>
                <Text>Giày: {product.productName}</Text>
                <Text>Số lượng: {product.quantity}</Text>
                <Text>Giá: {product.productPrice}</Text>
                <Text>Màu: {product.selectedColor}</Text>
                <Text>Kích thước: {product.selectedSize.size_name}</Text>
            </View>
        </View>
    );




    const handleAddressPress = () => {
        navigation.navigate('AllDiaChi', { userID, fromThanhToan: true, selectedProducts });

    };
    const handlePaymentMethodPress = () => {
        setPaymentModalVisible(true);
    };

    const handlePaymentModalClose = () => {
        setPaymentModalVisible(false);
    };

    const handleMomoCheckboxChange = () => {
        setIsMomoSelected(true);
        setIsCODSelected(false);
    };

    const handleCODCheckboxChange = () => {
        setIsCODSelected(true);
        setIsMomoSelected(false);
    };

    const handleOrder = () => {
        if (isMomoSelected) {

        } else if (isCODSelected) {

        }

    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.addressContainer} onPress={handleAddressPress}>
                <Icon name="globe" size={100} color="#1abc9c" />
                <View>
                    <Text style={styles.addressLabel}>Địa chỉ nhận hàng:</Text>
                    <Text style={styles.addressText}>Tên: {shippingAddress.name}</Text>
                    <Text style={styles.addressText}>Số điện thoại: {shippingAddress.phone}</Text>
                    <Text style={styles.addressText}>Địa chỉ: {shippingAddress.label}: {shippingAddress.address}</Text>
                </View>
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
                    <Text style={styles.detailValue}>{productTotal} VNĐ</Text>
                </View>
                <View style={styles.paymentDetailItem}>
                    <Text style={styles.detailLabel}>Phí bảo hiểm:</Text>
                    <Text style={styles.detailValue}>{insuranceFee} VNĐ</Text>
                </View>
                <View style={styles.paymentDetailItem}>
                    <Text style={styles.detailLabel}>Phí vận chuyển:</Text>
                    <Text style={styles.detailValue}>{shippingFee} VNĐ</Text>
                </View>
                <View style={styles.paymentDetailItem}>
                    <Text style={styles.detailLabel1}>Tổng thanh toán:</Text>
                    <Text style={styles.detailValue1}>{totalPayment} VNĐ</Text>
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
                    <Text style={styles.detailValue1}>{totalPayment} VNĐ</Text>
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

            <Modal animationType="slide" transparent={true} visible={isPaymentModalVisible} onRequestClose={handlePaymentModalClose}>
                <TouchableWithoutFeedback onPress={handlePaymentModalClose}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Chọn phương thức thanh toán</Text>
                            <TouchableOpacity onPress={handleMomoCheckboxChange} style={styles.paymentIcon}>
                                <Icon name={isMomoSelected ? 'check-circle' : 'circle'} size={30} color="#000" />
                                <Text style={styles.paymentText}>Ví MoMo</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleCODCheckboxChange} style={styles.paymentIcon}>
                                <Icon name={isCODSelected ? 'check-circle' : 'circle'} size={30} color="#000" />
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
        alignItems: 'center',
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
        flexDirection: 'column',
        alignItems: 'center',
    },
    paymentText: {
        marginTop: 10,
        fontSize: 16,
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
