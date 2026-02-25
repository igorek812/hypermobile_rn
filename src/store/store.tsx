import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { accountSlice } from "../services/account-redux";
import { nftSlice } from "../services/redux/opensea-redux";
import { tradeSlice } from "../services/trade-redux";
import { wsSlice } from "../services/websocket-redux";

const store = configureStore({
    reducer: {
        ws: wsSlice.reducer,
        trade: tradeSlice.reducer,
        account: accountSlice.reducer,
        nft: nftSlice.reducer
    }
})

export default store

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
