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


const dataAll = createSlice({
    name: 'data',

    initialState: {
        dataSP: [],
    },
    reducers: {
        setDataSP: (state, action) => {
            state.dataSP = action.payload;
        }
    }
})

export const { setDataSP } = dataAll.actions;


export const fetchDataAndSetToRedux = () => async (dispatch) => {

    const data = await getDataProduct();
    dispatch(setDataSP(data));


};

export default dataAll.reducer;