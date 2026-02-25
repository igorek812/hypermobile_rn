import { COLORS } from "@/src/constants/colors"
import { formatDate } from "@/src/helpers/date"
import OpenOrdersModel from "@/src/models/open-orders-model"
import { tradeSliceActions } from "@/src/services/trade-redux"
import { useAppSelector } from "@/src/store/store"
import { memo } from "react"
import { FlatList, TouchableOpacity, View } from "react-native"
import { useDispatch } from "react-redux"
import StyledText from "../../styled-text"

const OpenOrdersListView = memo(({ onCancelOrder }: { onCancelOrder: (assetName: string, oid: number) => void }) => {
    console.log("OpenOrdersListView render")

    const openOrders = useAppSelector((state) => state.trade.openOrders)
    const dispatcher = useDispatch()

    const onPressAsset = (coinName: string) => {
        console.log(coinName)
        dispatcher(tradeSliceActions.setSelectedAssetName(coinName))
    }

    console.log("openOrders = ", JSON.stringify(openOrders))

    return (
        <View>
            {openOrders.length == 0 && <View style={{ marginLeft: 10 }}><StyledText>No open orders yet</StyledText></View>}
            <FlatList
                id='open_orders_list_id'
                scrollEnabled={false}
                showsHorizontalScrollIndicator={true}
                data={openOrders}
                renderItem={({ item }) => (<OpenOrdersListItemView
                    item={item}
                    onPressAsset={() => onPressAsset(item.coin)}
                    onPressCancel={() => {
                        onCancelOrder(item.coin, item.oid)
                    }}
                />)
                }
            />
        </View>
    )
})

export default OpenOrdersListView


// MARK: - Item

const OpenOrdersListItemView = memo(({ item, onPressAsset, onPressCancel }: { item: OpenOrdersModel, onPressAsset: () => void, onPressCancel: () => void }) => {
    console.log("OpenOrdersListItemView render. item = ", item)

    const orderColor = item.side == "A" ? COLORS.HL_RED : COLORS.HL_GREEN
    const direction = item.side == "A" ? "Short" : "Long"

    const date = formatDate({ timestamp: item.timestamp })

    return (
        <View style={{ backgroundColor: COLORS.HL_BG1, borderColor: COLORS.HL_BORDER, borderWidth: 1, borderRadius: 6, marginBottom: 5, marginHorizontal: 5, padding: 10 }}>

            {/* First row */}
            <View style={{ flexDirection: 'row', justifyContent: "space-between", marginBottom: 10 }}>
                <TouchableOpacity style={{ flex: 1 }} onPress={onPressAsset}>
                    <StyledText style={{ fontSize: 12, color: COLORS.HL_GRAY }}>Coin</StyledText>
                    <StyledText style={{ color: orderColor, fontWeight: 'bold' }} numberOfLines={1}>{item.coin}</StyledText>
                </TouchableOpacity>

                <View style={{ flex: 1 }}>
                    <StyledText style={{ fontSize: 12, color: COLORS.HL_GRAY }}>Time</StyledText>
                    <StyledText numberOfLines={2}>{date}</StyledText>
                </View>

                <View style={{ flex: 1 }}>
                    <StyledText style={{ fontSize: 12, color: COLORS.HL_GRAY }}>Type</StyledText>
                    <StyledText numberOfLines={1}>{item.orderType}</StyledText>
                </View>
            </View>

            {/* Second row */}
            <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                <View style={{ flex: 1 }}>
                    <StyledText style={{ fontSize: 12, color: COLORS.HL_GRAY }}>Direction</StyledText>
                    <StyledText numberOfLines={1}>{direction}</StyledText>
                </View>

                <View style={{ flex: 1 }}>
                    <StyledText style={{ fontSize: 12, color: COLORS.HL_GRAY }}>Price</StyledText>
                    <StyledText numberOfLines={1}>{item.limitPx}</StyledText>
                </View>

                <View style={{ flex: 1 }}>
                    <StyledText style={{ fontSize: 12, color: COLORS.HL_GRAY }}>Trigger Conditions</StyledText>
                    <StyledText numberOfLines={1}>{item.triggerCondition ?? "N/A"}</StyledText>
                </View>
            </View>

            {/* Thirds row */}
            <View style={{ flexDirection: 'row', justifyContent: "space-between", marginBottom: 10 }}>
                <View style={{ flex: 1 }}>
                    <StyledText style={{ fontSize: 12, color: COLORS.HL_GRAY }}>Size</StyledText>
                    <StyledText numberOfLines={1}>{item.origSz}</StyledText>
                </View>

                <View style={{ flex: 1 }}>
                    <StyledText style={{ fontSize: 12, color: COLORS.HL_GRAY }}>Filled size</StyledText>
                    <StyledText numberOfLines={1}>??</StyledText>
                </View>

                <View style={{ flex: 1 }}>
                    <StyledText style={{ fontSize: 12, color: COLORS.HL_GRAY }}>TP/SL</StyledText>
                    <StyledText numberOfLines={1}>??</StyledText>
                </View>
            </View>

            {/* Fourth row */}
            <View style={{ alignItems: 'flex-end' }}>
                <TouchableOpacity style={{ marginRight: 10 }} onPress={onPressCancel}>
                    <StyledText style={{ fontSize: 12, color: COLORS.HL_GREEN }}>Cancel</StyledText>
                </TouchableOpacity>
            </View>
        </View>
    )
})