import React, { useState, useEffect } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TextInput } from 'react-native-paper';
import axios from 'axios';

export default function ScreenAddresst() {
    const resdt = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;
    const resnameRegex = /^[AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬBCDĐEÈẺẼÉẸÊỀỂỄẾỆFGHIÌỈĨÍỊJKLMNOÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢPQRSTUÙỦŨÚỤƯỪỬỮỨỰVWXYỲỶỸÝỴZ][aàảãáạăằẳẵắặâầẩẫấậbcdđeèẻẽéẹêềểễếệfghiìỉĩíịjklmnoòỏõóọôồổỗốộơờởỡớợpqrstuùủũúụưừửữứựvwxyỳỷỹýỵz]+ [AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬBCDĐEÈẺẼÉẸÊỀỂỄẾỆFGHIÌỈĨÍỊJKLMNOÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢPQRSTUÙỦŨÚỤƯỪỬỮỨỰVWXYỲỶỸÝỴZ][aàảãáạăằẳẵắặâầẩẫấậbcdđeèẻẽéẹêềểễếệfghiìỉĩíịjklmnoòỏõóọôồổỗốộơờởỡớợpqrstuùủũúụưừửữứựvwxyỳỷỹýỵz]+(?: [AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬBCDĐEÈẺẼÉẸÊỀỂỄẾỆFGHIÌỈĨÍỊJKLMNOÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢPQRSTUÙỦŨÚỤƯỪỬỮỨỰVWXYỲỶỸÝỴZ][aàảãáạăằẳẵắặâầẩẫấậbcdđeèẻẽéẹêềểễếệfghiìỉĩíịjklmnoòỏõóọôồổỗốộơờởỡớợpqrstuùủũúụưừửữứựvwxyỳỷỹýỵz]*)*/;

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
    const [address, setAdddress] = useState('');
    // const [chiTietError, setChiTietError] = useState(false);

    useEffect(() => {
        const newAddress = `${xa} ${huyen} ${tinh}`;
        setAdddress(newAddress);
    }, [xa, huyen, tinh]);

    const handleComplete = () => {
        const nameError = !name;

        const tinhError = !tinh;
        const huyenError = !huyen;
        const xaError = !xa;
        // const chiTietError = !chiTiet;

        if (!resdt.test(phone)) {

            setPhoneError(true);
        } else {
            setPhoneError(false);
        }
        if (!resnameRegex.test(name)) {

            setNameError(true);
        } else {
            setNameError(false);

        }

        setTinhError(tinhError);
        setHuyenError(huyenError);
        setXaError(xaError);

        const data = {
            name,
            phone,
            address,
        };
        const jsonData = JSON.stringify(data);

        if (!nameError && !phoneError && !xaError && !huyenError && !tinhError) {
            axios.post('https://md26bipbip-496b6598561d.herokuapp.com/address/add', jsonData, {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
                .then(response => {
                    console.log('Dữ liệu đã được gửi thành công lên máy chủ:', response.data);
                })
                .catch(error => {
                    console.error('Lỗi trong quá trình gửi dữ liệu lên máy chủ:', error);
                });
        }


    }


    return (
        <View style={styles.container}>
            <View>
                <Text style={{ margin: 7 }}>Liên hệ</Text>
                <TextInput
                    style={{ marginTop: 6 }}
                    label="Họ và Tên"
                    mode='outlined'
                    onChangeText={setName}
                    value={name}
                    error={nameError}
                />
                <TextInput
                    style={{ marginTop: 8 }}
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
                    style={{ marginTop: 6 }}
                    label="Tỉnh"
                    mode='outlined'
                    onChangeText={setTinh}
                    value={tinh}
                    error={tinhError}
                />
                <TextInput
                    style={{ marginTop: 8 }}
                    label="Huyện"
                    mode='outlined'
                    onChangeText={setHuyen}
                    value={huyen}
                    error={huyenError}
                />
                <TextInput
                    style={{ marginTop: 8 }}
                    label="Xã"
                    mode='outlined'
                    onChangeText={setXa}
                    value={xa}
                    error={xaError}
                />
                {/* <TextInput
                    style={{marginTop:8}}
                    label="Chi tiết"
                    mode='outlined'
                    onChangeText={setChiTiet}
                    value={chiTiet}
                    error={chiTietError}
                /> */}
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