import { analyticsLogEvent } from "@/src/analytics/analytics"
import { COLORS } from "@/src/constants/colors"
import { useGlobalContext } from "@/src/context/global-provider"
import { TradeMenuModel, TradeMenuType } from "@/src/models/trade-menu-model"
import hlService from "@/src/services/hl-service"
import { useAppSelector } from "@/src/store/store"
import { ExchangeClient, HttpTransport } from "@nktkas/hyperliquid"
import { SymbolConverter } from "@nktkas/hyperliquid/utils"
import { FC, memo, useCallback, useEffect, useState } from "react"
import { Alert, FlatList, TouchableOpacity, View } from "react-native"
import { Hex } from "viem"
import { privateKeyToAccount } from "viem/accounts"
import StyledText from "../styled-text"
import BalancesListView from "./trade-list-views/balance-list-view"
import FundingHistoryListView from "./trade-list-views/funding-history-list-view"
import OpenOrdersListView from "./trade-list-views/open-orders-list-view"
import OrderHistoryListView from "./trade-list-views/order-history-list-view"
import PositionListView from "./trade-list-views/position-list-view"
import TradeHistoryListView from "./trade-list-views/trade-history-list-view"

interface TradeMenuViewProps {
    isShowLoadingView: (isShow: boolean) => void
}

const TradeMenuView: FC<TradeMenuViewProps> = memo(({ isShowLoadingView }) => {
    console.log("TradeMenuView render")

    const { agentWallet } = useGlobalContext()

    const balancesCount = useAppSelector((state) => state.trade.balances.length)
    const assetPositionsCount = useAppSelector((state) => state.trade.assetPositions.length)
    const openOrdersCount = useAppSelector((state) => state.trade.openOrders.length)

    const [selectedMenuType, setSelectedMenuType] = useState<TradeMenuType>(TradeMenuType.BALANCE)

    const [menu, setMenu] = useState<TradeMenuModel[]>([
        { type: TradeMenuType.BALANCE, title: "Balance", count: 0 },
        { type: TradeMenuType.POSITIONS, title: "Positions", count: 0 },
        { type: TradeMenuType.OPEN_ORDERS, title: "Open Orders", count: 0 },
        { type: TradeMenuType.TWAP, title: "TWAP", count: 0 },
        { type: TradeMenuType.TRADE_HISTORY, title: "Trade History", count: 0 },
        { type: TradeMenuType.FUNDING_HISTORY, title: "Funding History", count: 0 },
        { type: TradeMenuType.ORDER_HISTORY, title: "Order History", count: 0 },
    ])

    useEffect(() => {
        const tempMenu = menu.slice()
        for (let i = 0; i < tempMenu.length; i++) {
            if (tempMenu[i].type == TradeMenuType.BALANCE) {
                tempMenu[i].count = balancesCount
            } else if (tempMenu[i].type == TradeMenuType.POSITIONS) {
                tempMenu[i].count = assetPositionsCount
            } else if (tempMenu[i].type == TradeMenuType.OPEN_ORDERS) {
                tempMenu[i].count = openOrdersCount
            }
        }

        setMenu(tempMenu)
    }, [balancesCount, assetPositionsCount, openOrdersCount])



    const onPressMenuItem = useCallback((type: TradeMenuType) => {
        setSelectedMenuType(type)
    }, [])


    const handleCancelOrder = useCallback(async (assetName: string, oid: number) => {
        await analyticsLogEvent({ name: "cancel_order" })

        if (agentWallet == null) {
            alert("agentWallet is not init")
            return
        }

        isShowLoadingView(true)

        const transport = new HttpTransport();

        const exchange = new ExchangeClient({
            transport: transport,
            wallet: privateKeyToAccount(agentWallet.key as Hex),
        });

        const converter = await SymbolConverter.create({ transport });
        const assetId = converter.getAssetId(assetName)

        if (assetId == null) {
            isShowLoadingView(false)
            alert(`Wrong asset id, asset=${assetName}, id=${assetId}`)
            return
        }

        try {
            const result = await hlService.cancelOrder({ privateKey: agentWallet.key as Hex, assetId: assetId, oid: oid })
            Alert.alert(result.status, JSON.stringify(result))
        } catch (error) {
            alert(error)
        } finally {
            isShowLoadingView(false)
        }
    }, [])

    return (
        <View style={{paddingBottom: 10}}>
            <FlatList
                id='menu_list_id'
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                data={menu}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={{ paddingHorizontal: 6, paddingTop: 5, paddingBottom: 15 }}
                        onPress={() => {
                            onPressMenuItem(item.type)
                        }}
                    >
                        <StyledText style={item.type == selectedMenuType ? { color: COLORS.HL_GREEN } : { color: COLORS.PRIMARY_TEXT }}>{item.title} {item.count > 0 ? `(${item.count})` : ""}</StyledText>
                    </TouchableOpacity>
                )}
            />

            {selectedMenuType == TradeMenuType.BALANCE &&
                <BalancesListView />
            }

            {selectedMenuType == TradeMenuType.POSITIONS &&
                <PositionListView />
            }

            {selectedMenuType == TradeMenuType.OPEN_ORDERS &&
                <OpenOrdersListView onCancelOrder={handleCancelOrder} />
            }

            {selectedMenuType == TradeMenuType.TWAP &&
                <View>
                    <View style={{ marginLeft: 10 }}><StyledText>Soon..</StyledText></View>
                </View>
            }

            {selectedMenuType == TradeMenuType.TRADE_HISTORY &&
                <TradeHistoryListView />
            }

            {selectedMenuType == TradeMenuType.FUNDING_HISTORY &&
                <FundingHistoryListView />
            }

            {selectedMenuType == TradeMenuType.ORDER_HISTORY &&
                <OrderHistoryListView />
            }
        </View>
    )
})

export default TradeMenuView
