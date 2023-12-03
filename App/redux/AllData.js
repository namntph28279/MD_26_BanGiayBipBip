import {createSlice} from "@reduxjs/toolkit";
import url from "../api/url"
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";

const getDataProduct = async () => {
    try {
        const response = await url.get("/");
        return response.data ;
    } catch (error) {
        return [];
    }
};

const getDataSPBestSale = async () => {
    try {
        const response = await url.get("/top-selling");
        return response.data ;
    } catch (error) {
        return [];
    }
};

const getDataFavourite = async () => {
    try {
        const email = await AsyncStorage.getItem('Email');
        const response = await url.get(`/favourite/${email}`);
        console.log(email)
        return response.data ;
    } catch (error) {
        return [];
    }
};

const getAsyncStorage = async () => {
    try {
        const email = await AsyncStorage.getItem('Email');
        console.log(email)
        return email;

    } catch (error) {
        return [];
    }
};

const getDataUser = async () => {
    try {
        const email = await AsyncStorage.getItem('Email');
        const response = await url.get(`/profile/${email}`);

        return response.data;
    } catch (error) {
        return [];
    }
};

const getDataCart = async () => {
    try {
        const email = await AsyncStorage.getItem("Email");
        const cartRef = await url.get(`/cart/${email}`);
        const cartData = cartRef.data;
        if (cartData) {
            const products = Object.keys(cartData).map((key) => ({
                id: key,
                ...cartData[key],
                selected: false,
            }));
            return  products;
        } else {
            return  [];
        }
    } catch (error) {
        return [];
    }
};

const getDataDonHang = async () => {
    try {
        const email = await AsyncStorage.getItem("Email");
        const orderRef = await url.get(`/dataOrderUser/${email}`);
        const orderData = orderRef.data;
        if (orderData) {
            return  orderData;
        } else {
            return  [];
        }
    } catch (error) {
        return [];
    }
};


const getTokenApp = async () => {
    try {
        const pushTokenData = await Notifications.getExpoPushTokenAsync();
        console.log(pushTokenData.data)
        return pushTokenData.data;
    } catch (error) {
        return [];
    }
};

const dataAll = createSlice({
    name: 'data',

    initialState: {
        dataSP: [],
        dataSPBestSale:[],
        dataSPFav:[],
        dataUserID:[],
        dataUser:[] ,
        dataTokenApp:[],
        dataCart:[],
        dataDonHang:[],
    },
    reducers: {
        setDataSP: (state, action) => {
            state.dataSP = action.payload;
        },
        setDataSPBestSale: (state, action) => {
            state.dataSPBestSale = action.payload;
        },
        setDataSPFav: (state, action) => {
            state.dataSPFav = action.payload;
        },
        setAsyncStorage: (state, action) => {
            state.dataUserID = action.payload;
        },
        setUser: (state, action) => {
            state.dataUser = action.payload;
        },
        setTokenApp: (state, action) => {
            state.dataTokenApp = action.payload;
        },
        setDataCart: (state, action) => {
            state.dataCart = action.payload;
        },
        setDataDonHang: (state, action) => {
            state.dataDonHang = action.payload;
        }
    }
})

export const {
    setDataSP,
    setDataSPBestSale,
    setDataSPFav,
    setAsyncStorage,
    setUser ,
    setTokenApp,
    setDataCart,
    setDataDonHang
} = dataAll.actions;


export const fetchDataAndSetToRedux = () => async (dispatch) => {
    const data = await getDataProduct();
    dispatch(setDataSP(data));

    const dataBestSale = await getDataSPBestSale();
    dispatch(setDataSPBestSale(dataBestSale));

    const dataSPFav = await getDataFavourite();
    dispatch(setDataSPFav(dataSPFav));

    const dataUserID = await  getAsyncStorage();
    dispatch(setAsyncStorage(dataUserID))

    const dataUser = await  getDataUser();
    dispatch(setUser(dataUser))

    const dataTokenApp = await  getTokenApp();
    dispatch(setTokenApp(dataTokenApp))

    const dataCart = await  getDataCart();
    dispatch(setDataCart(dataCart))

    const dataDonHang = await  getDataDonHang();
    dispatch(setDataDonHang(dataDonHang))
};

export const fetchDataAndFav = () => async (dispatch) => {
    const dataSPFav = await getDataFavourite();
    dispatch(setDataSPFav(dataSPFav));
};

export const fetchDataCart = () => async (dispatch) => {
    const dataCart = await  getDataCart();
    dispatch(setTokenApp(dataCart))
};

export const fetchDataOrder = () => async (dispatch) => {
    const dataDonHang = await  getDataDonHang();
    dispatch(setDataDonHang(dataDonHang))
};


export default dataAll.reducer;