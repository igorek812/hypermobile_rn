import { COLORS } from "@/src/constants/colors"
import { formatDate } from "@/src/helpers/date"
import OpenOrdersModel from "@/src/models/open-orders-model"
import { TouchableOpacity, View } from "react-native"
import StyledText from "../styled-text"

const OpenOrdersListView = ({item, onCancel}: {item: OpenOrdersModel, onCancel: () => void}) => {
    // console.log("OpenOrdersView item = ", item)

    const orderColor = item.side == "A" ? COLORS.HL_RED : COLORS.HL_GREEN
    const direction = item.side == "A" ? "Short" : "Long"

    const date = formatDate({timestamp: item.timestamp})

    return(
        <View style={{backgroundColor: COLORS.HL_BG1, borderColor: COLORS.HL_BORDER, borderWidth: 1, borderRadius: 6, marginBottom: 5, marginHorizontal: 5, padding: 10}}>

            {/* First row */}
            <View style={{flexDirection: 'row', justifyContent: "space-between", marginBottom: 10}}>
                <TouchableOpacity style={{flex: 1}}>
                    <StyledText style={{fontSize: 12, color: COLORS.HL_GRAY}}>Coin</StyledText>
                    <StyledText style={{color: orderColor, fontWeight: 'bold'}} numberOfLines={1}>{item.coin}</StyledText>
                </TouchableOpacity>

                <View style={{flex: 1}}>
                    <StyledText style={{fontSize: 12, color: COLORS.HL_GRAY}}>Time</StyledText>
                    <StyledText numberOfLines={2}>{date}</StyledText>
                </View>

                <View style={{flex: 1}}>
                    <StyledText style={{fontSize: 12, color: COLORS.HL_GRAY}}>Type</StyledText>
                    <StyledText numberOfLines={1}>{item.orderType}</StyledText>
                </View>
            </View>

            {/* Second row */}
            <View style={{flexDirection: 'row', marginBottom: 10}}>
                <View style={{flex: 1}}>
                    <StyledText style={{fontSize: 12, color: COLORS.HL_GRAY}}>Direction</StyledText>
                    <StyledText numberOfLines={1}>{direction}</StyledText>
                </View>

                <View style={{flex: 1}}>
                    <StyledText style={{fontSize: 12, color: COLORS.HL_GRAY}}>Price</StyledText>
                    <StyledText numberOfLines={1}>{item.limitPx}</StyledText>
                </View>

                <View style={{flex: 1}}>
                    <StyledText style={{fontSize: 12, color: COLORS.HL_GRAY}}>Trigger Conditions</StyledText>
                    <StyledText numberOfLines={1}>{item.triggerCondition ?? "N/A"}</StyledText>
                </View>
            </View>

            {/* Thirds row */}
            <View style={{flexDirection: 'row', justifyContent: "space-between", marginBottom: 10}}>
                <View style={{flex: 1}}>
                    <StyledText style={{fontSize: 12, color: COLORS.HL_GRAY}}>Size</StyledText>
                    <StyledText numberOfLines={1}>{item.origSz}</StyledText>
                </View>

                <View style={{flex: 1}}>
                    <StyledText style={{fontSize: 12, color: COLORS.HL_GRAY}}>Filled size</StyledText>
                    <StyledText numberOfLines={1}>{item.sz}</StyledText>
                </View>

                <View style={{flex: 1}}>
                    <StyledText style={{fontSize: 12, color: COLORS.HL_GRAY}}>TP/SL</StyledText>
                    <StyledText numberOfLines={1}>??</StyledText>
                </View>
            </View>

            {/* Fourth row */}
            <View style={{alignItems: 'flex-end'}}>
                <TouchableOpacity style={{marginRight: 10}} onPress={onCancel}>
                <StyledText style={{fontSize: 12, color: COLORS.HL_GREEN}}>Cancel</StyledText>
            </TouchableOpacity>
            </View>
        </View>
    )
}

export default OpenOrdersListView