export  interface AssetModel {
    // meta
    szDecimals: number
    name: string
    maxLeverage: number
    
    // context
    prevDayPx: string
    markPx: string
    midPx: string | null
    dayNtlVlm: string
}

export interface AssetInfoModel {
    name: string
    maxLeverage: number

    prevDayPx: string
    markPx: string
    oraclePx: string
    dayVlm: string
    oi: string
    funding: string
    countdown: string
}
