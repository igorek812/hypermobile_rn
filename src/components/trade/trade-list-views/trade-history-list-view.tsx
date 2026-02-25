import { COLORS } from "@/src/constants/colors";
import { formatDate } from "@/src/helpers/date";
import TradeHistoryModel from "@/src/models/trade-history-model";
import { tradeSliceActions } from "@/src/services/trade-redux";
import { useAppSelector } from "@/src/store/store";
import { memo } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import { useDispatch } from "react-redux";
import StyledText from "../../styled-text";

const TradeHistoryListView = memo(() => {
    console.log("TradeHistoryListView render")

    const tradeHistory = useAppSelector((state) => state.trade.tradeHistory)
    const dispatcher = useDispatch()
    
    const onPressAsset = (coinName: string) => {
        console.log(coinName)
        dispatcher(tradeSliceActions.setSelectedAssetName(coinName))
    }

    if (tradeHistory.length == 0) {
        return <View style={{ marginLeft: 10 }}><StyledText>No trade history yet</StyledText></View>
    }

    return (
        <View>
            <FlatList
                id='trade_history_list_id'
                scrollEnabled={false}
                showsHorizontalScrollIndicator={true}
                data={tradeHistory.slice().reverse()}
                renderItem={({ item }) => (<TradeHistoryListItemView item={item} onPressAsset={() => onPressAsset(item.coin)} />)}
            />
        </View>
    )
})

export default TradeHistoryListView


// MARK: - Item

const TradeHistoryListItemView = memo(({ item, onPressAsset }: { item: TradeHistoryModel, onPressAsset: () => void }) => {
    console.log("TradeHistoryListItemView render. item = ", item)

    const orderColor = item.side == "A" ? COLORS.HL_RED : COLORS.HL_GREEN
    const date = formatDate({ timestamp: item.time })

    return (
        <View style={{ backgroundColor: COLORS.HL_BG1, borderColor: COLORS.HL_BORDER, borderWidth: 1, borderRadius: 6, marginBottom: 5, marginHorizontal: 5, padding: 10 }}>

            {/* First row */}
            <View style={{ flexDirection: 'row', justifyContent: "space-between", marginBottom: 10 }}>
                <TouchableOpacity style={{ flex: 1 }} onPress={onPressAsset}>
                    <StyledText style={{ fontSize: 12, color: COLORS.HL_GRAY }}>Coin</StyledText>
                    <StyledText style={{ color: orderColor, fontWeight: 'bold' }} numberOfLines={1}>{item.coin}</StyledText>
                </TouchableOpacity>

                <View style={{ flex: 1 }}>
                    <StyledText style={{ fontSize: 12, color: COLORS.HL_GRAY }}>Direction</StyledText>
                    <StyledText style={{ color: orderColor }} numberOfLines={1}>{item.dir}</StyledText>
                </View>

                <View style={{ flex: 1 }}>
                    <StyledText style={{ fontSize: 12, color: COLORS.HL_GRAY }}>Price</StyledText>
                    <StyledText numberOfLines={1}>{item.px}</StyledText>
                </View>
            </View>

            {/* Second row */}
            <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                <View style={{ flex: 1 }}>
                    <StyledText style={{ fontSize: 12, color: COLORS.HL_GRAY }}>Time</StyledText>
                    <StyledText numberOfLines={2}>{date}</StyledText>
                </View>

                <View style={{ flex: 1 }}>
                    <StyledText style={{ fontSize: 12, color: COLORS.HL_GRAY }}>Size</StyledText>
                    <StyledText numberOfLines={1}>{item.sz} {item.coin}</StyledText>
                </View>

                <View style={{ flex: 1 }}>
                    <StyledText style={{ fontSize: 12, color: COLORS.HL_GRAY }}>Trade Value</StyledText>
                    <StyledText numberOfLines={1}>{Number(item.px) * Number(item.sz)} USDC</StyledText>
                </View>
            </View>

            {/* Thirds row */}
            <View style={{ flexDirection: 'row', justifyContent: "space-between", marginBottom: 10 }}>
                <TouchableOpacity style={{ flex: 1 }}>
                    <StyledText style={{ fontSize: 12, color: COLORS.HL_GRAY }}>Closed PNL</StyledText>
                    <StyledText numberOfLines={1}>{item.closedPnl} USDC</StyledText>
                </TouchableOpacity>

                <View style={{ flex: 1 }}>
                    <StyledText style={{ fontSize: 12, color: COLORS.HL_GRAY }}>Fee</StyledText>
                    <StyledText numberOfLines={1}>{item.fee} {item.feeToken}</StyledText>
                </View>

                <View style={{ flex: 1 }}>
                </View>
            </View>
        </View>
    )
})