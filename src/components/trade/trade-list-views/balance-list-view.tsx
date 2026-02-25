import { COLORS } from "@/src/constants/colors"
import BalanceModel from "@/src/models/balance-model"
import { useAppSelector } from "@/src/store/store"
import { memo } from "react"
import { FlatList, View } from "react-native"
import StyledText from "../../styled-text"

const BalancesListView = memo(() => {
    console.log("BalancesListView render")

    const balances = useAppSelector((state) => state.trade.balances)
    
    if (balances.length == 0) {
        return <View style={{ marginLeft: 10 }}><StyledText>No balances yet</StyledText></View>
    }
    
    return (
        <View>
            <FlatList
                id='balances_list_id'
                scrollEnabled={false}
                showsHorizontalScrollIndicator={true}
                data={balances}
                renderItem={({ item }) => (
                    <BalanceListItemView
                        item={item}
                        onSend={() => console.log("send = ", item)}
                        onTransfer={() => console.log("transfer = ", item)}
                    />
                )}
            />
        </View>
    )
})

export default BalancesListView


// MARK: - Balance Item

const BalanceListItemView = memo(({ item, onSend, onTransfer }: { item: BalanceModel, onSend: () => void, onTransfer: () => void }) => {
    // console.log("BalanceListItemView render. item = ", item)

    return (
        <View style={{ backgroundColor: COLORS.HL_BG1, borderColor: COLORS.HL_BORDER, borderWidth: 1, borderRadius: 6, marginBottom: 5, marginHorizontal: 5, padding: 10 }}>
            <View style={{ flexDirection: 'row', justifyContent: "space-between", marginBottom: 10 }}>
                <View style={{ flex: 1 }}>
                    <StyledText style={{ fontSize: 12, color: COLORS.HL_GRAY }}>Coin</StyledText>
                    <StyledText numberOfLines={1}>{item.coin}({item.isPerps ? "Perps" : "Spot"})</StyledText>
                </View>

                <View style={{ flex: 1 }}>
                    <StyledText style={{ fontSize: 12, color: COLORS.HL_GRAY }}>USDC Value</StyledText>
                    <StyledText numberOfLines={1}>${item.usdcValue}</StyledText>
                </View>

                <View style={{ flex: 1 }}>
                    <StyledText style={{ fontSize: 12, color: COLORS.HL_GRAY }}>Available Balance</StyledText>
                    <StyledText numberOfLines={1}>{item.availableBalance} USDC</StyledText>
                </View>
            </View>

            <View>
                <StyledText style={{ fontSize: 12, color: COLORS.HL_GRAY }}>Total Balance</StyledText>
                <StyledText numberOfLines={1}>{item.totalBalance} USDC</StyledText>
            </View>

            {/* <View style={{flexDirection: 'row', justifyContent: "flex-end", gap: 20}}>
                <TouchableOpacity onPress={onSend}>
                    <StyledText style={{fontSize: 12, color: COLORS.HL_GREEN}}>Send</StyledText>
                </TouchableOpacity>

                <TouchableOpacity onPress={onTransfer}>
                    <StyledText style={{fontSize: 12, color: COLORS.HL_GREEN}}>Transfer to {item.isPerps ? "Spot" : "Perps" }</StyledText>
                </TouchableOpacity>
            </View> */}
        </View>
    )
})