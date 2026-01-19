// import AssetModel from '../models/asset-model';
// import { BalanceModel } from '../models/balance-model';
// import L2BookLevel from '../models/l2-book-level-model';
// import { setAssetPositions, setBalances, setL2Book, setOpenOrders, setSelectedAsset } from '../services/trade-redux';
// import { setAssets, setIsConnect } from '../services/websocket-redux';
// import websocketService from '../services/websocket-service';
// import store from '../store/store';

// class WebSocketRepository {
//     private constructor() {}
//     private static instance?: WebSocketRepository

//     // dispatch = useDispatch()
    
//     // assets: AssetModel[] = []
//     // isConnected = websocketService.isConnected

//     public static getInstance(): WebSocketRepository {
//         if (WebSocketRepository.instance == null) {
//             WebSocketRepository.instance = new WebSocketRepository()
//         }

//         return WebSocketRepository.instance
//     }

//     connect() {
//         // Connect to WebSocket
//         websocketService.connect();

//         const connectCallback = () => {
//             // this.isConnected = true
//             // this.dispatch(setIsConnect(true))
//             store.dispatch(setIsConnect(true))
//         };
        
//         const disconnectCallback = () => {
//             // this.isConnected = false
//             // this.dispatch(setIsConnect(false))
//             store.dispatch(setIsConnect(false))
//         };
        
//         websocketService.addCallbacks('connect', connectCallback);
//         websocketService.addCallbacks('disconnect', disconnectCallback);
//     }

//     disconnect() {
//         websocketService.disconnect();
//     }

//     webData2Callback = (webData2: any) => {
//         // console.log("webData2 = ", data)



//         // MARK: - ASSETS

//         let tempAssets = []

//         for (let i = 0; i < webData2.meta.universe.length; i++) {
//             const metaData = webData2.meta.universe[i]
//             const ctxData = webData2.assetCtxs[i]

//             const newItem: AssetModel = {
//                 szDecimals: metaData.szDecimals,
//                 name: metaData.name,
//                 maxLeverage: metaData.maxLeverage,
                
//                 prevDayPx: ctxData.prevDayPx,
//                 markPx: ctxData.markPx,
//                 midPx: ctxData.midPx,
//                 dayNtlVlm: ctxData.dayNtlVlm
//             }

//             tempAssets.push(newItem)
//         }

//         // this.assets = tempAssets
//         // this.dispatch(setAssets(tempAssets))
//         if (store.getState().trade.selectedAsset == null && tempAssets[0] != null) {
//             store.dispatch(setSelectedAsset(tempAssets[0]))
//         }
//         store.dispatch(setAssets(tempAssets))



//         // MARK: - Balances
        
//         let tempBalances: BalanceModel[] = []
        
//         let perpsBalance: BalanceModel = {
//             isPerps: true,
//             coin: "USDC",
//             usdcValue: webData2.clearinghouseState.marginSummary.accountValue,
//             availableBalance: webData2.clearinghouseState.withdrawable,
//             totalBalance: webData2.clearinghouseState.marginSummary.accountValue
//         }
        
//         tempBalances.push(perpsBalance)
        
//         webData2.spotState.balances.forEach ((spotBalance: any) => {
//             tempBalances.push({
//                 isPerps: false,
//                 coin: spotBalance.coin,
//                 usdcValue: spotBalance.total,
//                 availableBalance: spotBalance.total,
//                 totalBalance: spotBalance.total
//             })
//         })
        
//         store.dispatch(setBalances(tempBalances))



//         // MARK: - Positions

//         // if (store.getState().trade.assetPositions != webData2.clearinghouseState.assetPositions) {
//             let assetPositions: any[] = webData2.clearinghouseState.assetPositions
//             for (let i: any; i< assetPositions.length; i++) {
//                 let item = webData2.meta.universe.firstIndex((u: any) => {u.name == assetPositions[i].position.coin})
//                 if (item != null) {
//                     assetPositions[i].position.markPx = webData2.assetCtxs[i].markPx
//                 }
//             }
//         // }

//         store.dispatch(setAssetPositions(assetPositions))
        
        
//         // MARK: - Open Orders
        
//         // openOrders = webData2.openOrders
//         store.dispatch(setOpenOrders(webData2.openOrders))

//     };
    
//     subscribeToWebData2({userAddress}: {userAddress: string}) {
//         websocketService.addCallbacks('webData2', this.webData2Callback);
//         websocketService.sendMessage({
//             "method": "subscribe", 
//             "subscription": {
//                 "type": "webData2", 
//                 "user": userAddress
//             }
//         });
//     }
    
//     l2Callback = (data: any) => {
//         const levels = data.levels as L2BookLevel[][]
//         // console.log("lelel = ", levels)
//         store.dispatch(setL2Book(levels))
//     };
//     subscribeToL2(coin: string) {
//         websocketService.addCallbacks('l2Book', this.l2Callback);
//         websocketService.sendMessage({
//             "method": "subscribe", 
//             "subscription": {
//                 "type": "l2Book", 
//                 "coin": coin
//             }
//         });
//     }
    
//     unSubscribeToL2(coin: string) {
//         websocketService.addCallbacks('l2Book', () => {});
//         websocketService.sendMessage({
//             "method": "unsubscribe", 
//             "subscription": {
//                 "type": "l2Book", 
//                 "coin": coin
//             }
//         });
//     }
// }

// export default WebSocketRepository.getInstance()
