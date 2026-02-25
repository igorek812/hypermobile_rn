import StyledText from "@/src/components/styled-text";
import { AssetModel } from "@/src/models/asset-model";
import { tradeSliceActions } from "@/src/services/trade-redux";
import { useAppSelector } from "@/src/store/store";
import AntDesign from '@expo/vector-icons/AntDesign';
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import { COLORS } from "../constants/colors";
import { formatPrice, formatVolume } from "../helpers/numbers";

const ChooseTradePairScreen = () => {

    const [assets, setAssets] = useState<AssetModel[]>([])
    const [searchQ, setSearchQ] = useState('')
    const originalAssets = useAppSelector((state) => state.ws.assets)
    const dispatcher = useDispatch()

    useEffect(() => {
        updateAssets()
    }, [originalAssets])

    useEffect(() => {
        updateAssets()
    }, [searchQ])


    // MARK: - Handlers

    const onPressAsset = (item: AssetModel) => {
        console.log(item.name)
        dispatcher(tradeSliceActions.setSelectedAssetName(item.name))
        router.dismiss()
    }

    // MARK: - Functions
    function updateAssets() {

        const formattedSearchQ = searchQ.toLowerCase()
        let pairs: AssetModel[] = []

        if (formattedSearchQ.length > 0) {
            pairs = originalAssets.filter((e: AssetModel) => e.name.toLowerCase().includes(formattedSearchQ))
        } else {
            pairs = originalAssets
        }

        const sortedPairs = pairs.slice().sort((a: AssetModel, b: AssetModel) => (Number(a.dayNtlVlm) < Number(b.dayNtlVlm)) ? 1 : -1)
        setAssets(sortedPairs)
    }


    // MARK: - UI

    return (
        <SafeAreaView
            edges={['top', 'bottom']}
            style={{ flex: 1 }}
        >
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginVertical: 16,
                marginLeft: 10,
                marginRight: 16
            }}>
                <StyledText style={{ fontSize: 17, fontWeight: 'bold' }}>Choose trade pair</StyledText>
                <TouchableOpacity onPress={() => router.dismiss()}>
                    <StyledText style={{ fontSize: 17, fontWeight: 'bold' }}>X</StyledText>
                </TouchableOpacity>
            </View>

            <TextInput
                placeholder="Search"
                autoCorrect={false}
                // autoComplete={"off"}
                spellCheck={false}
                style={{
                    // height: 35,
                    borderWidth: 1,
                    borderRadius: 10,
                    marginHorizontal: 5,
                    borderColor: COLORS.HL_GRAY,
                    padding: 10,
                }}
                placeholderTextColor={COLORS.HL_GRAY}
                color={COLORS.PRIMARY_TEXT}
                onChangeText={setSearchQ}
            />

            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: 10,
                marginTop: 15
            }}>
                <View style={{ flexDirection: 'row', }}>
                    <StyledText style={{ color: COLORS.HL_GRAY }}>Pair / Vol</StyledText>
                    <AntDesign name="arrow-down" size={14} color={COLORS.HL_GRAY} style={{ paddingTop: 3 }} />
                </View>
                <StyledText style={{ color: COLORS.HL_GRAY }}>Price / Change</StyledText>
            </View>

            <FlatList
                data={assets}
                renderItem={(item) => (
                    <ChooseTradePairItem key={item.item.name} item={item.item} onPress={() => onPressAsset(item.item)} />
                )}
                ItemSeparatorComponent={() => (
                    <View
                        style={{
                            backgroundColor: '#1d1d1d',
                            height: 1,
                            marginLeft: 10,
                        }}
                    />
                )}

            />
        </SafeAreaView>
    )
}

export default ChooseTradePairScreen;


const ChooseTradePairItem = ({ item, onPress }: { item: AssetModel, onPress: () => void }) => {
    return (
        <TouchableOpacity
            style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: 10,
                paddingVertical: 10,
            }}
            onPress={onPress}
        >
            <View>
                <View style={{ flexDirection: 'row' }}>
                    <StyledText>{item.name}-USDC</StyledText>
                    <StyledText style={{ marginLeft: 5, backgroundColor: COLORS.HL_GREEN1, paddingHorizontal: 3, borderRadius: 3 }}>{item.maxLeverage}x</StyledText>
                </View>
                <StyledText>{formatVolume(item.dayNtlVlm)}</StyledText>
            </View>

            <View style={{ alignItems: 'flex-end' }}>
                <StyledText>{formatPrice(item.markPx)}</StyledText>
                {percentChangePrice1d({ markPx: item.markPx, prevDayPx: item.prevDayPx })}
            </View>
        </TouchableOpacity>
    )
}


export const percentChangePrice1d = ({ markPx, prevDayPx }: { markPx: string, prevDayPx: string }) => {
    let val = (Number(markPx) - Number(prevDayPx)) / Number(prevDayPx) * 100
    if (val >= 0) {
        return <StyledText style={{ fontSize: 12, color: COLORS.HL_GREEN }}>{`+${formatPrice(val)}%`}</StyledText>
    }
    return <StyledText style={{ fontSize: 12, color: COLORS.HL_RED }}>{`${formatPrice(val)}%`}</StyledText>
}

export const percentChangePriceAndPrice1d = ({ markPx, prevDayPx }: { markPx: string, prevDayPx: string }) => {
    let priceChanded = (Number(markPx) - Number(prevDayPx))
    let percentChanged = priceChanded / Number(prevDayPx) * 100
    if (percentChanged >= 0) {
        return <StyledText style={{ fontSize: 12, color: COLORS.HL_GREEN }}>+{formatPrice(priceChanded)} / {`+${formatPrice(percentChanged)}%`}</StyledText>
    }
    return <StyledText style={{ fontSize: 12, color: COLORS.HL_RED }}>-{formatPrice(priceChanded).replace("-", "")} / {`${formatPrice(percentChanged)}%`}</StyledText>
}