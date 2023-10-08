import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from 'react-native-vector-icons/Ionicons';
import Home from "./compoment/Home";
import Favourite from "./compoment/Favourite";
import Cart from "./compoment/Cart";
import Search from "./compoment/Search";
import User from "./compoment/User";
import NotLoginUser from "./compoment/NotLoginUser";
import NoFavourite from "./compoment/NoFavourite";
import NoCart from "./compoment/NoCart";
const Tab = createBottomTabNavigator();

const TabNavi = ({ route }) => {
    const { isAuthenticated } = route.params || { isAuthenticated: false };
    return (
        <Tab.Navigator
            initialRouteName={"Trang Chủ"}
            screenOptions={{ headerShown: false }}
            tabBarOptions={{
                keyboardHidesTabBar: true,
                activeTintColor: 'black',
                inactiveTintColor: 'grey',
                labelStyle: { paddingBottom: 10, fontSize: 10 },
            }}>

            <Tab.Screen name={"Trang Chủ"} component={Home}

                options={{
                    tabBarIcon: ({ color, size }) => <Ionicons name='home' color={color} size={size} />
                }}
            />
            <Tab.Screen name={"Tìm Kiếm"} component={Search}
                options={{
                    tabBarIcon: ({ color, size }) => <Ionicons name='search' color={color} size={size} />

                }}
            />


            {isAuthenticated ? (
                <Tab.Screen name={"Yêu Thích"} component={Favourite}
                    options={{
                        tabBarIcon: ({ color, size }) => <Ionicons name='heart' color={color} size={size} />
                    }} />

            ) : (
                <Tab.Screen
                    name="Yêu Thích"
                    component={NoFavourite}
                    options={{
                        tabBarLabel: 'Favourite',
                        tabBarIcon: ({ color, size }) => <Ionicons name='heart' color={color} size={size} />
                    }}
                />
            )}

            {isAuthenticated ? (
                <Tab.Screen
                    name="Giỏ Hàng"
                    component={Cart}
                    options={{
                        tabBarIcon: ({ color, size }) => <Ionicons name='cart' color={color} size={size} />
                    }}
                />
            ) : (
                <Tab.Screen
                    name="Giỏ Hàng"
                    component={NoCart}
                    options={{
                        tabBarLabel: 'Cart',
                        tabBarIcon: ({ color, size }) => <Ionicons name='cart' color={color} size={size} />
                    }}
                />
            )}

            {isAuthenticated ? (
                <Tab.Screen
                    name="Tài Khoản"
                    component={User}
                    options={{
                        tabBarLabel: 'Tài Khoản',
                        tabBarIcon: ({ color, size }) => <Ionicons name='person' color={color} size={size} />
                    }}
                />
            ) : (
                <Tab.Screen
                    name="Tài Khoản"
                    component={NotLoginUser}
                    options={{
                        tabBarLabel: 'Tài Khoản',
                        tabBarIcon: ({ color, size }) => <Ionicons name='person' color={color} size={size} />
                    }}
                />
            )}
        </Tab.Navigator>
    )
}
export default TabNavi;