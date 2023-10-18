import React, { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TextInput } from 'react-native-paper';

export default function ScreenAddresst() {
    const resdt = /^(0|84)(3[2-9]|5[2689]|7[06-9]|8[1-9]|9[0-9])[0-9]{7}$/;


    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [tinh, setTinh] = useState('');
    const [huyen, setHuyen] = useState('');
    const [xa, setXa] = useState('');
    const [chiTiet, setChiTiet] = useState('');

    const [nameError, setNameError] = useState(false);
    const [phoneError, setPhoneError] = useState(false);
    const [tinhError, setTinhError] = useState(false);
    const [huyenError, setHuyenError] = useState(false);
    const [xaError, setXaError] = useState(false);
    const [chiTietError, setChiTietError] = useState(false);

    const handleComplete = () => {
        const nameError = !name;

        const tinhError = !tinh;
        const huyenError = !huyen;
        const xaError = !xa;
        const chiTietError = !chiTiet;
        console.log(phone)
        if (!resdt.test(phone)){
            console.log(true)
            setPhoneError(true);
        } else {
            setPhoneError(false);
            console.log(false)
        }

        setNameError(nameError);

        setTinhError(tinhError);
        setHuyenError(huyenError);
        setXaError(xaError);
        setChiTietError(chiTietError);

    }


    return (
        <View style={styles.container}>
            <View>
                <Text style={{ margin: 7 }}>Liên hệ</Text>
                <TextInput
                    style={{marginTop:6}}
                    label="Họ và Tên"
                    mode='outlined'
                    onChangeText={setName}
                    value={name}
                    error={nameError}
                />
                <TextInput
                    style={{marginTop:8}}
                    label="Số điện thoại"
                    mode='outlined'
                    onChangeText={setPhone}
                    value={phone}
                    error={phoneError}
                />
            </View>
            <View style={{ marginTop: 20 }}>
                <Text style={{ margin: 7 }}>Địa chỉ</Text>
                <TextInput
                    style={{marginTop:6}}
                    label="Tỉnh"
                    mode='outlined'
                    onChangeText={setTinh}
                    value={tinh}
                    error={tinhError}
                />
                <TextInput
                    style={{marginTop:8}}
                    label="Huyện"
                    mode='outlined'
                    onChangeText={setHuyen}
                    value={huyen}
                    error={huyenError}
                />
                <TextInput
                    style={{marginTop:8}}
                    label="Xã"
                    mode='outlined'
                    onChangeText={setXa}
                    value={xa}
                    error={xaError}
                />
                <TextInput
                    style={{marginTop:8}}
                    label="Chi tiết"
                    mode='outlined'
                    onChangeText={setChiTiet}
                    value={chiTiet}
                    error={chiTietError}
                />
            </View>

            <TouchableOpacity
                style={styles.button}
                activeOpacity={0.6}
                onPress={handleComplete}
            >
                <Text style={styles.textButon}>HOÀN THÀNH </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        margin: 7
    },
    button: {
        marginTop: 14,
        backgroundColor: "#000000",
        borderRadius: 7,
        alignItems: "center"
    },
    textButon: {
        fontSize: 20,
        fontWeight: "bold",
        color: "white",
        padding: 10
    }
})
