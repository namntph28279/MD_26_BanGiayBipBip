import React, { useState } from 'react';
import { View, StyleSheet, Text, Image, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { nameValidator } from '../../helpers/nameValidator';
import { passwordValidator } from '../../helpers/passwordValidator';
import axios from 'axios';
import { CommonActions } from '@react-navigation/native';

function Register({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    const validate = () => {
        const usernameError = nameValidator(username);
        const passwordError = passwordValidator(password);

        setUsernameError(usernameError);
        setPasswordError(passwordError);

        const emailRegex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zAZ0-9]{2,4})+$/;

        if (!emailRegex.test(username)) {
            setUsernameError('Tên người dùng không hợp lệ');
            return false;
        }

        if (usernameError || passwordError) {
            return false;
        }

        if (password !== confirmPassword) {
            setConfirmPasswordError('Mật khẩu không trùng khớp');
            return false;
        }

        return true;
    };

    const Save = async () => {
        if (validate()) {
            try {
                const response = await axios.post('https://md26bipbip-496b6598561d.herokuapp.com/register', {
                    username,
                    password,
                });

                if (response.status === 201) {
                    Alert.alert("Xin chào", "Bạn đã đăng ký thành công ")
                    console.log('Đăng ký thành công');
                    navigation.dispatch(
                        CommonActions.reset({
                            index: 0,
                            routes: [{ name: 'Login' }],
                        })
                    );
                } else {
                    Alert.alert('Lỗi', response.data.message);
                }
            } catch (error) {
                console.log(error);
                Alert.alert('Lỗi', 'Tên người dùng đã tồn tại');
            }
        }
    };

    return (
        <View style={styles.container}>
            <Image source={require('../../image/logoapp.png')} style={{ margin: 16 }} />
            <Text style={styles.title}>Bắt đầu nào</Text>
            <Text style={styles.title2}>Tạo một tài khoản mới</Text>

            <TextInput
                label='Email'
                value={username}
                onChangeText={(text) => setUsername(text)}
                error={!!usernameError}
                errorText={usernameError}
                style={styles.nhap}
            />

            <TextInput
                label='Mật khẩu'
                value={password}
                onChangeText={(text) => setPassword(text)}
                error={!!passwordError}
                errorText={passwordError}
                secureTextEntry
                style={styles.nhap}
            />

            <TextInput
                label='Xác nhận mật khẩu'
                value={confirmPassword}
                onChangeText={(text) => setConfirmPassword(text)}
                error={!!confirmPasswordError}
                errorText={confirmPasswordError}
                secureTextEntry
                style={styles.nhap}
            />

            <Button
                mode="contained"
                style={styles.buton}
                onPress={Save}
            >
                Đăng ký
            </Button>

            <View style={styles.singin}>
                <Text>Đã có tài khoản? </Text>
                <Text
                    style={styles.inputSingin}
                    onPress={() => { navigation.navigate('Login') }}
                >
                    Đăng nhập
                </Text>
            </View>
        </View>
    );
}

export default Register;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    nhap: {
        borderRadius: 5,
        width: '90%',
        height: 50,
        margin: 10,
        borderWidth: 2,
        padding: 8,
        borderColor: '#EBF0FF',
        backgroundColor: "#fff"
    },
    buton: {
        justifyContent: 'center',
        alignSelf: "center",
        width: '90%',
        height: 52,
        borderRadius: 5,
        backgroundColor: "black",
        margin: 10,
    },
    textButon: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: "bold",
        textAlign: "center",
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#223263',

    },
    title2: {
        marginBottom: 10,
        marginTop: 7,
        color: '#9098B1',
    },
    singin: {
        marginTop: 7,
        flexDirection: 'row',
    },
    inputSingin: {
        fontWeight: 'bold',
        fontSize: 14,
        color: 'black'
    }
});
