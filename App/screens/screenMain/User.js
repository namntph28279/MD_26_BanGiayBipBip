import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { fetchDataAndSetToRedux } from "../../redux/AllData";
import {useDispatch, useSelector} from "react-redux";
import url from "../../api/url";
import NotLoginUser from "../screenExtra/NotLoginUser";
import {useNavigation} from "@react-navigation/native";

function User() {
  const dispatch = useDispatch(); //trả về một đối tượng điều phối
  const navigation = useNavigation();

  const dataUserID = useSelector((state) => state.dataAll.dataUserID);
  const dataUser = useSelector((state) => state.dataAll.dataUser);
  const tokenApp = useSelector((state) => state.dataAll.dataTokenApp);

  const handleLogout = async () => {
    await url.post("/checkClientUser", {user: dataUserID,IdClient:tokenApp,status:false});
    await AsyncStorage.setItem("Email", "");
    await AsyncStorage.setItem("DefaultAddress", "");
    dispatch(fetchDataAndSetToRedux());
    console.log("Đăng xuất thành công");
  };
  
   const ChatWithShop =async () => {
        await url.post("/checkClientMess", {user: dataUserID,IdClient:tokenApp,status:true});
        navigation.navigate('ChatScreen');

    }
  const openFacebookPage = () => {
    const url = "https://www.facebook.com/profile.php?id=100067198388586";
    Linking.openURL(url);
  };

  const handleaddress = async () => {
    navigation.navigate("AllDiaChi", { userID: dataUserID, fromThanhToan: false });
  };
  // Kiểm tra nếu userData.avatar không có giá trị thì sử dụng hình ảnh mặc định
  const defaultAvatar =
    "https://assets.materialup.com/uploads/5b045613-" +
    "638c-41d9-9b7c-5f6c82926c6e/preview.png";

  return (
    <View style={styles.container}>
      {dataUserID === null ? (
          <NotLoginUser/>
          ):
          (
          <View style={styles.container}>
            <View style={styles.header}>
              <View style={styles.hinh} />
              <Image
                  source={{ uri: dataUser.avatar ? dataUser.avatar : defaultAvatar }}
                  style={styles.avatar}
              />
              {/*<Text style={styles.userId}>{userData.user}</Text>*/}
              <Text style={styles.userName}>{dataUser.fullname}</Text>
              <Text style={styles.userEmail}>{dataUser.birthday}</Text>
            </View>

            <View style={styles.content}>
              <TouchableOpacity
                  style={styles.section}
                  onPress={async () => {
                    navigation.navigate("EditProfile");
                  }}
              >
                <Icon name="edit" size={20} color="orange" />
                <Text style={styles.sectionText}>Chỉnh Sửa Thông Tin</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.section} onPress={openFacebookPage}>
                <Icon name="question-circle" size={20} color="red" />
                <Text style={styles.sectionText}>Hỗ Trợ</Text>
              </TouchableOpacity>
              <TouchableOpacity
                  style={styles.section}
                  onPress={ChatWithShop}
              >
                <Icon name="comment" size={20} color="green" />
                <Text style={styles.sectionText}>Chat Với Cửa Hàng</Text>
              </TouchableOpacity>
              <TouchableOpacity
                  style={styles.section}
                  onPress={async () => {
                    const email = await AsyncStorage.getItem("Email");
                    navigation.navigate("Oder", { userId: email });
                  }}
              >
                <Icon name="shopping-cart" size={20} color="cyan" />
                <Text style={styles.sectionText}>Đơn Mua</Text>
              </TouchableOpacity>
              <TouchableOpacity
                  style={styles.section}
                  onPress={async () => {
                    const email = await AsyncStorage.getItem("Email");
                    navigation.navigate("ChangePassword", { userId: email });
                  }}
              >
                <Icon name="lock" size={20} color="blue" />
                <Text style={styles.sectionText}>Đổi Mật Khẩu</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.section} onPress={handleaddress}>
                <Icon name="map-marker" size={20} color="red" />
                <Text style={styles.sectionText}>Địa Chỉ</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.section} onPress={handleLogout}>
                <Icon name="sign-out" size={20} color="violet" />
                <Text style={styles.sectionText}>Đăng Xuất</Text>
              </TouchableOpacity>
            </View>
          </View>
      )}
    </View>
  );

}

export default User;

const styles = StyleSheet.create({
  hinh: {
    marginTop: 10,
    width: "100%",
    height: 150,
    backgroundColor: "#EBF0F0",
    borderBottomEndRadius: 100,
    borderBottomStartRadius: 100,
    borderWidth: 1,
    borderColor: "black",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",

  },
  header: {
    marginBottom: 20,
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  avatar: {
    marginTop: 130,
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "black",
  },
  // userId: {
  //     marginTop: 60,
  //     fontSize: 5,
  //     fontWeight: 'bold',
  //     marginBottom: 8,
  // },
  userName: {
    fontSize: 12,
    marginBottom: 4,
    marginTop: 60,
    // marginTop: '15%',
    fontWeight: "bold",
  },
  userEmail: {
    fontSize: 14,
    color: "#888",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 12,
  },
  sectionText: {
    fontSize: 16,
    color: "black",
    marginLeft: 8,
  },
});
