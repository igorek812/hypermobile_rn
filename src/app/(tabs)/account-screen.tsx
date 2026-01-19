import StyledText from '@/src/components/styled-text';
import { COLORS } from '@/src/constants/colors';
import { useGlobalContext } from '@/src/context/global-provider';
import { removeAgentWalletData } from '@/src/storage/async-storage';
import * as Clipboard from 'expo-clipboard';
import { router, useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AccountScreen() {
    const navigation = useNavigation();
    const globalContext = useGlobalContext()

    useEffect(() => {
        navigation.setOptions({
            headerStyle: {backgroundColor: COLORS.HL_BG},
            // title: "",
            headerTitle: "",
            headerRight: () => (
                <TouchableOpacity 
                    style={{marginRight: 20}}
                    onPress={() => {
                        removeAgentWalletData()
                        globalContext.setIsLoading(true)
                        globalContext.setAgentWallet(null)
                        router.replace('/')


                        // Alert.alert("", [{"", onPress={() => console.log('asd')}}])
                    }}
                >
                    <StyledText>Logout</StyledText>
                </TouchableOpacity>
            )
        })
    }, [])

    return(
        <SafeAreaView edges={["left", "right", "bottom"]}>
            <View style={{marginHorizontal: 6, marginVertical: 12}}>

                <View style={{marginBottom: 12}}>
                    <StyledText style={{marginBottom: 12}}>Account Address</StyledText>
                    <TouchableOpacity onPress={async() => await Clipboard.setStringAsync('hello world')}>
                        <StyledText>{globalContext.agentWallet?.address ?? "0x.."}</StyledText>
                    </TouchableOpacity>
                </View>
                
                <View style={{height: 1, backgroundColor: COLORS.HL_BORDER, marginBottom: 12}}/>

                <View style={{marginBottom: 12}}>
                    <StyledText style={{marginBottom: 12}}>Account Equity</StyledText>
                    
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6}}>
                        <StyledText style={{color: COLORS.HL_GRAY}}>Spot</StyledText>
                        <StyledText>$20,00</StyledText>
                    </View>

                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <StyledText style={{color: COLORS.HL_GRAY}}>Perps</StyledText>
                        <StyledText>$97,35</StyledText>
                    </View>
                </View>
                
                <View style={{height: 1, backgroundColor: COLORS.HL_BORDER, marginBottom: 12}}/>

                <View>
                    <StyledText style={{marginBottom: 12}}>Perps Overview</StyledText>
                    
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6}}>
                        <StyledText style={{color: COLORS.HL_GRAY}}>Balance</StyledText>
                        <StyledText>$97,35</StyledText>
                    </View>

                    <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6}}>
                        <StyledText style={{color: COLORS.HL_GRAY}}>Unrealized PNL</StyledText>
                        <StyledText>$0,00</StyledText>
                    </View>

                    <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6}}>
                        <StyledText style={{color: COLORS.HL_GRAY}}>Cross Margin Ratio</StyledText>
                        <StyledText>0,00%</StyledText>
                    </View>

                    <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6}}>
                        <StyledText style={{color: COLORS.HL_GRAY}}>Maintenance Margin</StyledText>
                        <StyledText>$0,00</StyledText>
                    </View>

                    <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6}}>
                        <StyledText style={{color: COLORS.HL_GRAY}}>Cross Account Leverage</StyledText>
                        <StyledText>0,00x</StyledText>
                    </View>
                </View>

            </View>
        </SafeAreaView>
    )
}
