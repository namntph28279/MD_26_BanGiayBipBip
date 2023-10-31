import React, { useState } from 'react';
import { View, TextInput, TouchableHighlight, StyleSheet, Text, Image, Alert } from 'react-native';
import { nameValidator } from '../helpers/nameValidator';
import { passwordValidator } from '../helpers/passwordValidator';
import axios from 'axios';
import { CommonActions } from '@react-navigation/native';

import { getDatabase, set, ref, push, remove, onValue } from "firebase/database";
import firebase from '../config/FirebaseConfig';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, fetchSignInMethodsForEmail } from 'firebase/auth';


function Register({ navigation }) {

    const [username, setUsername] = useState({ value: '', error: '' });
    const [password, setPassword] = useState({ value: '', error: '' });


    // const [fullname, setfullname] = useState('')
    // const [email, setemail] = useState('')
    // const [pass, setpass] = useState('')
    // const [nhaplai, setnhaplai] = useState('')

    // const [checkfullname, setcheckfullname] = useState(true)
    // const [checkemail, setcheckemail] = useState(true)
    // const [emailExists, setEmailExists] = useState(false);

    // const [checkpass, setcheckpass] = useState(true)
    // const [checknhaplai, setchecknhaplai] = useState(true)

    // const [validateEmail, setvalidateEmail] = useState(true)
    // const [ktnhaplai, setktnhaplai] = useState(true)


    // const validate = () => {
    //     const reEmail = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    //     if (nhaplai.length == 0 || pass.length == 0 ||  pass.length < 6|| fullname.length == 0 || email.length == 0 || !reEmail.test(email) || pass != nhaplai) {

    //         if (fullname.length == 0) {
    //             setcheckfullname(false)
    //         } else {
    //             setcheckfullname(true)
    //         }

    //         if (email.length == 0) {
    //             setcheckemail(false)
    //             setvalidateEmail(true)
    //         } else if (!reEmail.test(email)) {
    //             setvalidateEmail(false)
    //             setcheckemail(true)
    //         }
    //         else {
    //             setvalidateEmail(true)
    //             setcheckemail(true)
    //         }

    //         if (pass.length == 0) {
    //             setcheckpass(false)
    //         } else {
    //             setcheckpass(true)
    //         }

    //         if (nhaplai.length == 0) {
    //             setchecknhaplai(false)
    //             setktnhaplai(true)
    //         } else if (pass != nhaplai) {
    //             setchecknhaplai(true)
    //             setktnhaplai(false)
    //         } else {
    //             setchecknhaplai(true)
    //             setktnhaplai(true)
    //         }
    //         return false
    //     } else {
    //         setchecknhaplai(true)
    //         setcheckfullname(true)
    //         setcheckpass(true)
    //         setcheckemail(true)
    //         setvalidateEmail(true)
    //         setktnhaplai(true)

    //         return true
    //     }


    // }

    // const Save = () => {

    //     if (validate() == false) return
    //     if (validate() == true) {
    //         const database = getDatabase(firebase);
    //         const auth = getAuth(firebase);

    //         // tìm kiếm, Kiểm tra email đã tồn tại hay chưa
    //         fetchSignInMethodsForEmail(auth, email)
    //             .then((signInMethods) => {
    //                 if (signInMethods.length > 0) {
    //                     setEmailExists(true);
    //                 } else {
    //         createUserWithEmailAndPassword(auth, email, pass)
    //             .then((userCredential) => {
    //                 // Lấy ID của người dùng đã đăng ký thành công
    //                 const userId = userCredential.user.uid;
    //                 console.log('ID của người dùng:', userId);

    //                 // Lưu thông tin người dùng vào Realtime Database
    //                 const registrationData = {
    //                     fullname,
    //                     email,
    //                     pass,
    //                 };
    //                 set(ref(database, "registrations/" + userId), registrationData)
    //                     .then(() => {
    //                         alert("Đăng ký thành công");
    //                         setTimeout(() => {
    //                             navigation.navigate("Login");
    //                         }, 0);
    //                     })
    //                     .catch((error) => {
    //                         console.error("Lỗi khi đăng ký:", error);
    //                         alert("Đăng ký thất bại");
    //                     });
    //             })
    //             .catch((error) => {
    //                 console.error('Đăng ký thất bại:', error);
    //             });
    //                 }
    //             })
    //             .catch((error) => {
    //                 console.error('Lỗi khi kiểm tra email:', error);
    //             });


    //     }
    // };






    const Save = async () => {
        const usernameError = nameValidator(username.value);
        const passwordError = passwordValidator(password.value);

        if (!username.value || !password.value) {
            // Kiểm tra xem username và password có giá trị không.
            Alert.alert('Lỗi', 'Bạn phải nhập đầy đủ tên người dùng và mật khẩu.');
            return;
        } else if (password.value.length < 6) {
            <Text style={{ alignSelf: 'flex-start', marginLeft: 25, fontSize: 13, color: 'red' }}>{username.error}</Text>
            return;
        }

        if (usernameError) {
            setUsername({ ...username, error: usernameError });
            setPassword({ ...password, error: passwordError });
            return;
        }

        try {
            const response = await axios.post('https://md26bipbip-496b6598561d.herokuapp.com/register', {
                username: username.value,
                password: password.value,
            });

            if (response.status === 201) {
                Alert.alert("Xin chào", "Bạn đã đăng ký thành công ")
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
    };



    return (
        <View style={styles.container}>

            <Image source={require('../image/logoapp.png')}
                style={{ margin: 16 }} />

            <Text style={styles.title}>
                Bắt đầu nào
            </Text>

            <Text style={styles.title2}>Tạo một tài khoản mới </Text>
            <TextInput
                placeholder='Username'
                returnKeyType="next"
                style={styles.nhap}
                value={username.value}
                onChangeText={(text) => setUsername({ value: text, error: '' })}
            // error={!!username.error}
            // errorText={username.error}
            />
            <Text style={{ alignSelf: 'flex-start', marginLeft: 25, fontSize: 13, color: 'red' }}>{username.error}</Text>
            <TextInput
                placeholder='Password'
                style={styles.nhap}
                returnKeyType="done"
                value={password.value}
                onChangeText={(text) => setPassword({ value: text, error: '' })}
                // error={!!password.error}
                // errorText={password.error}
                secureTextEntry
            />
            <Text style={{ alignSelf: 'flex-start', marginLeft: 25, fontSize: 13, color: 'red' }}>{password.error}</Text>
            {/* <Text style={{ alignSelf: 'flex-start', marginLeft: 25, fontSize: 13, color: 'red' }}>{password.length}</Text> */}
            {/* <View style={{ flexDirection: 'row', alignSelf: 'flex-start', marginLeft: 23 }}>
                <Text style={{ fontSize: 13, color: 'red' }}>{checkemail ? '' : 'Vui lòng nhập Email'}</Text>
                <Text style={{ fontSize: 13, color: 'red' }}>{validateEmail ? '' : 'Email sai định dạng'}</Text>
                <Text style={{ fontSize: 13, color: 'red' }}>{emailExists ? 'Email đã tồn tại' : ''}</Text>
            </View>
            <TextInput secureTextEntry={true} placeholder='Password' style={styles.nhap} onChangeText={(txt) => setpass(txt)} />
            <Text style={{ alignSelf: 'flex-start', marginLeft: 23, fontSize: 13, color: 'red' }}>
                {checkpass ? '' : 'Vui lòng nhập Pass.'}
                {checkpass ?   '' : 'Mật khẩu phải từ 6 kí tự trở lên'}
            </Text> */}
            <TextInput secureTextEntry={true} placeholder='Password Again' style={styles.nhap} onChangeText={(txt) => setnhaplai(txt)} />
            {/* <View style={{ alignSelf: 'flex-start', marginLeft: 23, flexDirection: 'row' }}>
                <Text style={{ fontSize: 13, color: 'red' }}>{checknhaplai ? '' : 'Vui lòng nhập lại Pass'}</Text>
                <Text style={{ fontSize: 13, color: 'red' }}>{ktnhaplai ? '' : 'Pass nhập lại không giống'}</Text>
            </View> */}


            <TouchableHighlight
                mode="contained"
                activeOpacity={1}
                underlayColor="gray"
                style={styles.buton}
                onPress={Save}
            >
                <Text style={styles.textButon}  >
                    Đăng ký
                </Text>
            </TouchableHighlight>
            <View style={styles.singin}>
                <Text >Đã có tài khoản? </Text>
                <Text style={styles.inputSingin}
                    onPress={() => { navigation.navigate('Login') }}
                >Đăng nhập</Text>
            </View>
        </View>
    )
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
        height: 48,
        margin: 10,
        borderWidth: 2,
        padding: 8,
        borderColor: '#EBF0FF'
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
})