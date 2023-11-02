import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Linking } from 'react-native';
import { getAuth, signOut, deleteUser } from 'firebase/auth';
import { getDatabase, off, onValue, ref,remove  } from 'firebase/database';
import firebase from '../config/FirebaseConfig';
import Icon from 'react-native-vector-icons/FontAwesome';

function User({ route, navigation }) {
    const [userData, setUserData] = useState(null);
    const auth = getAuth(firebase);
    // const userId = '64b9770a589e84422206b99b';
    const userID = route.params?.userID || '';

    useEffect(() => {
        console.log('Giá trị userID từ propsvvv:', userID);
        if (!userID) {
            console.log('không có user');
            return;
        }
        fetchUserData();
    }, [userID]);
    const fetchUserData = async () => {
        try {
            const response = await fetch(`https://md26bipbip-496b6598561d.herokuapp.com/profile/${userID}`);
            if (!response.ok) {
                throw new Error('Lỗi khi lấy thông tin người dùng');
            }

            const data = await response.json();
            setUserData(data);
        } catch (error) {
            console.error('Lỗi:', error);
        }
    };

    useEffect(() => {
        fetchUserData();

        const interval = setInterval(() => {
            fetchUserData();
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleLogout = () => {
        const auth = getAuth();
        signOut(auth)
            .then(() => {
                console.log('Đăng xuất thành công');
                // navigation.navigate('Login');
                navigation.navigate('TabNavi');
            })
            .catch((error) => {
                console.log('Lỗi khi đăng xuất:', error);
            });


    };
    const openFacebookPage = () => {
        const url = 'https://www.facebook.com/profile.php?id=100067198388586';
        Linking.openURL(url);
    };

    if (!userData) {
        return null;
    }
    const handleDeleteProfile = () => {
        const auth = getAuth();
        const user = auth.currentUser;
        const userId = user.uid;

        const database = getDatabase();
        const userRef = ref(database, `registrations/${userId}`);

        deleteUser(user)
            .then(() => {
                console.log('Tài khoản đã được xóa');
                remove(userRef)
                    .then(() => {
                        console.log('Dữ liệu người dùng đã được xóa');
                        alert('Đã xóa hồ sơ');
                        navigation.navigate('TabNavi');
                    })
                    .catch((error) => {
                        console.log('Lỗi khi xóa dữ liệu người dùng:', error);
                    });
            })
            .catch((error) => {
                console.log('Lỗi khi xóa tài khoản:', error);
            });
    };
    if (!userData) {
        return null;
    }

    // Kiểm tra nếu userData.avatar không có giá trị thì sử dụng hình ảnh mặc định
    const defaultAvatar = 'https://assets.materialup.com/uploads/5b045613-' +
        '638c-41d9-9b7c-5f6c82926c6e/preview.png';
    return (
        <View style={styles.container}>

            <View style={styles.header}>

                <View style={styles.hinh} />
                <Image
                    source={{ uri: userData.avatar ? userData.avatar : defaultAvatar }}
                    style={styles.avatar}
                />
                <Text style={styles.userId}>{userData.user}</Text>
                <Text style={styles.userName}>{userData.fullname}</Text>
                <Text style={styles.userEmail}>{userData.birthday}</Text>
            </View>

            <View style={styles.content}>
                <TouchableOpacity
                    style={styles.section}
                    onPress={() => navigation.navigate('EditProfile',{ userID ,userData})}
                >
                    <Icon name="edit" size={20} color="orange" />
                    <Text style={styles.sectionText}>Chỉnh sửa thông tin</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.section}
                    onPress={openFacebookPage}
                >
                    <Icon name="question-circle" size={20} color="red" />
                    <Text style={styles.sectionText}>Hỗ trợ</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.section}
                    onPress={() => navigation.navigate('ChatScreen', { userId: userID, userName: userData.fullname, })}
                >
                    <Icon name="comment" size={20} color="green" />
                    <Text style={styles.sectionText}>Chat Box</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.section}

                    onPress={() => navigation.navigate('Oder', { userId: userID })}
                >
                    <Icon name="shopping-cart" size={20} color="cyan" />
                    <Text style={styles.sectionText}>Đơn mua</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.section}
                    onPress={() => navigation.navigate('ChangePassword', { userId: userID })}
                >
                    <Icon name="lock" size={20} color="blue" />
                    <Text style={styles.sectionText}>Đổi mật khẩu</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.section} onPress={handleDeleteProfile}>
                    <Icon name="trash" size={20} color="red" />
                    <Text style={styles.sectionText}>Xóa hồ sơ</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.section} onPress={handleLogout}>
                    <Icon name="sign-out" size={20} color="violet" />
                    <Text style={styles.sectionText}>Đăng xuất</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default User;

const styles = StyleSheet.create({
    hinh: {
        marginTop: 10,
        width: '100%',
        height: 150,
        backgroundColor: "#EBF0F0",
        borderBottomEndRadius: 100,
        borderBottomStartRadius: 100,
        borderWidth: 1,
        borderColor: 'black',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop: 30,
    },
    header: {
        marginBottom: 20,
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    avatar: {
        marginTop: 130,
        position: 'absolute',
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 16,
        borderWidth: 2,
        borderColor: 'black',
    },
    userId: {
        marginTop: 60,
        fontSize: 5,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    userName: {
        fontSize: 16,
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
        color: '#888',
    },
    content: {
        flex: 1,
        padding: 16,
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: 12,
    },
    sectionText: {
        fontSize: 16,
        color: 'black',
        marginLeft: 8,
    },
});
