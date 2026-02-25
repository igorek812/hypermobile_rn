import { AssetLeverageMarginTypeModel } from "./asset-leverage-margin-type-model"

export default interface TradeOrderDataModel {
    leverageType: AssetLeverageMarginTypeModel
    leverageValue: number
    priceTextInputValue: string
    sizeTextInputValue: string
    orderValue: string
}