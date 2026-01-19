import { COLORS } from "@/src/constants/colors";
import { formatDate } from "@/src/helpers/date";
import OrderHistoryModel from "@/src/models/order-history-model";
import { TouchableOpacity, View } from "react-native";
import StyledText from "../styled-text";

const OrderHistoryListView = ({item}: {item: OrderHistoryModel}) => {
    console.log("OpenOrdersView item = ", item)

    const orderColor = item.order.side == "A" ? COLORS.HL_RED : COLORS.HL_GREEN
    const direction = item.order.side == "A" ? "Short" : "Long"

    const date = formatDate({timestamp: item.order.timestamp})

    return(
        <View style={{backgroundColor: COLORS.HL_BG1, borderColor: COLORS.HL_BORDER, borderWidth: 1, borderRadius: 6, marginBottom: 5, marginHorizontal: 5, padding: 10}}>

            {/* First row */}
            <View style={{flexDirection: 'row', justifyContent: "space-between", marginBottom: 10}}>
                <TouchableOpacity style={{flex: 1}}>
                    <StyledText style={{fontSize: 12, color: COLORS.HL_GRAY}}>Coin</StyledText>
                    <StyledText style={{color: orderColor, fontWeight: 'bold'}} numberOfLines={1}>{item.order.coin}</StyledText>
                </TouchableOpacity>

                <View style={{flex: 1}}>
                    <StyledText style={{fontSize: 12, color: COLORS.HL_GRAY}}>Time</StyledText>
                    <StyledText numberOfLines={2}>{date}</StyledText>
                </View>

                <View style={{flex: 1}}>
                    <StyledText style={{fontSize: 12, color: COLORS.HL_GRAY}}>Type</StyledText>
                    <StyledText numberOfLines={1}>{item.order.orderType}</StyledText>
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
                    <StyledText numberOfLines={1}>{item.order.limitPx}</StyledText>
                </View>

                <View style={{flex: 1}}>
                    <StyledText style={{fontSize: 12, color: COLORS.HL_GRAY}}>Trigger Conditions</StyledText>
                    <StyledText numberOfLines={1}>{item.order.triggerCondition ?? "N/A"}</StyledText>
                </View>
            </View>

            {/* Thirds row */}
            <View style={{flexDirection: 'row', justifyContent: "space-between", marginBottom: 10}}>
                <View style={{flex: 1}}>
                    <StyledText style={{fontSize: 12, color: COLORS.HL_GRAY}}>Size</StyledText>
                    <StyledText numberOfLines={1}>{item.order.sz}</StyledText>
                </View>

                <View style={{flex: 1}}>
                    <StyledText style={{fontSize: 12, color: COLORS.HL_GRAY}}>Filled size</StyledText>
                    <StyledText numberOfLines={1}>{item.order.origSz}</StyledText>
                </View>

                <View style={{flex: 1}}>
                    <StyledText style={{fontSize: 12, color: COLORS.HL_GRAY}}>TP/SL</StyledText>
                    <StyledText numberOfLines={1}>??</StyledText>
                </View>
            </View>

            {/* Fourth row */}
            <View style={{flex: 1}}>
                    <StyledText style={{fontSize: 12, color: COLORS.HL_GRAY}}>Status</StyledText>
                    <StyledText numberOfLines={1}>{item.status}</StyledText>
                </View>
        </View>
    )
}

export default OrderHistoryListView