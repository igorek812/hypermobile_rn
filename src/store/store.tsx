import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import { tradeSlice } from "../services/trade-redux";
import { wsSlice } from "../services/websocket-redux";

const store = configureStore({
    reducer: {
        ws: wsSlice.reducer,
        trade: tradeSlice.reducer
    }
})

export default store

export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
// export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
