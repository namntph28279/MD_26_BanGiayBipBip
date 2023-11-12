import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";

const Login = ({ navigation }) => {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [checkUserName, setCheckUserName] = useState(true);
    const [checkPass, setCheckPass] = useState(true);
    const [validateUserName, setValidateUserName] = useState(true);
    const [ktPass, setKtPass] = useState(true);
    const reUserName = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    const rePassword = /^.{6,}$/;

    const validate = () => {
        if (userName.length === 0 || !reUserName.test(userName)) {
            setCheckUserName(false);
            return false;
        } else {
            setCheckUserName(true);
        }

        if (password.length === 0 || !rePassword.test(password)) {
            setCheckPass(false);
            return false;
        } else {
            setCheckPass(true);
        }

        return true;
    };


    const handleLogin = async () => {
        if (validate()) {
            try {
                const response = await fetch('https://md26bipbip-496b6598561d.herokuapp.com/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username: userName, password }),
                });

                if (response.status === 200) {
                    const userData = await response.json();
                    const userID = userData._id;
                    console.log(userID);
                    if (userID) {
                        await AsyncStorage.setItem("Email", userID);
                        navigation.navigate('TabNavi', {screen: 'Home' });
                    } else {
                        console.error('Không nhận được ID người dùng từ phản hồi JSON');
                        Alert.alert('Lỗi', 'Không nhận được ID người dùng từ phản hồi JSON');
                    }
                } else if (response.status === 401) {
                    Alert.alert('Thông báo', 'Sai mật khẩu');
                } else if (response.status === 404) {
                    Alert.alert('Thông báo', 'Tài khoản không tồn tại');
                } else {
                    Alert.alert('Thông báo', 'Đã xảy ra lỗi');
                }
            } catch (error) {
                console.error('Lỗi:', error);
                Alert.alert('Lỗi', 'Đã xảy ra lỗi trong quá trình gửi yêu cầu');
            }
        }
    };

    const handleForgotPassword = () => {
        Alert.alert('Reset mật khẩu', 'Vui lòng liên hệ quản trị viên để reset mật khẩu');
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.skipButton} onPress={() => navigation.navigate('TabNavi')}>
                <Text style={styles.skipButtonText}>Bỏ qua</Text>
            </TouchableOpacity>
            <Image source={require('../../image/logoapp1.png')} />

            <Text style={styles.textWelcome}>Chào mừng đến với BipBip</Text>

            <Text style={styles.textLogin}>Đăng nhập để tiếp tục</Text>

            <TextInput
                style={styles.input}
                placeholder="Tên người dùng"
                value={userName}
                onChangeText={setUserName}
            />

            <View style={{ flexDirection: 'row', alignSelf: 'flex-start', marginLeft: 23 }}>
                <Text style={{ fontSize: 13, color: 'red' }}>{checkUserName ? '' : 'Vui lòng nhập tên người dùng'}</Text>
            </View>

            <TextInput
                style={styles.input}
                placeholder="Mật khẩu"
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
            />

            <View style={{ alignSelf: 'flex-start', marginLeft: 23, flexDirection: 'row' }}>
                <Text style={{ fontSize: 13, color: 'red' }}>{checkPass ? '' : 'Vui lòng nhập mật khẩu'}</Text>
                <Text style={{ fontSize: 13, color: 'red' }}>{ktPass ? '' : 'Sai mật khẩu'}</Text>
            </View>

            <TouchableOpacity style={styles.button} activeOpacity={0.6} onPress={handleLogin}>
                <Text style={styles.textButon}>Đăng nhập</Text>
            </TouchableOpacity>

            <View style={styles.or}>
                <View style={styles.line} />
                <Text>HOẶC</Text>
                <View style={styles.line} />
            </View>

            <View style={styles.inputLogin}>
                <Image source={require('../../image/google.png')} />
                <Text style={styles.textGG}>Đăng nhập bằng Google</Text>
            </View>
            <View style={styles.inputLogin}>
                <Image source={require('../../image/facebook.png')} />
                <Text style={styles.textFB}>Đăng nhập bằng Facebook</Text>
            </View>

            <Text style={styles.forget} onPress={handleForgotPassword}>
                Quên mật khẩu?
            </Text>

            <View style={styles.singin}>
                <Text>Bạn là người mới?</Text>
                <Text style={styles.inputSingin} onPress={() => navigation.navigate('Register')}>
                    Đăng ký
                </Text>
            </View>
        </View>
    );
};


export default Login

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textButon: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: "bold",
        textAlign: "center",
    },
    input: {
        borderRadius: 5,
        width: '90%',
        height: 48,
        margin: 10,
        borderWidth: 2,
        padding: 8,
        borderColor: '#EBF0FF'
    },
    textLogin: {
        textAlign: 'center',
        marginTop: 7,
        color: '#223263',
        fontSize: 15,
    },
    textWelcome: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 16,
        fontWeight: 'bold',
        width: 159,
        color: '#223263'
    },
    inputLogin: {
        margin: 7,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        borderRadius: 5,
        width: '90%',
        height: 48,
        borderColor: '#EBF0FF',
        borderWidth: 2
    },
    button: {
        justifyContent: 'center',
        alignSelf: "center",
        width: '90%',
        height: 52,
        borderRadius: 5,
        backgroundColor: "black",
        margin: 10,
    },

    or: {
        alignItems: 'center',
        flexDirection: 'row',

    },
    line: {
        width: '40%',
        height: 0,
        borderBottomWidth: 1,
        borderBottomColor: '#9098B1'
    },
    chu: {
        margin: 5,
        fontWeight: 'bold',
        fontSize: 14,
        color: '#9098B1'
    },
    textGG: {

        marginLeft: 50,
        marginRight: 50,
        fontWeight: 'bold',
        fontSize: 15,
        color: '#9098B1'
    },
    textFB: {
        marginLeft: 45,
        marginRight: 40,
        fontWeight: 'bold',
        fontSize: 15,
        color: '#9098B1'
    },
    forget: {
        marginTop: 7,
        fontWeight: 'bold',
        fontSize: 14,
        color: 'black'
    },
    singin: {
        marginTop: 7,
        flexDirection: 'row',
    },
    inputSingin: {
        fontWeight: 'bold',
        fontSize: 14,
        color: 'black'
    },
    skipButton: {
        marginTop:50,
        position: 'absolute',
        top: 10,
        right: 10,
    },
    skipButtonText: {
        color: '#07090c',
        fontWeight: 'bold',
        fontSize: 16,
    },

})