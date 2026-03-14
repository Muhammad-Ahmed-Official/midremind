import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import medicineReducer from "./medicineSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    medicine: medicineReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;