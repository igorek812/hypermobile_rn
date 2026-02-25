import { percentChangePriceAndPrice1d } from "@/src/app/choose-trade-pair-screen"
import { COLORS } from "@/src/constants/colors"
import { useAppSelector } from "@/src/store/store"
import AntDesign from '@expo/vector-icons/AntDesign'
import { router } from "expo-router"
import { memo } from "react"
import { TouchableOpacity, View } from "react-native"
import StyledText from "../styled-text"

const SelectedAssetView = memo(() => {
    console.log("SelectedAssetView render")

    const selectedAssetName = useAppSelector((state) => state.trade.selectedAssetName)
    const selectedAssetInfo = useAppSelector((state) => state.trade.selectedAssetInfo)

    console.log("selectedAssetInfo = ", selectedAssetInfo)

    const funding: number | null = selectedAssetInfo != null ? Number(selectedAssetInfo.funding) : null

    return (
        <View style={{ padding: 10 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity onPress={() => {
                    router.navigate('/choose-trade-pair-screen')
                }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 3 }}>
                        <StyledText style={{ fontSize: 19, fontWeight: "bold" }}>{selectedAssetName == null ? "-" : `${selectedAssetName}-USDC`}</StyledText>
                        <AntDesign name="arrow-down" size={16} color={COLORS.PRIMARY_TEXT} style={{ paddingTop: 3 }} />
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <StyledText style={{ backgroundColor: COLORS.HL_GREEN1, paddingHorizontal: 3, borderRadius: 3, }}>{selectedAssetInfo == null ? 0 : selectedAssetInfo.maxLeverage}x</StyledText>
                    </View>
                </TouchableOpacity>

                <View>
                    <StyledText style={{ fontSize: 19, fontWeight: "bold" }}>{selectedAssetInfo == null ? 0 : selectedAssetInfo.markPx}</StyledText>
                    {selectedAssetInfo ?
                        percentChangePriceAndPrice1d({ markPx: selectedAssetInfo.markPx, prevDayPx: selectedAssetInfo.prevDayPx })
                        : <StyledText style={{ fontSize: 12 }}>-/-</StyledText>
                    }
                </View>
            </View>

            {/* <View>
                <View style={{ flexDirection: 'row', marginBottom: 12, marginLeft: 12 }}>
                    <View>
                        <StyledText style={{ color: COLORS.HL_GRAY }}>Mark / Oracle</StyledText>
                        {selectedAssetInfo
                            ? <StyledText>{selectedAssetInfo.markPx} / {selectedAssetInfo.oraclePx}</StyledText>
                            : <StyledText>Loading..</StyledText>
                        }

                    </View>

                    <View>
                        <StyledText style={{ color: COLORS.HL_GRAY }}>24H Volume</StyledText>
                        {selectedAssetInfo
                            ? <StyledText>${selectedAssetInfo.dayVlm}</StyledText>
                            : <StyledText>Loading..</StyledText>
                        }

                    </View>

                </View>

                <View style={{ flexDirection: 'row', marginLeft: 12 }}>
                    <View style={{ flex: 1 }}>
                        <StyledText style={{ color: COLORS.HL_GRAY }}>Open Interest</StyledText>
                        {selectedAssetInfo
                            ? <StyledText>${selectedAssetInfo.oi}</StyledText>
                            : <StyledText>Loading..</StyledText>
                        }

                    </View>

                    <View style={{ flex: 1 }}>
                        <StyledText style={{ color: COLORS.HL_GRAY }}>Funding</StyledText>
                        {funding
                            ? <StyledText style={{ color: funding > 0 ? COLORS.HL_GREEN : COLORS.HL_RED }}>{funding * 100}%</StyledText>
                            : <StyledText>Loading..</StyledText>
                        }

                    </View>
                </View>
            </View> */}
        </View>
    )
})

export default SelectedAssetView
