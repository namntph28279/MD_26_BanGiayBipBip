import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';
import SplashScreen from './screens/screenExtra/SplashScreen';
import Login from './screens/screenExtra/Login';
import Register from "./screens/screenExtra/Register";
import Home from "./screens/screenMain/Home";
import Cart from "./screens/screenMain/Cart";
import ProductDetail from "./screens/screenExtra/ProductDetail";
import SplapshScreen2 from './screens/screenExtra/SplashScreen2';
import User from "./screens/screenMain/User";
import TabNavi from './TabNavi';
import ChatScreen from "./screens/screenExtra/ChatScreen";
import ChangePassword from "./screens/screenExtra/ChangePassword";
import Oder from './screens/screenExtra/Oder';
import AllShoes from './screens/screenExtra/AllShoes';
import EditProfile from "./screens/screenExtra/EditProfile";
import ScreenAddresst from "./screens/screenExtra/screenAddresst";
import ThanhToanScreen from './screens/screenExtra/ThanhToanScreen';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import {useState} from "react";
import AllDiaChi from "./screens/screenExtra/AllDiaChi";

export default function App() {
  const Stack = createNativeStackNavigator();
  const [userID, setUserID] = useState('');
  return (
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName='SplashScreen'
           screenOptions={{gestureEnabled: false,
           }}>
            <Stack.Screen name='SplashScreen' component={SplashScreen} options={{ headerShown: false }} />
            <Stack.Screen name='SplashScreen2' component={SplapshScreen2} options={{ headerShown: false }} />
            <Stack.Screen name='AllShoes' component={AllShoes} options={{ title: 'Sản phẩm' }} />
            <Stack.Screen name='Login' component={Login} options={{ headerShown: false, }} />
            <Stack.Screen name='TabNavi' options={{ headerShown: false, }}>
              {(props) => <TabNavi {...props} userID={userID} />}
            </Stack.Screen>
            <Stack.Screen name='Register' component={Register} options={{ title: 'Đăng Ký' }} />
            <Stack.Screen name='Home' initialParams={{ userID: userID }} component={Home} options={{ title: 'Trang Chủ' }} />
            <Stack.Screen name='Cart' component={Cart} options={{ title: 'Giỏ hàng' }} />
            <Stack.Screen name='ProductDetail' component={ProductDetail} options={{ title: 'Chi Tiết Sản Phẩm' }} />
            <Stack.Screen
                name='User'
                component={User}
                initialParams={{ userID: userID }}
                options={{ title: 'Thông tin người dùng' }}
            />
            <Stack.Screen name='ChatScreen' component={ChatScreen} options={{ title: 'Nhóm chat cộng đồng' }} />
            <Stack.Screen name='ChangePassword' component={ChangePassword} options={{ title: 'Đổi Mật Khẩu' }} />
            <Stack.Screen name='Oder' component={Oder} options={{ title: 'Đơn mua' }} />
            <Stack.Screen name='EditProfile' component={EditProfile} options={{ title: 'Chỉnh sửa hồ sơ' }} />
            <Stack.Screen name='ScreenAddresst' component={ScreenAddresst} options={{ title: 'Thêm địa chỉ' }} />
            <Stack.Screen name="AllDiaChi" component={AllDiaChi} options={{ title: 'Địa chỉ' }}/>
            <Stack.Screen name="ThanhToanScreen" component={ThanhToanScreen} options={{ title: 'Thanh Toán' }}/>
          </Stack.Navigator>

        </NavigationContainer>
      </Provider>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
