export default interface AssetModel {
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