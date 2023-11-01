import React, { useState } from "react";
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
//   const { userId } = route.params;

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errorOldPassword, setErrorOldPassword] = useState(false);
  const [errorNewPassword, setErrorNewPassword] = useState(false);
  const [errorConfirmPassword, setErrorConfirmPassword] = useState(false);

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

    const user = "ptg@gmail.com";
    //mk 123456

    axios
      .post("https://md26bipbip-496b6598561d.herokuapp.com/changepassword", {
        username: user,
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
          marginTop: 30,
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
  inputContainer: {
    marginTop: 20,
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
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
