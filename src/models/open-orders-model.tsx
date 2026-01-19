export default interface OpenOrdersModel {
    coin: string
    side: string
    limitPx: string
    sz: string
    oid: number
    timestamp: number
    triggerCondition: string
    isTrigger: boolean
    triggerPx: string
    children: OpenOrdersModel[]
    isPositionTpsl: boolean
    reduceOnly: boolean
    orderType: string
    origSz: string
    tif: string | null
    // cloid: null,
}