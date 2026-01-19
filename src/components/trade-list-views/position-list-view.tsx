import { COLORS } from "@/src/constants/colors"
import AssetPositionModel from "@/src/models/asset-position-model"
import { TouchableOpacity, View } from "react-native"
import StyledText from "../styled-text"

const PositionListView = ({item}: {item: AssetPositionModel}) => {
    console.log("PositionListView item = ", item)

    const positionColor = Number(item.position.szi) > 0 ? COLORS.HL_GREEN : COLORS.HL_RED

    // const roe = String(format: "%.2f", (Double(cellModel.position.returnOnEquity) ?? 0)*100)
    const roe = Number(item.position.returnOnEquity)*100
    const pnl = item.position.unrealizedPnl//.toDouble().formatToHlStyle()

    const fundingValue = Number(item.position.cumFunding.allTime)
    const fundingColor = fundingValue > 0 ? COLORS.HL_RED : COLORS.HL_GREEN
    const sign = fundingValue > 0 ? "-" : ""

    return(
        <View style={{backgroundColor: COLORS.HL_BG1, borderColor: COLORS.HL_BORDER, borderWidth: 1, borderRadius: 6, marginBottom: 5, marginHorizontal: 5, padding: 10}}>

            {/* First row */}
            <View style={{flexDirection: 'row', justifyContent: "space-between", marginBottom: 10}}>
                <TouchableOpacity style={{flex: 1}}>
                    <StyledText style={{fontSize: 12, color: COLORS.HL_GRAY}}>Coin</StyledText>
                    <StyledText style={{color: positionColor, fontWeight: 'bold'}} numberOfLines={1}>{item.position.coin} {item.position.leverage.value}x</StyledText>
                </TouchableOpacity>

                <View style={{flex: 1}}>
                    <StyledText style={{fontSize: 12, color: COLORS.HL_GRAY}}>Size</StyledText>
                    <StyledText numberOfLines={1}>${item.position.szi.replace("-", "")} {item.position.coin}</StyledText>
                </View>

                <TouchableOpacity style={{flex: 1}}>
                    <StyledText style={{fontSize: 12, color: COLORS.HL_GRAY}}>PNL (ROE %)</StyledText>
                    <StyledText numberOfLines={1}>${pnl} ({roe}%)</StyledText>
                </TouchableOpacity>
            </View>

            {/* Second row */}
            <View style={{flexDirection: 'row', marginBottom: 10}}>
                <View style={{flex: 1}}>
                    <StyledText style={{fontSize: 12, color: COLORS.HL_GRAY}}>Enry Price</StyledText>
                    <StyledText numberOfLines={1}>{item.position.entryPx}</StyledText>
                </View>

                <View style={{flex: 1}}>
                    <StyledText style={{fontSize: 12, color: COLORS.HL_GRAY}}>Mark Price</StyledText>
                    <StyledText numberOfLines={1}>{item.position.markPx != null ? item.position.markPx :  "-"}</StyledText>
                </View>

                <View style={{flex: 1}}>
                    <StyledText style={{fontSize: 12, color: COLORS.HL_GRAY}}>Liq. Price</StyledText>
                    <StyledText numberOfLines={1}>{item.position.liquidationPx ?? "N/A"}</StyledText>
                </View>
            </View>

            {/* Thirds row */}
            <View style={{flexDirection: 'row', justifyContent: "space-between", marginBottom: 10}}>
                <View style={{flex: 1}}>
                    <StyledText style={{fontSize: 12, color: COLORS.HL_GRAY}}>Position Value</StyledText>
                    <StyledText numberOfLines={1}>{item.position.positionValue} USDC</StyledText>
                </View>

                <View style={{flex: 1}}>
                    <StyledText style={{fontSize: 12, color: COLORS.HL_GRAY}}>Margin</StyledText>
                    <StyledText numberOfLines={1}>${item.position.marginUsed} {item.position.leverage.type.charAt(0).toUpperCase() + item.position.leverage.type.slice(1)}</StyledText>
                </View>

                <View style={{flex: 1}}>
                    <StyledText style={{fontSize: 12, color: COLORS.HL_GRAY}}>TP/SL</StyledText>
                    <StyledText numberOfLines={1}>??</StyledText>
                </View>
            </View>

            {/* Fourth row */}
            <View style={{marginBottom: 10}}>
                <StyledText style={{fontSize: 12, color: COLORS.HL_GRAY}}>Funding</StyledText>
                <StyledText style={{color: fundingColor}} numberOfLines={1}>{sign}{fundingValue}</StyledText>
            </View>

            {/* Fifth row */}
            <View style={{flexDirection: 'row', justifyContent: "flex-end", gap: 20}}>
                <TouchableOpacity>
                    <StyledText style={{fontSize: 12, color: COLORS.HL_GREEN}}>Limit Close</StyledText>
                </TouchableOpacity>

                <TouchableOpacity>
                    <StyledText style={{fontSize: 12, color: COLORS.HL_GREEN}}>Market Close</StyledText>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default PositionListView