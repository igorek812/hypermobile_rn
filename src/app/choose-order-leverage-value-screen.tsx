import Slider from '@react-native-community/slider'
import { router } from "expo-router"
import { useState } from "react"
import { ActivityIndicator, Alert, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from 'react-native-safe-area-context'
import { Hex } from "viem"
import StyledText from "../components/styled-text"
import { COLORS } from "../constants/colors"
import Errors from '../constants/errors'
import { useGlobalContext } from '../context/global-provider'
import { ActiveAssetLeverageModel } from '../models/active-asset-leverage-model'
import hlService from "../services/hl-service"
import { useAppSelector } from "../store/store"

const ChooseOrderLeverageValueScreen = () => {
    const { agentWallet } = useGlobalContext()
    const activeAssetLeverageData = useAppSelector(state => state.trade.activeAssetLeverageData)
    const selectedAssetName = useAppSelector(state => state.trade.selectedAssetName)
    const selectedAssetInfo = useAppSelector(state => state.trade.selectedAssetInfo)

    const [updatedLeverageData, setUpdatedLeverageData] = useState<ActiveAssetLeverageModel | null>(activeAssetLeverageData)
    const [isLoading, setIsLoading] = useState(false)


    // MARK: - Handlers

    const onSliderAction = (value: number) => {
        if (updatedLeverageData == null) {
            alert('updated Leverage Data is null')
            return
        }
        setUpdatedLeverageData({ ...updatedLeverageData, value: value })
    }


    // MARK: - Functions

    async function onConfirmAction() {
        try {
            if (agentWallet == null) {
                throw new Error(Errors.AGENT_WALLET_NOT_INIT)
            }
            if (selectedAssetName == null) {
                throw new Error(Errors.SELECTED_ASSET_NOT_INIT)
            }
            if (updatedLeverageData == null) {
                throw new Error(`leverage data is null`)
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

    if (selectedAssetInfo == null) {
        return (
            <View style={{ margin: 20, alignItems: 'center' }}>
                <StyledText>Leverage data error. Selected asset name = {selectedAssetName}. asset info is null</StyledText>
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
                    <StyledText style={{ fontSize: 17, fontWeight: 'bold' }}>Adjust Leverage</StyledText>
                    <TouchableOpacity onPress={() => router.dismiss()}>
                        <StyledText style={{ fontSize: 17, fontWeight: 'bold' }}>X</StyledText>
                    </TouchableOpacity>
                </View>

                <StyledText>Control the leverage used for {selectedAssetName} positions. The maximum leverage is {selectedAssetInfo.maxLeverage}x.</StyledText>

                <StyledText>Max position size decreases the higher your leverage.</StyledText>

                <View
                    style={{ flexDirection: 'row', gap: 10 }}
                >
                    <Slider
                        style={{ flex: 8 }}
                        minimumValue={1}
                        step={1}
                        onValueChange={onSliderAction}
                        value={updatedLeverageData.value}
                        maximumValue={selectedAssetInfo.maxLeverage}
                        minimumTrackTintColor={COLORS.HL_GREEN}
                        maximumTrackTintColor={COLORS.HL_GRAY}
                    />
                    <View
                        style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}
                    >
                        <StyledText
                            style={{ fontSize: 17, fontWeight: 'bold' }}
                        >{updatedLeverageData.value}x</StyledText>
                    </View>
                </View>


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

                <View
                    style={{
                        backgroundColor: COLORS.HL_RED_BG,
                        borderWidth: 1,
                        borderColor: COLORS.HL_RED,
                        padding: 10,
                        borderRadius: 6
                    }}
                >
                    <StyledText
                        style={{
                            color: COLORS.HL_RED
                        }}
                    >Note that setting a higher leverage increases the risk of liquidation.</StyledText>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default ChooseOrderLeverageValueScreen
