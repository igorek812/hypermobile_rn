import StyledText from '@/src/components/styled-text';
import { COLORS } from '@/src/constants/colors';
import { useGlobalContext } from '@/src/context/global-provider';
import { removeAgentWalletData } from '@/src/storage/async-storage';
import { useAppSelector } from '@/src/store/store';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as Clipboard from 'expo-clipboard';
import { router, useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

export default function AccountScreen() {
    console.log("AccountScreen render")

    const navigation = useNavigation();
    const globalContext = useGlobalContext()
    const safeAreaInsets = useSafeAreaInsets()

    const accountEquitySpotBalance = useAppSelector(state => state.account.accountEquitySpotBalance)
    const accountEquityPerpsBalance = useAppSelector(state => state.account.accountEquityPerpsBalance)
    const perpsOverviewBalance = useAppSelector(state => state.account.perpsOverviewBalance)
    const perpsOverviewUnrealizedPnl = useAppSelector(state => state.account.perpsOverviewUnrealizedPnl)
    const perpsOverviewCrossMarginRatio = useAppSelector(state => state.account.perpsOverviewCrossMarginRatio)
    const perpsOverviewMaintenanceMargin = useAppSelector(state => state.account.perpsOverviewMaintenanceMargin)
    const perpsOverviewCrossAccountLeverage = useAppSelector(state => state.account.perpsOverviewCrossAccountLeverage)

    useEffect(() => {
        navigation.setOptions({
            headerStyle: { backgroundColor: COLORS.HL_BG },
            // title: "",
            headerTitle: "",
            headerRight: () => (
                <TouchableOpacity
                    style={{ marginRight: 20 }}
                    onPress={() => {
                        removeAgentWalletData()
                        globalContext.setIsLoading(true)
                        globalContext.setAgentWallet(null)
                        router.replace('/')
                        // Alert.alert("", [{"", onPress={() => console.log('asd')}}])
                    }}
                >
                    <StyledText style={{fontSize: 17}}>Logout</StyledText>
                </TouchableOpacity>
            )
        })
    }, [])

    const onPressCopy = async () => {
        await Clipboard.setStringAsync(globalContext.agentWallet?.address ?? "")

        Toast.show({
            type: "success",
            text1: 'Address copied ✅',
            topOffset: safeAreaInsets.top + 20,
            visibilityTime: 1000
        });
    }

    return (
        <SafeAreaView edges={["bottom"]} style={{ flex: 1 }}>
            <View style={{ marginHorizontal: 6, marginVertical: 12 }}>

                <View style={{ marginBottom: 12, marginRight: 23 }}>
                    <StyledText style={{ marginBottom: 12 }}>Account Address</StyledText>
                    {globalContext.agentWallet != null
                        ? <TouchableOpacity onPress={onPressCopy} style={{ flexDirection: 'row' }}>
                            <StyledText>{globalContext.agentWallet.address}</StyledText>
                            {/* <StyledText style={{ marginLeft: 5 }}>#</StyledText> */}
                            <MaterialCommunityIcons style={{ marginLeft: 5 }} name="content-copy" size={17} color={COLORS.PRIMARY_TEXT} />
                        </TouchableOpacity>
                        : <StyledText>-</StyledText>
                    }
                </View>

                <View style={{ height: 1, backgroundColor: COLORS.HL_BORDER, marginBottom: 12 }} />

                <View style={{ marginBottom: 12 }}>
                    <StyledText style={{ marginBottom: 12 }}>Account Equity</StyledText>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                        <StyledText style={{ color: COLORS.HL_GRAY }}>Spot</StyledText>
                        <StyledText>{accountEquitySpotBalance != null ? `$${accountEquitySpotBalance.toFixed(2)}` : "N/A"}</StyledText>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <StyledText style={{ color: COLORS.HL_GRAY }}>Perps</StyledText>
                        <StyledText>{accountEquityPerpsBalance != null ? `$${accountEquityPerpsBalance.toFixed(2)}` : "N/A"}</StyledText>
                    </View>
                </View>

                <View style={{ height: 1, backgroundColor: COLORS.HL_BORDER, marginBottom: 12 }} />

                <View>
                    <StyledText style={{ marginBottom: 12 }}>Perps Overview</StyledText>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                        <StyledText style={{ color: COLORS.HL_GRAY }}>Balance</StyledText>
                        <StyledText>{perpsOverviewBalance != null ? `$${perpsOverviewBalance.toFixed(2)}` : "N/A"}</StyledText>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                        <StyledText style={{ color: COLORS.HL_GRAY }}>Unrealized PNL</StyledText>
                        <StyledText style={{ color: (perpsOverviewUnrealizedPnl != null && perpsOverviewUnrealizedPnl >= 0) ? COLORS.HL_GREEN : COLORS.HL_RED }}>{perpsOverviewUnrealizedPnl != null ? `$${perpsOverviewUnrealizedPnl.toFixed(2)}` : "N/A"}</StyledText>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                        <StyledText style={{ color: COLORS.HL_GRAY }}>Cross Margin Ratio</StyledText>
                        <StyledText style={{ color: (perpsOverviewCrossMarginRatio != null && perpsOverviewCrossMarginRatio >= 0) ? COLORS.HL_GREEN : COLORS.HL_RED }}>{perpsOverviewCrossMarginRatio != null ? `${perpsOverviewCrossMarginRatio.toFixed(2)}%` : "N/A"}</StyledText>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                        <StyledText style={{ color: COLORS.HL_GRAY }}>Maintenance Margin</StyledText>
                        <StyledText>{perpsOverviewMaintenanceMargin != null ? `$${perpsOverviewMaintenanceMargin.toFixed(2)}` : "N/A"}</StyledText>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                        <StyledText style={{ color: COLORS.HL_GRAY }}>Cross Account Leverage</StyledText>
                        <StyledText>{perpsOverviewCrossAccountLeverage != null ? `${perpsOverviewCrossAccountLeverage.toFixed(2)}x` : "N/A"}</StyledText>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}
