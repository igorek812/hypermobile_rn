import "event-target-polyfill";
import "fast-text-encoding";

import { ISubscription, L2BookResponse, SubscriptionClient, UserFillsWsEvent, UserFundingsWsEvent, UserHistoricalOrdersWsEvent, WebData2Response, WebSocketTransport } from "@nktkas/hyperliquid";
import AssetModel from "../models/asset-model";
import BalanceModel from "../models/balance-model";
import FundingHistoryModel from "../models/funding-history-model";
import L2BookLevelModel from "../models/l2-book-level-model";
import OpenOrdersModel from "../models/open-orders-model";
import OrderHistoryModel from "../models/order-history-model";
import TradeHistoryModel from "../models/trade-history-model";
import store from "../store/store";
import { setAssetL2Book, setSelectedAsset, setUserAssetPositions, setUserBalances, setUserFundingHistory, setUserOpenOrders, setUserOrderHistory, setUserTradeHistory } from "./trade-redux";
import { setAssets } from "./websocket-redux";

class WebSocketService {
    private constructor() {}

    private static instance?: WebSocketService

    callbacks: any = {};
    
    client: SubscriptionClient | null = null

    public static getInstance(): WebSocketService {
        if (WebSocketService.instance == null) {
            WebSocketService.instance = new WebSocketService()
        }

        return WebSocketService.instance
    }

    async connect() {
        if (this.client) {
            return
        }

        const transport = new WebSocketTransport();
        this.client = new SubscriptionClient({ transport });
    };

    webData2Subscribtion: ISubscription | null = null
    l2BookSubscribtion: ISubscription | null = null
    userFundingsSubscribtion: ISubscription | null = null
    userHistoricalOrdersSubscribtion: ISubscription | null = null
    userTradeHistorySubscribtion: ISubscription | null = null

    async subscribeToWebData2({user}: {user: string}) {
        if (this.client == null) {
            console.log("subscribeToWebData2 error. client is null")
            return
        }

        await this.webData2Subscribtion?.unsubscribe()

        this.webData2Subscribtion = await this.client.webData2({user: user}, this.webData2Handler)
    }


    async subscribeToL2Book({coin}: {coin: string}) {
        if (this.client == null) {
            console.log("subscribeToL2 error. client is null")
            return
        }

        await this.l2BookSubscribtion?.unsubscribe()

        this.l2BookSubscribtion = await this.client.l2Book({coin: coin}, this.l2BookHandler)
    }


    async subscribeToUserTradeHistory({user}: {user: string}) {
        if (this.client == null) {
            console.log("subscribeToUserTradeHistory error. client is null")
            return
        }

        await this.userTradeHistorySubscribtion?.unsubscribe()

        this.userTradeHistorySubscribtion = await this.client.userFills({user: user}, this.userFillsHandler)
    }

    userFillsHandler = (userFillsResponse: UserFillsWsEvent) => {

        const userTradeHistory: TradeHistoryModel[] = userFillsResponse.fills.map((e) => {
            return {
                coin: e.coin,
                px: e.px,
                sz: e.sz,
                side: e.side,
                time: e.time,
                startPosition: e.startPosition,
                dir: e.dir,
                closedPnl: e.closedPnl,
                hash: e.hash,
                oid: e.oid,
                crossed: e.crossed,
                fee: e.fee,
                tid: e.tid,
                feeToken: e.feeToken
            }
        })

        store.dispatch(setUserTradeHistory(userTradeHistory))
    }


    async subscribeToOrderHistory({user}: {user: string}) {
        if (this.client == null) {
            console.log("subscribeToOrderHistory error. client is null")
            return
        }

        await this.userHistoricalOrdersSubscribtion?.unsubscribe()

        this.userHistoricalOrdersSubscribtion = await this.client.userHistoricalOrders({user: user}, this.userHistoricalOrdersHandler)
    }

    userHistoricalOrdersHandler = (historicalOrders: UserHistoricalOrdersWsEvent) => {
        let tempOrders: OrderHistoryModel[] = historicalOrders.orderHistory.map((e) => {
            return {
                order: {
                        coin: e.order.coin,
                        side: e.order.side,
                        limitPx: e.order.limitPx,
                        sz: e.order.sz,
                        oid: e.order.oid,
                        timestamp: e.order.timestamp,
                        triggerCondition: e.order.triggerCondition,
                        isTrigger: e.order.isTrigger,
                        triggerPx: e.order.triggerPx,
                        children: [],
                        isPositionTpsl: e.order.isPositionTpsl,
                        reduceOnly: e.order.reduceOnly,
                        orderType: e.order.orderType,
                        origSz: e.order.origSz,
                        tif: e.order.tif
                },
                status: e.status,
                statusTimestamp: e.statusTimestamp
            }
        })

        store.dispatch(setUserOrderHistory(tempOrders))
    }

