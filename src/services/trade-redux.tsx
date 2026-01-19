import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import AssetModel from '../models/asset-model'
import AssetPositionModel from '../models/asset-position-model'
import BalanceModel from '../models/balance-model'
import FundingHistoryModel from '../models/funding-history-model'
import L2BookLevelModel from '../models/l2-book-level-model'
import OpenOrdersModel from '../models/open-orders-model'
import OrderHistoryModel from '../models/order-history-model'
import TradeHistoryModel from '../models/trade-history-model'

export interface TradeState {
    selectedAsset: AssetModel | null
    l2Book: L2BookLevelModel[][]
    balances: BalanceModel[]
    assetPositions: AssetPositionModel[]
    openOrders: OpenOrdersModel[]
    tradeHistory: TradeHistoryModel[]
    fundingHistory: FundingHistoryModel[]
    orderHistory: OrderHistoryModel[]
}

const tradeInitialState: TradeState = {
    selectedAsset: null,
    l2Book: [],
    balances: [],
    assetPositions: [],
    openOrders: [],
    tradeHistory: [],
    fundingHistory: [],
    orderHistory: []
}

export const tradeSlice = createSlice({
    name: "trade",
    initialState: tradeInitialState,
    reducers: {
        setSelectedAsset: (state, action: PayloadAction<AssetModel>) => {
            state.selectedAsset = action.payload
        },
        setAssetL2Book: (state, action: PayloadAction<L2BookLevelModel[][]>) => {
            state.l2Book = action.payload
        },
        setUserBalances: (state, action: PayloadAction<BalanceModel[]>) => {
            state.balances = action.payload
        },
        setUserAssetPositions: (state, action: PayloadAction<AssetPositionModel[]>) => {
            state.assetPositions = action.payload
        },
        setUserOpenOrders: (state, action: PayloadAction<OpenOrdersModel[]>) => {
            state.openOrders = action.payload
        },
        setUserTradeHistory: (state, action: PayloadAction<TradeHistoryModel[]>) => {
            state.tradeHistory = action.payload
        },
        setUserFundingHistory: (state, action: PayloadAction<FundingHistoryModel[]>) => {
            state.fundingHistory = action.payload
        },
        setUserOrderHistory: (state, action: PayloadAction<OrderHistoryModel[]>) => {
            state.orderHistory = action.payload
        }
    }
})

export default tradeSlice.reducer;
export const {
    setSelectedAsset, 
    setAssetL2Book, 
    setUserBalances, 
    setUserAssetPositions, 
    setUserOpenOrders, 
    setUserTradeHistory, 
    setUserFundingHistory, 
    setUserOrderHistory
} = tradeSlice.actions;
