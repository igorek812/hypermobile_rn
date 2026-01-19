import OpenOrdersModel from "./open-orders-model";

export default interface OrderHistoryModel {
    order: OpenOrdersModel
    status: string
    statusTimestamp: number
}