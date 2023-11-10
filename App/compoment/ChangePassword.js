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
          setErrorOldPassword(false);
        }
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Mật khẩu hiện tại</Text>
          <TextInput
            secureTextEntry
            placeholder="Nhập mật khẩu hiện tại"
            value={oldPassword}
            onChangeText={setOldPassword}
            style={[styles.input, errorOldPassword && styles.inputError]}
          />
          {errorOldPassword && (
            <Text style={styles.errorText}>Mật khẩu cũ không chính xác</Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Mật khẩu mới</Text>
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
          <TextInput
            secureTextEntry
            placeholder="Xác nhận mật khẩu mới"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            style={[styles.input, errorConfirmPassword && styles.inputError]}
          />
          {errorConfirmPassword && (
            <Text style={styles.errorText}>
              Xác nhận mật khẩu mới không khớp
            </Text>
          )}
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSavePassword}>
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
    backgroundColor: "#fff",
  },
  formContainer:{
    marginTop:20,
    marginBottom:20,
  },
  inputContainer: {
    alignSelf: "center",
    marginBottom: 10,
    width: "95%",
  },
  label: {
    fontSize: 15,
    marginBottom: 3,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    marginTop: 2,
    borderWidth: 0,
    borderBottomWidth: 1,
    marginBottom: 5,
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    marginTop: 4,
  },
  button: {
    justifyContent: "center",
    alignSelf: "center",
    width: "95%",
    paddingHorizontal: 15,
    height: 52,
    borderRadius: 5,
    backgroundColor: "black",
    margin: 15,
  },
});
