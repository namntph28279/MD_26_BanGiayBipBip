import {
    StyleSheet, Text, View, Image,
    ImageBackground, TextInput, Button,
    TouchableHighlight, TouchableOpacity, Linking
} from 'react-native'
import React from 'react'
import { useState } from 'react'
import { Alert } from 'react-native';

import firebase from '../config/FirebaseConfig';
import { getDatabase, set, ref, push, remove, onValue } from "firebase/database";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from '@firebase/auth';

const Login = ({ navigation }) => {
    const [listUser, setListUser] = useState([]);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [checkemail, setcheckemail] = useState(true)
    const [validateEmail, setvalidateEmail] = useState(true)
    const [checkuser, setcheckuser] = useState(true)

    const [checkpass, setcheckpass] = useState(true)
    const [ktpass, setktpass] = useState(true)

    const validate = () => {

        const reEmail = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

        if (email.length == 0 || !reEmail.test(email) || password.length == 0) {


            if (email.length == 0) {
                setcheckemail(false)
                setvalidateEmail(true)
            } else if (!reEmail.test(email)) {
                setvalidateEmail(false)
                setcheckemail(true)
            }
            else {
                setvalidateEmail(true)
                setcheckemail(true)
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
            setcheckemail(true)

            setvalidateEmail(true)
            setktpass(true)

            return true
        }
    }

    const handleLogin = () => {
        if (validate() == false) return
        if (validate() == true) {
            const database = getDatabase(firebase);
            const auth = getAuth(firebase);
            // Xử lý logic đăng nhập
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const userId = userCredential.user.uid;
                    console.log('ID người dùng đã đăng nhập:', userId);

                    // Lấy dữ liệu từ Realtime Database
                    const usersRef = ref(database, '/registrations/' + userId);

                    onValue(usersRef, (snapshot) => {
                        const usersData = snapshot.val();

                        setListUser(usersData);
                        console.log('Dữ liệu người dùng:', usersData);

                        navigation.navigate('TabNavi',{ isAuthenticated: true });

                    });
                })
                .catch((error) => {
                    console.error('Lỗi đăng nhập:', error);
                    Alert.alert('Thông báo', 'Sai email hoặc mật khẩu!');
                });
            // const correctEmail = "admin@gmail.com";
            // const correctPassword = "admin";

            // if (email === listUser.email && password === listUser.pass) {
            //     navigation.navigate('Home');

            //     setcheckemail(true)
            //     setcheckpass(true)
            //     setvalidateEmail(true)
            //     setktpass(true)
            //     setcheckuser(true)
            // } else {
            //     if (email != listUser.email) {
            //         setcheckuser(false)
            //     } else if (email === listUser.email) {
            //         setcheckuser(true)
            //         setktpass(false)
            //     }

            // }
        }

    }; // end hàm đăng nhập
    const handleForgotPassword = () => {
        // Linking.openURL('tel:19001331');
        const auth = getAuth(firebase);
        if (email!= null){
            sendPasswordResetEmail(auth, email)
                .then(() => {
                    alert("đã gửi email reset mật khẩu mới, vui lòng check email");
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    alert("Không tồn tại User");
                    // ..
                });
        }else {
            alert("Bạn cần điền email rồi ấn quên mật khẩu để lấy mật khẩu mới")
        }
    }; // end quên mật khẩu


    return (

        <View style={styles.container}>
            <TouchableOpacity style={styles.skipButton} onPress={()=> navigation.navigate('TabNavi')}>
                <Text style={styles.skipButtonText}>Bỏ qua</Text>
            </TouchableOpacity>
            <Image source={require('../image/logoapp.png')} />

            <Text style={styles.textWelcome}>
                Chào mừng đến với
                Shops Sneakers
            </Text>

            <Text style={styles.textLogin}>
                Đăng nhập để tiếp tục
            </Text>



            <TextInput style={styles.input}
                placeholder='E-mail address'
                value={email}
                onChangeText={setEmail}
            />

            <View style={{ flexDirection: 'row', alignSelf: 'flex-start', marginLeft: 23 }}>
                <Text style={{ fontSize: 13, color: 'red' }}>{checkemail ? '' : 'Vui lòng nhập Email'}</Text>
                <Text style={{ fontSize: 13, color: 'red' }}>{validateEmail ? '' : 'Email sai định dạng'}</Text>
                <Text style={{ fontSize: 13, color: 'red' }}>{checkuser ? '' : 'Email không đúng'}</Text>
            </View>

            <TextInput style={styles.input}
                placeholder='password'
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword} />

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