    async subscribeToFundingHistory({user}: {user: string}) {
        if (this.client == null) {
            console.log("subscribeToFundingHistory error. client is null")
            return
        }

        await this.userFundingsSubscribtion?.unsubscribe()

        this.userFundingsSubscribtion = await this.client.userFundings({user: user}, this.userFundingsHandler)
    }

    userFundingsHandler = (userFundings: UserFundingsWsEvent) => {
        const tempFunding: FundingHistoryModel[] = userFundings.fundings.map((e) => {
            return {
                time: e.time,
                coin: e.coin,
                usdc: e.usdc,
                szi: e.szi,
                fundingRate: e.fundingRate
            }
        })

        store.dispatch(setUserFundingHistory(tempFunding))
    }



//   disconnect() {
//     if (this.ws) {
//       this.ws.close();
//       this.ws = null;
//       this.isConnected = false;
//       clearTimeout(this.timeout);
//     }
//   }

    // MARK: - Handlers

    webData2Handler = (webData2: WebData2Response) => {
        // console.log("webData2 = ", data)
        
        // MARK: - ASSETS

        let tempAssets: AssetModel[] = []

        for (let i = 0; i < webData2.meta.universe.length; i++) {
            const metaData = webData2.meta.universe[i]
            const ctxData = webData2.assetCtxs[i]

            const newItem: AssetModel = {
                szDecimals: metaData.szDecimals,
                name: metaData.name,
                maxLeverage: metaData.maxLeverage,
                
                prevDayPx: ctxData.prevDayPx,
                markPx: ctxData.markPx,
                midPx: ctxData.midPx,
                dayNtlVlm: ctxData.dayNtlVlm
            }

            tempAssets.push(newItem)
        }

        if (store.getState().trade.selectedAsset == null && tempAssets[0] != null) {
            store.dispatch(setSelectedAsset(tempAssets[0]))
        }
        store.dispatch(setAssets(tempAssets))

        // MARK: - Balances
        
        let tempBalances: BalanceModel[] = []
        
        let perpsBalance: BalanceModel = {
            isPerps: true,
            coin: "USDC",
            usdcValue: webData2.clearinghouseState.marginSummary.accountValue,
            availableBalance: webData2.clearinghouseState.withdrawable,
            totalBalance: webData2.clearinghouseState.marginSummary.accountValue
        }
        
        tempBalances.push(perpsBalance)
        
        webData2.spotState?.balances.forEach ((spotBalance: any) => {
            tempBalances.push({
                isPerps: false,
                coin: spotBalance.coin,
                usdcValue: spotBalance.total,
                availableBalance: spotBalance.total,
                totalBalance: spotBalance.total
            })
        })
        
        store.dispatch(setUserBalances(tempBalances))

        // MARK: - Positions

        // if (store.getState().trade.assetPositions != webData2.clearinghouseState.assetPositions) {
            let assetPositions: any[] = webData2.clearinghouseState.assetPositions
            for (let i: any; i< assetPositions.length; i++) {
                // @ts-ignore
                let item = webData2.meta.universe.firstIndex((u: any) => {u.name == assetPositions[i].position.coin})
                if (item != null) {
                    assetPositions[i].position.markPx = webData2.assetCtxs[i].markPx
                }
            }
        // }

        store.dispatch(setUserAssetPositions(assetPositions))
        
        
        // MARK: - Open Orders
        
        // openOrders = webData2.openOrders
        const tempOpenOrders: OpenOrdersModel[] = webData2.openOrders?.map((e) => {
            return {
                coin: e.coin,
                side: e.side,
                limitPx: e.limitPx,
                sz: e.sz,
                oid: e.oid,
                timestamp: e.timestamp,
                triggerCondition: e.triggerCondition,
                isTrigger: e.isTrigger,
                triggerPx: e.triggerPx,
                children: [],
                isPositionTpsl: e.isPositionTpsl,
                reduceOnly: e.reduceOnly,
                orderType: e.orderType,
                origSz: e.origSz,
                tif: e.tif
            }
        })
        store.dispatch(setUserOpenOrders(tempOpenOrders))
    };

    l2BookHandler = (l2Book: L2BookResponse) => {

        let tempL2Bool: L2BookLevelModel[][] = []
        
        if (l2Book) {
            let tempAsks: L2BookLevelModel[] = []
            for (const e of l2Book.levels[0]) {
                tempAsks.push({
                    px: e.px,
                    sz: e.sz,
                    n: e.n
                })
            }

            tempL2Bool.push(tempAsks)

            let tempBids: L2BookLevelModel[] = []
            for (const e of l2Book.levels[1]) {
                tempBids.push({
                    px: e.px,
                    sz: e.sz,
                    n: e.n
                })
            }
            tempL2Bool.push(tempBids)
        }

        store.dispatch(setAssetL2Book(tempL2Bool))
    }
}

export default WebSocketService.getInstance();
