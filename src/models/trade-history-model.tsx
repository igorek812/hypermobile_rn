export default interface TradeHistoryModel {
    coin: string
    px: string
    sz: string
    side: string
    time: number
    startPosition: string
    dir: string
    closedPnl: string
    hash: string
    oid: number
    crossed: boolean
    fee: string
    tid: number
    feeToken: string
//    twapId: null,
}
