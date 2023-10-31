import {
    StyleSheet, Text, View, Image,
    ImageBackground, TextInput, Button,
    TouchableHighlight, TouchableOpacity, Linking
} from 'react-native'
import axios from 'axios';
import React from 'react'
import { useState } from 'react'
import { Alert } from 'react-native';


const Login = ({ navigation }) => {


    const [userName, setuserName] = useState('');
    const [password, setPassword] = useState('');

    const [checkuserName, setcheckuserName] = useState(true)
    const [validateuserName, setvalidateuserName] = useState(true)
    const [checkuser, setcheckuser] = useState(true)

    const [checkpass, setcheckpass] = useState(true)
    const [ktpass, setktpass] = useState(true)

    const validate = () => {

        const reuserName = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

        if (userName.length == 0 || !reuserName.test(userName) || password.length == 0) {


            if (userName.length == 0) {
                setcheckuserName(false)
                setvalidateuserName(true)
            } else if (!reuserName.test(userName)) {
                setvalidateuserName(false)
                setcheckuserName(true)
            }
            else {
                setvalidateuserName(true)
                setcheckuserName(true)
            }


            if (password.length == 0) {
                setcheckpass(false)
                setktpass(true)

            } else {
                setcheckpass(true)
                setktpass(true)
            }
            return false
        } else {
            setcheckpass(true)
            setcheckuserName(true)

            setvalidateuserName(true)
            setktpass(true)

            return true
        }
    }

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
              // Đăng nhập thành công, bạn có thể thực hiện các hành động cần thiết tại đây.
              // Ví dụ: chuyển hướng đến màn hình sau khi đăng nhập thành công.
                const userData = await response.json();
                const userID = userData.id;
              navigation.navigate('TabNavi',{ isAuthenticated: true , userID});
            } else if (response.status === 401) {
              // Xử lý khi mật khẩu không đúng
              Alert.alert('Thông báo', 'Sai mật khẩu');
            } else if (response.status === 404) {
              // Xử lý khi tài khoản không tồn tại
              Alert.alert('Thông báo', 'Tài khoản không tồn tại');
            } else {
              // Xử lý các trường hợp lỗi khác
              Alert.alert('Thông báo', 'Đã xảy ra lỗi');
            }
          } catch (error) {
            console.error('Lỗi:', error);
            // Xử lý lỗi trong quá trình gửi yêu cầu
            Alert.alert('Lỗi', 'Đã xảy ra lỗi trong quá trình gửi yêu cầu');
          }
        }
      };
    const handleForgotPassword = () => {
      
    }; // end quên mật khẩu


    return (

        <View style={styles.container}>
            <TouchableOpacity style={styles.skipButton} onPress={() => navigation.navigate('TabNavi')}>
                <Text style={styles.skipButtonText}>Bỏ qua</Text>
            </TouchableOpacity>
            <Image source={require('../image/logoapp.png')} />

            <Text style={styles.textWelcome}>
                Chào mừng đến với BipBip
            </Text>

            <Text style={styles.textLogin}>
                Đăng nhập để tiếp tục
            </Text>

            <TextInput
                style={styles.input}
                placeholder='Username'
                value={userName}
                onChangeText={setuserName}
            />

            <View style={{ flexDirection: 'row', alignSelf: 'flex-start', marginLeft: 23 }}>
                <Text style={{ fontSize: 13, color: 'red' }}>{checkuserName ? '' : 'Vui lòng nhập userName'}</Text>
                <Text style={{ fontSize: 13, color: 'red' }}>{validateuserName ? '' : 'userName sai định dạng'}</Text>
                <Text style={{ fontSize: 13, color: 'red' }}>{checkuser ? '' : 'userName không đúng'}</Text>
            </View>

            <TextInput
                style={styles.input}
                placeholder='password'
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
            />

            <View style={{ alignSelf: 'flex-start', marginLeft: 23, flexDirection: 'row' }}>
                <Text style={{ fontSize: 13, color: 'red' }}>{checkpass ? '' : 'Vui lòng nhập mật khẩu'}</Text>
                <Text style={{ fontSize: 13, color: 'red' }}>{ktpass ? '' : 'Sai mật khẩu'}</Text>
            </View>



            <TouchableOpacity
                style={styles.button}
                activeOpacity={0.6}
                onPress={handleLogin}
            >
                <Text style={styles.textButon}>Đăng nhập</Text>
            </TouchableOpacity>

            <View style={styles.or} >
                <View style={styles.line} />
                <Text>OR</Text>
                <View style={styles.line} />
            </View>

            <View style={styles.inputLogin}>

                <Image source={require('../image/google.png')} />
                <Text style={styles.textGG}>Đăng nhập bằng Google</Text>
            </View>
            <View style={styles.inputLogin}>

                <Image source={require('../image/facebook.png')} />
                <Text style={styles.textFB}>Đăng nhập bằng Facebook</Text>
            </View>


            <Text style={styles.forget} onPress={handleForgotPassword}>Quên mật khẩu?</Text>
            <View style={styles.singin}>
                <Text >Bạn là người mới?</Text>
                <Text style={styles.inputSingin}
                    onPress={() => { navigation.navigate('Register') }}
                > Đăng ký</Text>
            </View>




        </View>
    )
}

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