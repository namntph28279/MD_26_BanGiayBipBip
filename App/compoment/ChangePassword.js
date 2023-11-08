import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
} from "react-native";
import axios from "axios";

const ChangePassword = ({ route, navigation }) => {
  const userId = route.params?.userId || "";

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errorOldPassword, setErrorOldPassword] = useState(false);
  const [errorNewPassword, setErrorNewPassword] = useState(false);
  const [errorConfirmPassword, setErrorConfirmPassword] = useState(false);

  const [userData, setUserData] = useState([]);
  useEffect(() => {
    console.log(userId + " test");
    if (userId) {
      axios
        .get(`https://md26bipbip-496b6598561d.herokuapp.com/user/${userId}`)
        .then((response) => {
          const User = response.data;
          setUserData(User);
        })
        .catch((error) => {
          console.error("Have an error:", error);
        });
    }
  }, [userId]);

  const handleSavePassword = () => {
    console.log(userData);
    if (newPassword.length < 6) {
      setErrorNewPassword(true);
      return;
    } else {
      setErrorNewPassword(false);
    }

    if (newPassword !== confirmPassword) {
      setErrorConfirmPassword(true);
      return;
    } else {
      setErrorConfirmPassword(false);
    }

    axios
      .post("https://md26bipbip-496b6598561d.herokuapp.com/changepassword", {
        username: userData.username,
        oldPassword: oldPassword,
        newPassword: newPassword,
      })
      .then((response) => {
        if (response.status === 200) {
          alert("Đổi mật khẩu thành công");
          navigation.navigate("TabNavi", { isAuthenticated: true });
        }
      })
      .catch((error) => {
        if (error) {
          setErrorOldPassword(true);
          return;
        } else {
          setErrorNewPassword(false);
        }
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <Image
          source={require("../image/ChangePassImage.png")}
          style={{ width: 150, height: 150,alignSelf: "center"}}
        />
        <Text style={styles.label}>Mật khẩu cũ:</Text>
        <TextInput
          secureTextEntry
          placeholder="Nhập mật khẩu cũ"
          value={oldPassword}
          onChangeText={setOldPassword}
          style={[styles.input, errorOldPassword && styles.inputError]}
        />
        {errorOldPassword && (
          <Text style={styles.errorText}>Mật khẩu cũ không chính xác</Text>
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Mật khẩu mới:</Text>
        <TextInput
          secureTextEntry
          placeholder="Nhập mật khẩu mới"
          value={newPassword}
          onChangeText={setNewPassword}
          style={[styles.input, errorNewPassword && styles.inputError]}
        />
        {errorNewPassword && (
          <Text style={styles.errorText}>
            Mật khẩu mới phải có ít nhất 6 ký tự
          </Text>
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Xác nhận mật khẩu mới:</Text>
        <TextInput
          secureTextEntry
          placeholder="Xác nhận mật khẩu mới"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          style={[styles.input, errorConfirmPassword && styles.inputError]}
        />
        {errorConfirmPassword && (
          <Text style={styles.errorText}>Xác nhận mật khẩu mới không khớp</Text>
        )}
      </View>

      <TouchableOpacity
        style={{
          backgroundColor: "black",
          margin: 7,
          padding: 15,
          marginTop: 60,
        }}
        onPress={handleSavePassword}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
            Lưu mật khẩu
          </Text>
          <Image source={require("../image/next.png")} />
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop:35
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    marginTop:2,
    paddingHorizontal: 10,
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    marginTop: 4,
  },
});
