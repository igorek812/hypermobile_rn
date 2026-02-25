import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TCandle } from 'react-native-wagmi-charts'
import { ActiveAssetLeverageModel } from '../models/active-asset-leverage-model'
import { AssetInfoModel } from '../models/asset-model'
import AssetPositionModel from '../models/asset-position-model'
import BalanceModel from '../models/balance-model'
import { ChartItemModel } from '../models/chart-type-model'
import FundingHistoryModel from '../models/funding-history-model'
import L2BookLevelModel from '../models/l2-book-level-model'
import OpenOrdersModel from '../models/open-orders-model'
import OrderHistoryModel from '../models/order-history-model'
import { OrderTypeModel } from '../models/order-type-model'
import TradeHistoryModel from '../models/trade-history-model'

interface ChartData {
    data: ChartItemModel[]
    isLoading: boolean
    error: string | null
}

const initChartData: ChartData = { data: [], isLoading: true, error: null }

export interface TradeState {
    l2Book: L2BookLevelModel[][]
    balances: BalanceModel[]
    assetPositions: AssetPositionModel[]
    openOrders: OpenOrdersModel[]
    tradeHistory: TradeHistoryModel[]
    fundingHistory: FundingHistoryModel[]
    orderHistory: OrderHistoryModel[]
    activeAssetLeverageData: ActiveAssetLeverageModel | null

    selectedAssetName: string | null
    selectedAssetInfo: AssetInfoModel | null
    orderType: OrderTypeModel

    chartData: ChartData
    tempTCandle: TCandle[]
}

const tradeInitialState: TradeState = {
    l2Book: [],
    balances: [],
    assetPositions: [],
    openOrders: [],
    tradeHistory: [],
    fundingHistory: [],
    orderHistory: [],
    activeAssetLeverageData: null,

    selectedAssetName: null,
    selectedAssetInfo: null,
    orderType: OrderTypeModel.MARKET,
    chartData: initChartData,
    tempTCandle: []
}

export const tradeSlice = createSlice({
    name: "trade",
    initialState: tradeInitialState,
    reducers: {
        setSelectedAssetName: (state, action: PayloadAction<string>) => {
            state.selectedAssetName = action.payload

            // crear legacy data
            state.selectedAssetInfo = null
            state.l2Book = []
            state.activeAssetLeverageData = null
        },
        setSelectedAssetInfo: (state, action: PayloadAction<AssetInfoModel>) => {
            state.selectedAssetInfo = action.payload
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
        },
        setActiveAssetLeverage: (state, action: PayloadAction<ActiveAssetLeverageModel>) => {
            state.activeAssetLeverageData = action.payload
        },
        setOrderType: (state, action: PayloadAction<OrderTypeModel>) => {
            state.orderType = action.payload
        },

        // MARK: - Chart data
        setChartData: (state, action: PayloadAction<ChartItemModel[]>) => {
            state.chartData.data = action.payload

            state.tempTCandle = action.payload.map((e) => {
                return {
                    timestamp: e.t,
                    open: Number(e.o),
                    high: Number(e.h),
                    low: Number(e.l),
                    close: Number(e.c)
                }
            })
        },
        setChartDataIsLoading: (state, action: PayloadAction<boolean>) => {
            state.chartData.isLoading = action.payload
        },
        setChartDataError: (state, action: PayloadAction<string | null>) => {
            state.chartData.error = action.payload
        }
    }
})

export default tradeSlice.reducer;
export const tradeSliceActions = tradeSlice.actions;
