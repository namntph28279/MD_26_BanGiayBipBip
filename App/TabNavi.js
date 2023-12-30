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
import { useDispatch , useSelector} from 'react-redux';
import {fetchDataAndSetToRedux} from "./redux/AllData";



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
    const dispatch = useDispatch();
    const dataUserID = useSelector((state) => state.dataAll.dataUserID);
    const tokenApp = useSelector((state) => state.dataAll.dataTokenApp);

    const handleLogout = async () => {
        if(dataUserID == "" || tokenApp == ""){
            console.log("rỗng");
        }else{
            await url.post("/checkClientUser", { user: String(dataUserID), IdClient: String(tokenApp), status: false });
            await AsyncStorage.setItem("Email", "");
            await AsyncStorage.setItem("DefaultAddress", "");
            dispatch(fetchDataAndSetToRedux());
            console.log("Đăng xuất thành công");
        }
        
    };

    useEffect(() => {
        
        const fetchData = async () => {
            
            const socket = io(getUrl());

            socket.on('data-block', async (data) => {
                console.log('Nhận được sự kiện data-block:', data);
                try {
                    const idFromAsyncStorage = await AsyncStorage.getItem("Email");

                    if (idFromAsyncStorage === data.userId) {
                        handleLogout();
                        // await AsyncStorage.setItem("Email", "");
                        // await AsyncStorage.setItem("DefaultAddress", "");
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

                options={{
                    tabBarIcon: ({ color, size }) => <Ionicons name='home' color={color} size={size} />
                }}

            />
            <Tab.Screen name={"Tìm Kiếm"} component={Search}
                options={{

                    tabBarIcon: ({ color, size }) => <Ionicons name='search' color={color} size={size} />

                }}

            />
            <Tab.Screen name={"Yêu Thích"} component={Favourite}

                options={{
                    tabBarIcon: ({ color, size }) => <Ionicons name='heart' color={color} size={size} />
                }}

            />
            <Tab.Screen
                name="Giỏ Hàng"
                component={Cart}

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