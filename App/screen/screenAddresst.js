
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
    const [address,setAdddress] = useState('');
    // const [chiTietError, setChiTietError] = useState(false);

    useEffect(() => {
        const newAddress = `${xa} ${huyen} ${tinh}`;
        setAdddress(newAddress);
      }, [xa, huyen, tinh]);

    }

    const handleComplete = () => {
        // Your existing validation and handling logic
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
                <Picker
                    style={{ marginTop: 6 }}
                    selectedValue={tinh}
                    onValueChange={(itemValue) => setTinh(itemValue)}>
                    <Picker.Item label="Chọn tỉnh" value="" />
                </Picker>
                <Picker
                    style={{ marginTop: 8 }}
                    selectedValue={huyen}
                    onValueChange={(itemValue) => setHuyen(itemValue)}>
                    <Picker.Item label="Chọn quận huyện" value="" />
                </Picker>
                <Picker
                    style={{ marginTop: 8 }}
                    selectedValue={xa}
                    onValueChange={(itemValue) => setXa(itemValue)}>
                    <Picker.Item label="Chọn phường xã" value="" />
                </Picker>
                <TextInput
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