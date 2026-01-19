export default interface AssetPositionModel {
    type: string
    position: AssetPositionModelItem
}

interface AssetPositionModelItem {
    coin: string
    szi: string
    leverage: AssetPositionModelLeverage
    entryPx: string
    positionValue: string
    unrealizedPnl: string
    returnOnEquity: string
    liquidationPx: string | null
    marginUsed: string
    maxLeverage: number
    cumFunding: AssetPositionModelFunding
    markPx: string | null
}

interface AssetPositionModelLeverage {
    type: string
    value: number
}

interface AssetPositionModelFunding {
    allTime: string
    sinceOpen: string
    sinceChange: string
}
