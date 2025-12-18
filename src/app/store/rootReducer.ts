import { combineReducers } from "@reduxjs/toolkit";
import { apiInstance } from "../../state/services/api-instance";


const rootReducer = combineReducers({
    // auth: authSlice.reducer,
    [apiInstance.reducerPath]: apiInstance.reducer,
});

export default rootReducer;
