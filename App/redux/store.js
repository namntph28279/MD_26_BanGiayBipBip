import { configureStore } from "@reduxjs/toolkit";
import AllData from "./AllData";
export const store  = configureStore({
    reducer:{
        dataAll :AllData
    }
})