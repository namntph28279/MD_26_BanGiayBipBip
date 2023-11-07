import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'

export default function NotLoginUser({ navigation }) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>TÀI KHOẢN</Text>
            <View style={{ width: '100%', backgroundColor: 'black', height: 1 }} />
            <Image source={require('../image/imglogin.png')} style={styles.img} />
            <Text style={styles.TitleConten}>
                ĐĂNG NHẬP ĐỂ BẮT ĐẦU MUA SẮM
            </Text>
            <Text style={styles.Conten}>
                Mọi thứ trở lên thuận tiện và dễ dàng hơn chỉ với 1 nút click bạn đã có những mặt hàng yêu thích của mình thanh toán thuận tiện giá cả phù hợp
            </Text>

            <View style={styles.viewButton}>
                <TouchableOpacity
                    activeOpacity={0.6}
                    style={styles.buttonStyle}
                    onPress={() => {
                        navigation.navigate('Login');
                    }}
                >
                    <Text style={styles.buttonText}>Đăng Nhập</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    activeOpacity={0.6}
                    style={[styles.buttonStyle, { backgroundColor: '#D9D9D9' }]}
                    onPress={() => {
                        navigation.navigate('Register');
                    }}
                >
                    <Text style={[styles.buttonText, { color: '#038C7F' }]}>Đăng Ký</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    viewButton: {
        flexDirection: 'row',
        marginTop: 20,
    },
    img: {
        marginTop: 88,
    },
    TitleConten: {
        marginTop: 60,
        fontSize: 23,
        width: 268,
        textAlign: 'center',
    },
    Conten: {
        marginTop: 15,
        width: 330,
        textAlign: 'center',
        fontSize: 15,
        marginBottom: 30,
    },
    container: {
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 40,
        marginLeft: 15,
        marginBottom: 7,
    },
    buttonStyle: {
        margin: 7,
        backgroundColor: '#038C7F',
        padding: 9,
        width: '45%',
        height: 60,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
