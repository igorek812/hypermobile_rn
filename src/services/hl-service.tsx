import { CancelSuccessResponse, ExchangeClient, HttpTransport, InfoClient, OrderSuccessResponse, UpdateLeverageSuccessResponse } from "@nktkas/hyperliquid";
import { formatPrice, formatSize, SymbolConverter } from "@nktkas/hyperliquid/utils";
import { Hex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import Errors from "../constants/errors";
import { AssetLeverageMarginTypeModel } from "../models/asset-leverage-margin-type-model";
import AssetPositionModel from "../models/asset-position-model";
import { ChartItemModel } from "../models/chart-type-model";
import store from "../store/store";
import { tradeSliceActions } from "./trade-redux";

class HLService {
    private constructor() { }

    private static instance?: HLService

    public static getInstance(): HLService {
        if (HLService.instance == null) {
            HLService.instance = new HLService()
        }

        return HLService.instance
    }

    async getAssetLeverageData({ coin, user }: { coin: string, user: string }) {
        const transport = new HttpTransport();

        const info = new InfoClient({
            transport: transport,
        })

        const result = await info.activeAssetData({ coin, user })
        console.log("activeAssetData = ", result)

        store.dispatch(tradeSliceActions.setActiveAssetLeverage({
            marginType: result.leverage.type == "isolated" ? AssetLeverageMarginTypeModel.ISOLATED : AssetLeverageMarginTypeModel.CROSS,
            value: result.leverage.value
        }))
    }

    async getCandleSnapshot({ coin, interval, startTime, endTime }: { coin: string, interval: "5m" | "1h" | "1d" | "1w" | "1M", startTime: number, endTime: number }) {
        try {
            const transport = new HttpTransport();

            const info = new InfoClient({
                transport: transport,
            })

            store.dispatch(tradeSliceActions.setChartDataError(null))
            store.dispatch(tradeSliceActions.setChartDataIsLoading(true))

            const result = await info.candleSnapshot({
                coin: coin,
                interval: interval,
                startTime: startTime,
                endTime: endTime

            })

            // console.log("candleSnapshot = ", result)

            const formarredResult: ChartItemModel[] = result.map((e) => {
                return {
                    t: e.t,
                    T: e.T,
                    o: e.o,
                    c: e.c,
                    h: e.h,
                    l: e.l,
                    v: e.v,
                    n: e.n
                }
            })

            store.dispatch(tradeSliceActions.setChartData(formarredResult))
        } catch (error: any) {
            store.dispatch(tradeSliceActions.setChartDataError(error))
        } finally {
            store.dispatch(tradeSliceActions.setChartDataIsLoading(false))
        }
    }

    async updateAssetLeverageValueData({ privateKey, coin, marginType, leverageValue }: { privateKey: Hex, coin: string, marginType: AssetLeverageMarginTypeModel, leverageValue: number }): Promise<UpdateLeverageSuccessResponse> {
        const transport = new HttpTransport();

        const exchange = new ExchangeClient({
            transport: transport,
            wallet: privateKeyToAccount(privateKey),
        })

        const converter = await SymbolConverter.create({ transport });
        const assetId = converter.getAssetId(coin)

        if (assetId == null) {
            throw new Error(`Asset id is null. coin is ${coin}`)
        }

        const result = await exchange.updateLeverage({ asset: assetId, isCross: marginType == AssetLeverageMarginTypeModel.CROSS, leverage: leverageValue })
        console.log("updateLeverage result = ", result)

        if (result.status == "ok") {
            store.dispatch(tradeSliceActions.setActiveAssetLeverage({
                marginType: marginType,
                value: leverageValue
            }))
        }

        return result
    }


    async cancelOrder({ privateKey, assetId, oid }: { privateKey: Hex, assetId: number, oid: number }): Promise<CancelSuccessResponse> {
        const transport = new HttpTransport();

        const exchange = new ExchangeClient({
            transport: transport,
            wallet: privateKeyToAccount(privateKey),
        });

        return await exchange.cancel({ "cancels": [{ "a": assetId, "o": oid }] })
    }


    async placeOrder({ privateKey, assetId, isLong, price, size }: { privateKey: Hex, assetId: number, isLong: boolean, price: string, size: string }): Promise<OrderSuccessResponse> {
        const transport = new HttpTransport();
        const exchange = new ExchangeClient({
            transport: transport,
            wallet: privateKeyToAccount(privateKey),
        });

        return await exchange.order({
            orders: [{
                a: assetId,
                b: isLong,
                p: price,
                s: size,
                r: false,
                t: { limit: { tif: "Gtc" } },
            }],
            grouping: "na",
        });
    }

    async closeByMarket({ privateKey, asset }: { privateKey: string, asset: AssetPositionModel }) {

        const transport = new HttpTransport();
        const exchange = new ExchangeClient({
            transport: transport,
            wallet: privateKeyToAccount(privateKey as Hex),
        });

        const info = new InfoClient({
            transport: transport,
        })
        
        const converter = await SymbolConverter.create({ transport });
        const assetId = converter.getAssetId(asset.position.coin)
        if (assetId == null) {
            throw new Error(Errors.ASSET_ID_NOT_FOUND)
        }

        const szDecimals = converter.getSzDecimals(asset.position.coin);
        if (szDecimals == null) {
            throw new Error(Errors.SZ_DECIMALS_NOT_FOUND)
        }

        const minds = await info.allMids()

        const currentPrice = parseFloat(minds[asset.position.coin])

        const isLong = Number(asset.position.szi) > 0

        let price: string
        if (isLong) {
            // Buy: set price above current (e.g., +1%)
            price = formatPrice(currentPrice * 1.01, szDecimals);
        } else {
            // Sell: set price below current (e.g., -1%)
            price = formatPrice(currentPrice * 0.99, szDecimals);
        }

        const size = formatSize(asset.position.szi, szDecimals);

        return await exchange.order({
            orders: [{
                a: assetId,
                b: isLong,
                p: price,
                s: size,
                r: false,
                t: { limit: { tif: "Gtc" } },
            }],
            grouping: "na",
        });
    }
}

export default HLService.getInstance()