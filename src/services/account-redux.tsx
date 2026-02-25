import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AccountState {
    accountEquitySpotBalance: number | null
    accountEquityPerpsBalance: number | null

    perpsOverviewBalance: number | null
    perpsOverviewUnrealizedPnl: number | null
    perpsOverviewCrossMarginRatio: number | null
    perpsOverviewMaintenanceMargin: number | null
    perpsOverviewCrossAccountLeverage: number | null
}

const accountInitialState: AccountState = {
    accountEquitySpotBalance: null,
    accountEquityPerpsBalance: null,

    perpsOverviewBalance: null,
    perpsOverviewUnrealizedPnl: null,
    perpsOverviewCrossMarginRatio: null,
    perpsOverviewMaintenanceMargin: null,
    perpsOverviewCrossAccountLeverage: null
}

export const accountSlice = createSlice({
    name: "account",
    initialState: accountInitialState,
    reducers: {
        setAccountEquitySpotBalance: (state, action: PayloadAction<number>) => {
            state.accountEquitySpotBalance = action.payload
        },
        setAccountEquityPerpsBalance: (state, action: PayloadAction<number>) => {
            state.accountEquityPerpsBalance = action.payload
        },
        setPerpsOverviewBalance: (state, action: PayloadAction<number>) => {
            state.perpsOverviewBalance = action.payload
        },
        setPerpsOverviewUnrealizedPnl: (state, action: PayloadAction<number>) => {
            state.perpsOverviewUnrealizedPnl = action.payload
        },
        setPerpsOverviewCrossMarginRatio: (state, action: PayloadAction<number>) => {
            state.perpsOverviewCrossMarginRatio = action.payload
        },
        setPerpsOverviewMaintenanceMargin: (state, action: PayloadAction<number>) => {
            state.perpsOverviewMaintenanceMargin = action.payload
        },
        setPerpsOverviewCrossAccountLeverage: (state, action: PayloadAction<number>) => {
            state.perpsOverviewCrossAccountLeverage = action.payload
        },
    }
})

export default accountSlice.reducer;
export const accountSliceActions = accountSlice.actions;
