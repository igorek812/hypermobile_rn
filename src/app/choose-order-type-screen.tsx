import { router } from "expo-router"
import { useState } from "react"
import { TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import StyledText from "../components/styled-text"
import { COLORS } from "../constants/colors"
import { OrderTypeModel } from "../models/order-type-model"
import { tradeSliceActions } from "../services/trade-redux"
import store, { useAppDispatch } from "../store/store"

const ChooseOrderTypeScreen = () => {

    const [updatedOrderType, setUpdatedOrderType] = useState<OrderTypeModel>(store.getState().trade.orderType)
    const appDispatch = useAppDispatch()

    function onConfirmAction() {
        appDispatch(tradeSliceActions.setOrderType(updatedOrderType))
        router.dismiss()
    }

    return (
        <SafeAreaView edges={['top', 'bottom']} style={{flex: 1}}>
            <View style={{ margin: 16, gap: 12 }}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <StyledText style={{ fontSize: 17, fontWeight: 'bold' }}>Choose order type</StyledText>
                    <TouchableOpacity onPress={() => router.dismiss()}>
                        <StyledText style={{ fontSize: 17, fontWeight: 'bold' }}>X</StyledText>
                    </TouchableOpacity>
                </View>

                <SelectableView
                    title={OrderTypeModel.LIMIT}
                    //description="All cross positions share the same cross margin as collateral. In the event of liquidation, your cross margin balance and any remaining open positions under assets in this mode may be forfeited."
                    isSelected={updatedOrderType == OrderTypeModel.LIMIT}
                    onPress={() => { setUpdatedOrderType(OrderTypeModel.LIMIT) }}
                />

                <SelectableView
                    title={OrderTypeModel.MARKET}
                    // description="Manage your risk on individual positions by restricting the amount of margin allocated to each. If the margin ratio of an isolated position reaches 100%, the position will be liquidated. Margin can be added or removed to individual positions in this mode."
                    isSelected={updatedOrderType == OrderTypeModel.MARKET}
                    onPress={() => { setUpdatedOrderType(OrderTypeModel.MARKET) }}
                />

                <TouchableOpacity
                    style={{ borderRadius: 6, backgroundColor: COLORS.HL_GREEN, justifyContent: 'center', alignItems: 'center', height: 40 }}
                    onPress={onConfirmAction}
                >
                    <StyledText style={{ color: COLORS.HL_TEXT_SECOND }}>Confirm</StyledText>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default ChooseOrderTypeScreen

const SelectableView = ({ title, description, isSelected, onPress }: { title: string, description?: string | null, isSelected: boolean, onPress: () => void }) => {
    return (
        <TouchableOpacity
            style={{ padding: 15, borderWidth: 1, borderRadius: 6, borderColor: isSelected ? COLORS.HL_GREEN : COLORS.HL_BORDER, gap: 6 }}
            onPress={onPress}
        >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <View style={{ height: 16, width: 16, borderWidth: 1, borderColor: isSelected ? COLORS.HL_GREEN : COLORS.HL_GRAY, borderRadius: 3 }}>
                    {isSelected && <View style={{ backgroundColor: COLORS.HL_GREEN, flex: 1, margin: 2 }} />}
                </View>
                <StyledText style={{ fontSize: 15, color: COLORS.PRIMARY_TEXT }}>{title}</StyledText>
            </View>
            {description && <StyledText style={{ color: COLORS.HL_GRAY }}>{description}</StyledText>}
        </TouchableOpacity>
    )
}