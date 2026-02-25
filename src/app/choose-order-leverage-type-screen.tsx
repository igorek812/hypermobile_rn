import { router } from "expo-router"
import { useState } from "react"
import { ActivityIndicator, Alert, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Hex } from "viem"
import StyledText from "../components/styled-text"
import { COLORS } from "../constants/colors"
import Errors from "../constants/errors"
import { useGlobalContext } from "../context/global-provider"
import { ActiveAssetLeverageModel } from "../models/active-asset-leverage-model"
import { AssetLeverageMarginTypeModel } from "../models/asset-leverage-margin-type-model"
import hlService from "../services/hl-service"
import { useAppSelector } from "../store/store"

const ChooseOrderLeverageTypeScreen = () => {
    const { agentWallet } = useGlobalContext()
    const activeAssetLeverageData = useAppSelector(state => state.trade.activeAssetLeverageData)
    const selectedAssetName = useAppSelector(state => state.trade.selectedAssetName)

    const [updatedLeverageData, setUpdatedLeverageData] = useState<ActiveAssetLeverageModel | null>(activeAssetLeverageData)
    const [isLoading, setIsLoading] = useState(false)


    // MARK: - Handlers

    async function onConfirmAction() {
        try {

            if (agentWallet == null) {
                throw new Error(Errors.AGENT_WALLET_NOT_INIT)
            }
            if (selectedAssetName == null) {
                throw new Error(Errors.SELECTED_ASSET_NOT_INIT)
            }
            if (activeAssetLeverageData == null) {
                throw new Error(Errors.ASSET_LEVERAGE_DATA_NOT_INIT)
            }
            if (updatedLeverageData == null) {
                throw new Error("Not data for update")
            }

            setIsLoading(true)

            const result = await hlService.updateAssetLeverageValueData({
                privateKey: agentWallet.key as Hex,
                coin: selectedAssetName,
                marginType: updatedLeverageData.marginType,
                leverageValue: updatedLeverageData.value
            })
            console.log("updateAssetLeverageMarginTypeData result = ", result)

            if (result.status == "ok") {
                Alert.alert("Success", '', [{
                    text: "OK",
                    onPress: () => router.dismiss(),
                }])
            } else {
                Alert.alert(`Error. result = ${JSON.stringify(result)}`)
            }
        } catch (error) {
            console.log(error)
            alert(error)
        } finally {
            setIsLoading(false)
        }
    }


    // MARK: - UI

    if (selectedAssetName == null) {
        return (
            <View style={{ margin: 20, alignItems: 'center' }}>
                <StyledText>Leverage data error. Selected asset name is null</StyledText>
            </View>
        )
    }

    if (updatedLeverageData == null) {
        return (
            <View style={{ margin: 20, alignItems: 'center' }}>
                <StyledText>Leverage data error. Selected asset name = {selectedAssetName}. asset info = {JSON.stringify(selectedAssetInfo)}. updatedLeverageData is null</StyledText>
            </View>
        )
    }

    return (
        <SafeAreaView edges={['top', 'bottom']} style={{flex: 1}}>
            <View style={{ margin: 16, gap: 12 }}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <StyledText style={{ fontSize: 17, fontWeight: 'bold' }}>{selectedAssetName}-USD Margin Mode</StyledText>
                    <TouchableOpacity onPress={() => router.dismiss()}>
                        <StyledText style={{ fontSize: 17, fontWeight: 'bold' }}>X</StyledText>
                    </TouchableOpacity>
                </View>

                <SelectableView
                    title="Cross"
                    description="All cross positions share the same cross margin as collateral. In the event of liquidation, your cross margin balance and any remaining open positions under assets in this mode may be forfeited."
                    isSelected={updatedLeverageData.marginType == AssetLeverageMarginTypeModel.CROSS}
                    onPress={() => { setUpdatedLeverageData({ ...updatedLeverageData, marginType: AssetLeverageMarginTypeModel.CROSS }) }}
                />

                <SelectableView
                    title="Isolated"
                    description="Manage your risk on individual positions by restricting the amount of margin allocated to each. If the margin ratio of an isolated position reaches 100%, the position will be liquidated. Margin can be added or removed to individual positions in this mode."
                    isSelected={updatedLeverageData.marginType == AssetLeverageMarginTypeModel.ISOLATED}
                    onPress={() => { setUpdatedLeverageData({ ...updatedLeverageData, marginType: AssetLeverageMarginTypeModel.ISOLATED }) }}
                />

                {isLoading
                    ? <ActivityIndicator color={COLORS.PRIMARY_TEXT} />
                    :
                    <TouchableOpacity
                        disabled={isLoading}
                        style={{ borderRadius: 6, backgroundColor: COLORS.HL_GREEN, justifyContent: 'center', alignItems: 'center', height: 40 }}
                        onPress={onConfirmAction}
                    >
                        <StyledText style={{ color: COLORS.HL_TEXT_SECOND }}>Confirm</StyledText>
                    </TouchableOpacity>

                }
            </View>
        </SafeAreaView>
    )
}

export default ChooseOrderLeverageTypeScreen

const SelectableView = ({ title, description, isSelected, onPress }: { title: string, description: string, isSelected: boolean, onPress: () => void }) => {
    return (
        <TouchableOpacity
            style={{ padding: 10, borderWidth: 1, borderRadius: 6, borderColor: isSelected ? COLORS.HL_GREEN : COLORS.HL_BORDER, gap: 6 }}
            onPress={onPress}
        >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <View style={{ height: 16, width: 16, borderWidth: 1, borderColor: isSelected ? COLORS.HL_GREEN : COLORS.HL_GRAY, borderRadius: 3 }}>
                    {isSelected && <View style={{ backgroundColor: COLORS.HL_GREEN, flex: 1, margin: 2 }} />}
                </View>
                <StyledText style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.PRIMARY_TEXT }}>{title}</StyledText>
            </View>
            <StyledText style={{ color: COLORS.HL_GRAY }}>{description}</StyledText>
        </TouchableOpacity>
    )
}