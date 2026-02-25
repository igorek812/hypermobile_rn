export enum TradeMenuType {
    BALANCE = "Balance",
    POSITIONS = "Positions",
    OPEN_ORDERS = "Open Orders",
    TWAP = "TWAP",
    TRADE_HISTORY = "Trade History",
    FUNDING_HISTORY = "Funding History",
    ORDER_HISTORY = "Order History"
}

export interface TradeMenuModel {
    type: TradeMenuType
    title: string
    count: number
}