export enum ChartTypeModel {
    _5m = "5m",
    _1h = "1h",
    _1d = "1d",
    _1w = "1w",
    _1M = "1M"
}

export interface ChartItemModel {
    t: number // Opening timestamp (ms since epoch).
    T: number // Closing timestamp (ms since epoch).
    o: string // Opening price
    c: string // Closing price
    h: string // Highest price
    l: string // Lowest price
    v: string // Total volume traded in base currency
    n: number // Number of trades executed
}
