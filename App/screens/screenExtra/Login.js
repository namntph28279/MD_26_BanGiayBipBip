import React, { useState,useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import url from "../../api/url";
import {fetchDataAndSetToRedux} from "../../redux/AllData";
import {useDispatch} from "react-redux";
import { io } from 'socket.io-client';
import { getUrl } from "../../api/socketio";

const Login = ({ navigation }) => {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [socket, setSocket] = useState(null);
    const [serverData, setServerData] = useState(null);

    const [checkUserName, setCheckUserName] = useState(true);
    const [checkPass, setCheckPass] = useState(true);
    const [validateUserName, setValidateUserName] = useState(true);
    const [ktPass, setKtPass] = useState(true);
    const reUserName = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    const rePassword = /^.{6,}$/;
    const dispatch = useDispatch(); //trả về một đối tượng điều phối
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

    const fetchData = async () => {
        console.log("start")//Khi component được tạo, gọi fetchData để lấy dữ liệu đơn hàng từ Redux store thông qua useSelector và dispatch.
        dispatch(fetchDataAndSetToRedux())
    };
    useEffect(() => {
        const socketInstance = io(getUrl());
        setSocket(socketInstance);
        return () => {
            socketInstance.disconnect();
        };
    }, []);

    useEffect(() => {
        if (socket) {
            socket.on('server-send', function (data) {
                fetchData() // mỗi khi có sự kiện từ máy chủ sẽ gọi lại fechData
            });
        }
    }, [socket]);


    const handleLogin = async () => {
        if (validate()) {
            try {
                const response = await url.post(
                    "/login",
                    {
                      username: userName,
                       password,
                    },
                  );


                if (response.status === 200) {
                    const userData = await response.data;
                    const userID = userData._id;
                    const Name = userData.username;
                    const isBlocked = userData.status;
                    console.log("sờ ta tus ", userData.status);

                    if (isBlocked === true) {
                        Alert.alert('Thông báo', 'Tài khoản của bạn đã bị chặn vào lúc: \n'+ userData.date);
                        return;  // Dừng việc tiếp tục xử lý
                    }

                    if (userID) {

                        const username = userName.split('@')[0];
                        await AsyncStorage.setItem("Email", userID);
                        await AsyncStorage.setItem("Name",username);
                        await AsyncStorage.setItem("Name1",Name);
                        await AsyncStorage.setItem('1', JSON.stringify(isBlocked));
                        const pushTokenData = await Notifications.getExpoPushTokenAsync();
                        await AsyncStorage.setItem("TokenApp", pushTokenData.data);
                        await url.post("/checkClientUser", {user: userID, IdClient: pushTokenData.data, status: true});

                        dispatch(fetchDataAndSetToRedux());
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
                const errorString = error.toString();
                const match = errorString.match(/\b(\d{3})\b/);

                if (match) {
                    const foundNumber = match[1];
                    if (foundNumber == 401) {
                        Alert.alert('Thông báo', 'Sai mật khẩu');
                    } else if (foundNumber == 404) {
                        Alert.alert('Thông báo', 'Tài khoản không tồn tại');
                    }
                } else {
                    console.error('Lỗi:', error);
                Alert.alert('Lỗi', 'Đã xảy ra lỗi trong quá trình gửi yêu cầu');
                }
                
            }
        }
    };

    const handleForgotPassword = () => {
        Alert.alert('Reset mật khẩu', 'Vui lòng liên hệ vào shopbipbip888@gmail.com để reset mật khẩu');
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
                <Text style={{ fontSize: 13, color: 'red' }}>{checkUserName ? '' : 'Vui lòng đúng định dạng email'}</Text>
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
