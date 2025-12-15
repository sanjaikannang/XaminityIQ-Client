import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";
import { apiInstance } from "../../state/services/api-instance";

export const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false,
        }).concat(apiInstance.middleware),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
