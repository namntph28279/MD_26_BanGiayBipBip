import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from 'react-native-vector-icons/Ionicons';
import Home from "./screens/screenMain/Home";
import Favourite from "./screens/screenMain/Favourite";
import Cart from "./screens/screenMain/Cart";
import Search from "./screens/screenMain/Search";
import User from "./screens/screenMain/User";
import NotLoginUser from "./screens/screenExtra/NotLoginUser";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import { Alert, Platform } from "react-native";
import url from "./api/url";

Notifications.setNotificationHandler({
    handleNotification: async () => {
        return {
            shouldPlaySound: false,
            shouldSetBadge: false,
            shouldShowAlert: true,
        };
    },
});

const Tab = createBottomTabNavigator();


const TabNavi = ({ navigation }) => {
    const checkUserStatus = async () => {

        try {
            const email = await AsyncStorage.getItem("Email");

            if (email !== null) {
                const response = await url.get(`/user/${email}`);
                const userData = response.data;

                if (userData.status) {
                    const { date, block_reason } = userData;
                    console.log(`Tài khoản đã bị khóa. ngày: ${date}, nội dung: ${block_reason}`);
                    Alert.alert('Thông báo', 'Tài khoản của bạn đã bị chặn vào lúc: \n'+ userData.date);
                    await AsyncStorage.removeItem("Email");

                    navigation.navigate('Login');
                }
            }
        } catch (error) {
            console.error(error);
        }
    };
    const [userID, setUserID] = useState('');

    // useEffect(() => {
    //     // Gọi getUserId ban đầu
    //     getUserId();
    //
    //     // Thiết lập interval để gọi getUserId mỗi 2 giây
    //     const intervalId = setInterval(() => {
    //         getUserId();
    //     }, 1000);
    //
    //     // Kiểm tra giá trị storedIsBlocked từ AsyncStorage
    //
    //
    //     // Gọi hàm kiểm tra mỗi khi component được render hoặc re-render
    //     checkIsBlocked();
    //
    //     // Trong trường hợp component bị hủy, bạn cần xóa interval để ngăn chặn việc gọi không cần thiết.
    //     return () => {
    //         clearInterval(intervalId);
    //     };
    // }, [navigation]);

    // const getUserId = async () => {
    //     try {
    //         const user = await AsyncStorage.getItem('Email');
    //         setUserID(user);
    //     } catch (error) {
    //         console.error('Error while fetching user ID:', error);
    //     }
    // };
     // const checkIsBlocked = async () => {
     //        try {
     //            const storedIsBlockedString = await AsyncStorage.getItem('1');
     //            const storedIsBlocked = JSON.parse(storedIsBlockedString);
     //            console.log('status user', storedIsBlocked)
     //            if (storedIsBlocked === true) {
     //                await AsyncStorage.removeItem('1');
     //                navigation.navigate('Login');  // Chuyển hướng đến màn hình Login nếu blocked
     //            }
     //        } catch (error) {
     //            console.error('Error while checking block status:', error);
     //        }
     //    };

    return (
        <Tab.Navigator
            initialRouteName={"Home"}
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: 'black',
                tabBarInactiveTintColor: 'gray',
                tabBarLabelStyle: { marginBottom: 5 }, // Điều chỉnh khoảng cách giữa icon và title
                tabBarLabelPosition: 'below-icon', // Đặt vị trí của title
            }}>
            <Tab.Screen name="Home" component={Home}
                initialParams={{ userID }}
                options={{
                    tabBarIcon: ({ color, size }) => <Ionicons name='home' color={color} size={size} />
                }}
                        listeners={{
                            focus: () => {
                                checkUserStatus();
                            },
                        }}
            />
            <Tab.Screen name={"Tìm Kiếm"} component={Search}
                options={{
                    
                    tabBarIcon: ({ color, size }) => <Ionicons name='search' color={color} size={size} />

                }}
                        listeners={{
                            focus: () => {
                                checkUserStatus();
                            },
                        }}
            />
            <Tab.Screen name={"Yêu Thích"} component={Favourite}
                initialParams={{ userID }}
                options={{
                    tabBarIcon: ({ color, size }) => <Ionicons name='heart' color={color} size={size} />
                }}
                        listeners={{
                            focus: () => {
                                checkUserStatus();
                            },
                        }}
            />
            <Tab.Screen
                name="Giỏ Hàng"
                component={Cart}
                initialParams={{ userID }}
                options={{
                    tabBarIcon: ({ color, size }) => <Ionicons name='cart' color={color} size={size} />
                }}
                listeners={{
                    focus: () => {
                        checkUserStatus();
                    },
                }}
            />

            <Tab.Screen
                name="Tài Khoản"
                component={User}
                options={{
                    tabBarLabel: 'Tài Khoản',
                    tabBarIcon: ({ color, size }) => <Ionicons name='person' color={color} size={size} />
                }}
                listeners={{
                    focus: () => {
                        checkUserStatus();
                    },
                }}
            />

        </Tab.Navigator>
    )
}
export default TabNavi;