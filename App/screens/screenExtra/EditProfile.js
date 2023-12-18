import React, {useState, useEffect} from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image, Button,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import AsyncStorage from "@react-native-async-storage/async-storage";
import url from "../../api/url";
import {fetchDataAndSetToRedux, fetchDataUser} from "../../redux/AllData";
import {useDispatch} from "react-redux";
import DateTimePicker from "@react-native-community/datetimepicker";
import {Dropdown} from "react-native-element-dropdown";

const EditProfile = ({navigation}) => {
    const dispatch = useDispatch();
    const [fullname, setFullname] = useState("");
    const [gender, setGender] = useState('Nam');
    const [avatar, setAvatar] = useState("");
    const [birthday, setBirthday] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || birthday;
        setShowPicker(false);
        setBirthday(currentDate)
    };

    const showDateTimePicker = () => {
        setShowPicker(true);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const selectGender = [
                { label: 'Nam', value: 'Nam' },
                { label: 'Nữ', value: 'Nữ' },
                { label: 'khác', value: 'khác' },
    ];
    const renderItemSortBy = (item) => {
        return (
            <View style={styles.item}>
                <Text style={styles.textItem}>{item.label}</Text>
            </View>
        );
    };

    const fetchData = async () => {
        const email = await AsyncStorage.getItem("Email");

        try {
            const response = await url.get(`/profile/${email}`);
            const data = response.data;
            const dateString = data.birthday;
            const dateParts = dateString.split("/");
            const day = parseInt(dateParts[0], 10);
            const month = parseInt(dateParts[1], 10) - 1;
            const year = parseInt(dateParts[2], 10);

            const birthday = new Date(year, month, day);

            setBirthday(birthday); // Đặt giá trị cho state "birthday"
            setFullname(data.fullname);
            setGender(data.gender || "");
            setAvatar(data.avatar || "");
        } catch (error) {
            console.error("Lỗi lấy dữ liệu người dùng:", error);
        }
    };

    const updateUserProfile = async () => {
        const email = await AsyncStorage.getItem("Email");
        const profileData = {
            user: email,
            fullname,
            gender,
            avatar,
            birthday:birthday.toLocaleDateString("en-US"),
        };

        try {
            const response = await url.put("/profile/edit", profileData);
            const data = response.data;

            console.log("update Thành công profile:", data, email);
            dispatch(fetchDataUser());
            navigation.navigate("TabNavi");
        } catch (error) {
            console.error("Lỗi cập nhật profile:", error);
        }
    };

    const sortByPrice = (item) => {
        setGender(item.value)
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
            <Dropdown
                style={styles.dropdown}
                data={selectGender}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder="Sắp xếp"
                value={gender}
                onChange={(item) => {
                    sortByPrice(item);
                }}
                renderItem={renderItemSortBy}
            />
            {/*<RNPickerSelect*/}
            {/*    style={pickerSelectStyles}*/}
            {/*    onValueChange={(value) => setGender(value)}*/}
            {/*    value={gender}*/}
            {/*    items={[*/}
            {/*        { label: 'Nam', value: 'Nam' },*/}
            {/*        { label: 'Nữ', value: 'Nữ' },*/}
            {/*        { label: 'khác', value: 'khác' },*/}
            {/*    ]}*/}
            {/*/>*/}


            {/*<Text style={styles.label}>Ảnh Đại Diện:</Text>*/}
            {/*<TextInput*/}
            {/*    style={styles.input}*/}
            {/*    placeholder="Nhập Vào Link Ảnh"*/}
            {/*    value={avatar}*/}
            {/*    onChangeText={(text) => setAvatar(text)}*/}
            {/*/>*/}


            <Text style={styles.label}>Ngày Tháng Năm Sinh:</Text>
            <Text style={styles.input}
                  onPress={showDateTimePicker}
            >
                {birthday.toLocaleDateString()}
            </Text>

            {showPicker && (
                <DateTimePicker
                    value={birthday}
                    mode="date"
                    display="default"
                    onChange={onChange}
                />
            )}

            {/*<DatePicker*/}
            {/*    style={{  borderWidth: 1,width: '100%', borderColor: '#ccc', borderRadius: 5, height: 40, marginBottom: 15}}*/}
            {/*    date={birthday}*/}
            {/*    mode="date"*/}
            {/*    placeholder="Chọn ngày tháng năm sinh"*/}
            {/*    format="DD-MM-YYYY"*/}
            {/*    confirmBtnText="Xác nhận"*/}
            {/*    cancelBtnText="Hủy"*/}
            {/*    onDateChange={(date) => setBirthday(date)}*/}
            {/*/>*/}




            <TouchableOpacity style={styles.button} onPress={updateUserProfile}>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Text
                        style={{
                            color: "white",
                            fontSize: 20,
                            fontWeight: "bold",
                            textAlign: "center",
                        }}
                    >
                        Lưu
                    </Text>
                    {/*<Image source={require("../image/next.png")} style={{ marginLeft: 10 }} />*/}
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    dropdown: {
        height: 40,
        width: '100%',
        backgroundColor: "white",
        borderRadius: 12,
        marginBottom:14,
        padding: 12,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,

        elevation: 2,
    },
    label: {
        marginBottom: 5,
    },
    item: {
        padding: 15,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    textItem: {
        flex: 1,
        fontSize: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 14,
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