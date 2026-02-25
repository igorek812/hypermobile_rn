import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GetNftListResponseInterface } from "../api/opensea-service";

interface NftStateInterface {
    data: GetNftListResponseInterface | null,
    isLoading: boolean
    error: string | null
}

const nftInitState: NftStateInterface = {
    data: null,
    isLoading: true,
    error: null
}

export const nftSlice = createSlice({
    name: "nft",
    initialState: nftInitState,
    reducers: {
        setNftData: (state, action: PayloadAction<GetNftListResponseInterface>) => {
            state.isLoading = false
            state.data = action.payload
        },
        setIsLoading: (state, action: PayloadAction) => {
            state.isLoading = true
            state.error = null
        },
        setError: (state, action: PayloadAction<string>) => {
            state.isLoading = false
            state.error = action.payload
        },
    },
})

export default nftSlice.reducer
export const nftSliceActions = nftSlice.actions
