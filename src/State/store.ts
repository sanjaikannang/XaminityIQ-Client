import { configureStore } from '@reduxjs/toolkit';
import authReducer from './Slices/authSlice'
import adminReducer from './Slices/adminSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        admin: adminReducer,
    }
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;    