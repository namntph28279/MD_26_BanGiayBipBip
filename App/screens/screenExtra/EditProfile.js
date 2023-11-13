import React, { useState, useEffect } from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, Image} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import DatePicker from 'react-native-datepicker';
import AsyncStorage from "@react-native-async-storage/async-storage";
const EditProfile = ({ route,navigation }) => {
    const [fullname, setFullname] = useState('');
    const [gender, setGender] = useState('');
    const [avatar, setAvatar] = useState('');
    const [birthday, setBirthday] = useState('');
    const userID = route.params?.userID || '';
    useEffect(async () => {
        const email = await AsyncStorage.getItem('Email');
        fetch(`https://md26bipbip-496b6598561d.herokuapp.com/profile/${email}`)
            .then(response => response.json())
            .then(data => {
                setFullname(data.fullname);
                setGender(data.gender || '');
                setAvatar(data.avatar || '');
                setBirthday(data.birthday);
            })
            .catch(error => {
                console.error('Lỗi lấy dữ liệu người dùng:', error);
            });
    }, []);
    const updateUserProfile = async () => {
        const userId = '64b9770a589e84422206b99b';
        const email = await AsyncStorage.getItem('Email');
        const profileData = {
            user: email,
            fullname,
            gender,
            avatar,
            birthday
        };

        fetch('https://md26bipbip-496b6598561d.herokuapp.com/profile/edit', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(profileData),
        })
            .then(response => response.json())
            .then(data => {
                console.log('update Thành công profile:', data,email);
                navigation.navigate('TabNavi', {isAuthenticated: true, email});
            })
            .catch(error => {
                console.error('Lỗi cập nhật profile:', error);
            });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Họ Và Tên:</Text>
            <TextInput
                style={styles.input}
                value={fullname}
                onChangeText={(text) => setFullname(text)}
            />

            <Text style={styles.label}>Giới Tính:</Text>
            <RNPickerSelect
                style={pickerSelectStyles}
                onValueChange={(value) => setGender(value)}
                value={gender}
                items={[
                    { label: 'Nam', value: 'Nam' },
                    { label: 'Nữ', value: 'Nữ' },
                    { label: 'khác', value: 'khác' },
                ]}
            />

            <Text style={styles.label}>Ảnh Đại Diện:</Text>
            <TextInput
                style={styles.input}
                placeholder="Nhập Vào Link Ảnh"
                value={avatar}
                onChangeText={(text) => setAvatar(text)}
            />

            <Text style={styles.label}>Ngày Tháng Năm Sinh:</Text>
            <DatePicker
                style={{  borderWidth: 1,width: '100%', borderColor: '#ccc', borderRadius: 5, height: 40, marginBottom: 15}}
                date={birthday}
                mode="date"
                placeholder="Chọn ngày tháng năm sinh"
                format="DD-MM-YYYY"
                confirmBtnText="Xác nhận"
                cancelBtnText="Hủy"
                onDateChange={(date) => setBirthday(date)}
            />



            <TouchableOpacity
                style={styles.button}
                onPress={updateUserProfile}
            >
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                    <Text style={{ color: "white", fontSize: 20, fontWeight: "bold", textAlign: "center" }}>
                        Lưu
                    </Text>
                    {/*<Image source={require("../image/next.png")} style={{ marginLeft: 10 }} />*/}
                </View>
            </TouchableOpacity>
        </View>
    );
};

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        height: 40,
        marginBottom: 15,
        paddingHorizontal: 10,
    },
    inputAndroid: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        height: 40,
        marginBottom: 15,
        paddingHorizontal: 10,
        color: 'black',
    },

});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    label: {
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        height: 40,
        marginBottom: 15,
        paddingHorizontal: 10,
    },
    button: {
        borderRadius: 5,
        backgroundColor: "#666666",
        marginTop: 30,
        padding: 15,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default EditProfile;


