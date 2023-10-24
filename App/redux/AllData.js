import {createSlice} from "@reduxjs/toolkit";
import url from "../api/url"



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


const dataAll = createSlice({
    name: 'data',

    initialState: {
        dataSP: [],
        dataSPBestSale:[]
    },
    reducers: {
        setDataSP: (state, action) => {
            state.dataSP = action.payload;
        },
        setDataSPBestSale: (state, action) => {
            state.dataSPBestSale = action.payload;
        }
    }
})

export const { setDataSP,setDataSPBestSale } = dataAll.actions;


export const fetchDataAndSetToRedux = () => async (dispatch) => {

    const data = await getDataProduct();
    dispatch(setDataSP(data));

    const dataBestSale = await getDataSPBestSale();
    dispatch(setDataSPBestSale(dataBestSale));


};

export default dataAll.reducer;