import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import Ionicons from 'react-native-vector-icons/Ionicons';
import Home from "./screens/screenMain/Home";
import Favourite from "./screens/screenMain/Favourite";
import Cart from "./screens/screenMain/Cart";
import Search from "./screens/screenMain/Search";
import User from "./screens/screenMain/User";
import NotLoginUser from "./screens/screenExtra/NotLoginUser";
import {useEffect, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";

const Tab = createBottomTabNavigator();

const TabNavi = () => {
    const [userID,setUserID] = useState("");
    useEffect(() => {
        getUserId();
    }, [useIsFocused(),userID]);
    const getUserId = async () =>{
        const user = await AsyncStorage.getItem("Email");
        setUserID(user);
    }

    return (
        <Tab.Navigator
            initialRouteName={"Home"}
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: 'black',
                tabBarInactiveTintColor: 'gray',
                tabBarLabelStyle: {marginBottom: 5}, // Điều chỉnh khoảng cách giữa icon và title
                tabBarLabelPosition: 'below-icon', // Đặt vị trí của title
            }}>

            <Tab.Screen name="Home" component={Home}
                        initialParams={{userID}}
                        options={{
                            tabBarIcon: ({color, size}) => <Ionicons name='home' color={color} size={size}/>
                        }}
            />
            <Tab.Screen name={"Tìm Kiếm"} component={Search}
                        options={{
                            tabBarIcon: ({color, size}) => <Ionicons name='search' color={color} size={size}/>

                        }}
            />
            <Tab.Screen name={"Yêu Thích"} component={Favourite}
                        initialParams={{userID}}
                        options={{
                            tabBarIcon: ({color, size}) => <Ionicons name='heart' color={color} size={size}/>
                        }}/>

            <Tab.Screen
                name="Giỏ Hàng"
                component={Cart}
                initialParams={{userID}}
                options={{
                    tabBarIcon: ({color, size}) => <Ionicons name='cart' color={color} size={size}/>
                }}
            />

            {userID ? (
                <Tab.Screen
                    name="Tài Khoản"
                    component={User}
                    options={{
                        tabBarLabel: 'Tài Khoản',
                        tabBarIcon: ({color, size}) => <Ionicons name='person' color={color} size={size}/>
                    }}
                />
            ) : (
                <Tab.Screen
                    name="Tài Khoản"
                    component={NotLoginUser}
                    options={{
                        tabBarLabel: 'Tài Khoản',
                        tabBarIcon: ({color, size}) => <Ionicons name='person' color={color} size={size}/>
                    }}
                />
            )}
        </Tab.Navigator>
    )
}
export default TabNavi;