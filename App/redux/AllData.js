import {createSlice} from "@reduxjs/toolkit";
import url from "../api/url"
import AsyncStorage from "@react-native-async-storage/async-storage";

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
        console.log("getFav: "+email)
        const response = await url.get(`/favourite/${email}`);
        return response.data ;
    } catch (error) {
        return [];
    }
};

const dataAll = createSlice({
    name: 'data',

    initialState: {
        dataSP: [],
        dataSPBestSale:[],
        dataSPFav:[]
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
        }
    }
})

export const { setDataSP,setDataSPBestSale,setDataSPFav } = dataAll.actions;


export const fetchDataAndSetToRedux = () => async (dispatch) => {

    const data = await getDataProduct();
    dispatch(setDataSP(data));

    const dataBestSale = await getDataSPBestSale();
    dispatch(setDataSPBestSale(dataBestSale));

    const dataSPFav = await getDataFavourite();
    dispatch(setDataSPFav(dataSPFav));


};

export default dataAll.reducer;