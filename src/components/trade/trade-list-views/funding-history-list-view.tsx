import { COLORS } from "@/src/constants/colors";
import { formatDate } from "@/src/helpers/date";
import FundingHistoryModel from "@/src/models/funding-history-model";
import { tradeSliceActions } from "@/src/services/trade-redux";
import { useAppSelector } from "@/src/store/store";
import { memo } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import { useDispatch } from "react-redux";
import StyledText from "../../styled-text";


const FundingHistoryListView = memo(() => {
    console.log("FundingHistoryListView render")

    const fundingHistory = useAppSelector((state) => state.trade.fundingHistory)
    const dispatcher = useDispatch()

    const onPressAsset = (coinName: string) => {
        console.log(coinName)
        dispatcher(tradeSliceActions.setSelectedAssetName(coinName))
    }

    if (fundingHistory.length == 0) {
        return <View style={{ marginLeft: 10 }}><StyledText>No funding history yet</StyledText></View>
    }
    return (
        <View>
            <FlatList
                id='funding_history_list_id'
                scrollEnabled={false}
                showsHorizontalScrollIndicator={true}
                data={fundingHistory.slice().reverse()}
                renderItem={({ item }) => (<FundingHistoryListItemView item={item} onPressAsset={() => onPressAsset(item.coin)} />)}
            />
        </View>
    )
})

export default FundingHistoryListView


// MARK: - Item

const FundingHistoryListItemView = memo(({ item, onPressAsset }: { item: FundingHistoryModel, onPressAsset: () => void }) => {
    // console.log("FundingHistoryListItemView render. item = ", item)
    
    const orderColor = Number(item.szi) > 0 ? COLORS.HL_GREEN : COLORS.HL_RED
    const positionSide = Number(item.szi) > 0 ? "Long" : "Short"
    const isIncome = Number(item.usdc) > 0

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
                    <StyledText style={{ fontSize: 12, color: COLORS.HL_GRAY }}>Time</StyledText>
                    <StyledText numberOfLines={2}>{date}</StyledText>
                </View>

                <View style={{ flex: 1 }}>
                    <StyledText style={{ fontSize: 12, color: COLORS.HL_GRAY }}>Size</StyledText>
                    <StyledText numberOfLines={1}>{item.szi} {item.coin}</StyledText>
                </View>
            </View>

            {/* Second row */}
            <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                <View style={{ flex: 1 }}>
                    <StyledText style={{ fontSize: 12, color: COLORS.HL_GRAY }}>Position Side</StyledText>
                    <StyledText style={{ color: orderColor }} numberOfLines={1}>{positionSide}</StyledText>
                </View>

                <View style={{ flex: 1 }}>
                    <StyledText style={{ fontSize: 12, color: COLORS.HL_GRAY }}>Payment</StyledText>
                    <StyledText style={{ color: isIncome ? COLORS.HL_GREEN : COLORS.HL_RED }} numberOfLines={1}>${isIncome ? "" : "-"}{item.usdc.replace("-", "")}</StyledText>
                </View>

                <View style={{ flex: 1 }}>
                    <StyledText style={{ fontSize: 12, color: COLORS.HL_GRAY }}>Rate</StyledText>
                    <StyledText numberOfLines={1}>{item.fundingRate}%</StyledText>
                </View>
            </View>
        </View>
    )
})