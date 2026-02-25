import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AssetModel } from '../models/asset-model'

export interface WebSocketState {
    isConnect: boolean
    assets: AssetModel[]
}

const wsInitialState: WebSocketState = {
    isConnect: false,
    assets: []
}

export const wsSlice = createSlice({
    name: "ws",
    initialState: wsInitialState,
    reducers: {
        setIsConnect: (state, action: PayloadAction<boolean>) => {
            state.isConnect = action.payload
        },
        setAssets: (state, action: PayloadAction<AssetModel[]>) => {
            state.assets = action.payload
        }
    }
})

export default wsSlice.reducer;
export const {setIsConnect, setAssets} = wsSlice.actions;
