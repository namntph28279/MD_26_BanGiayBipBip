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
import io from 'socket.io-client';
import { getUrl } from "./api/socketio";


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
    const [userID, setUserID] = useState('');
    useEffect(() => {
        const fetchData = async () => {
          const socket = io(getUrl());
    
          socket.on('data-block', async (data) => {
            console.log('Nhận được sự kiện data-block:', data);
            try {
              const idFromAsyncStorage = await AsyncStorage.getItem("Email");

              console.log("try-block", data.userId);
              console.log("try-block 111  --- ", idFromAsyncStorage);
    
              if (idFromAsyncStorage === data.userId) {
                navigation.navigate('Login');
              }
    
              
            } catch (error) {
              console.error('Lỗi khi lấy dữ liệu từ AsyncStorage:', error);
            }
          });
          socket.on('data-deleted', (data) => {
            dispatch(fetchDataAndSetToRedux());
        });
    
          return () => {
            socket.disconnect();
          };
        };
    
        fetchData();
      }, [navigation]);


    // useEffect(() => {
    //     // Gọi getUserId ban đầu
    //     getUserId();

    //     // Thiết lập interval để gọi getUserId mỗi 2 giây
    //     const intervalId = setInterval(() => {
    //         getUserId();
    //     }, 1000);

    //     // Kiểm tra giá trị storedIsBlocked từ AsyncStorage
       

    //     // Gọi hàm kiểm tra mỗi khi component được render hoặc re-render
    //     checkIsBlocked();

    //     // Trong trường hợp component bị hủy, bạn cần xóa interval để ngăn chặn việc gọi không cần thiết.
    //     return () => {
    //         clearInterval(intervalId);
    //     };
    // }, [navigation]);

    const getUserId = async () => {
        try {
            const user = await AsyncStorage.getItem('Email');
            setUserID(user);
        } catch (error) {
            console.error('Error while fetching user ID:', error);
        }
    };
     const checkIsBlocked = async () => {
            try {
                const storedIsBlockedString = await AsyncStorage.getItem('1');
                const storedIsBlocked = JSON.parse(storedIsBlockedString);
                console.log('status user', storedIsBlocked)
                if (storedIsBlocked === true) {
                    await AsyncStorage.removeItem('1');
                    navigation.navigate('Login');  // Chuyển hướng đến màn hình Login nếu blocked
                }
            } catch (error) {
                console.error('Error while checking block status:', error);
            }
        };

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
                            checkIsBlocked(); // Kiểm tra lại nếu màn hình Home được focus
                        
                    }
                }}
            />
            <Tab.Screen name={"Tìm Kiếm"} component={Search}
                options={{
                    
                    tabBarIcon: ({ color, size }) => <Ionicons name='search' color={color} size={size} />

                }}
            />
            <Tab.Screen name={"Yêu Thích"} component={Favourite}
                initialParams={{ userID }}
                options={{
                    tabBarIcon: ({ color, size }) => <Ionicons name='heart' color={color} size={size} />
                }} />
            <Tab.Screen
                name="Giỏ Hàng"
                component={Cart}
                initialParams={{ userID }}
                options={{
                    tabBarIcon: ({ color, size }) => <Ionicons name='cart' color={color} size={size} />
                }}
            />

            <Tab.Screen
                name="Tài Khoản"
                component={User}
                options={{
                    tabBarLabel: 'Tài Khoản',
                    tabBarIcon: ({ color, size }) => <Ionicons name='person' color={color} size={size} />
                }}
            />

        </Tab.Navigator>
    )
}
export default TabNavi;