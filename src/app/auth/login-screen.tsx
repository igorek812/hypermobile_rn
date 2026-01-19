import StyledText from '@/src/components/styled-text';
import { COLORS } from '@/src/constants/colors';
import { useGlobalContext } from '@/src/context/global-provider';
import AgentWalletModel from '@/src/models/agent-wallet-model';
import { storeAgentWalletData } from '@/src/storage/async-storage';
import { useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import { useState } from 'react';
import { Button, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function LoginScreen() {
    const insets = useSafeAreaInsets();
    const [cameraPermission, requestCameraPermission] = useCameraPermissions();
    const globalContext = useGlobalContext()
    
    const [modalData, setModalData] = useState<string>('');

    async function scanQrCodeButtonAction() {
        try {

            //let str = "https://app.hyperliquid.xyz/trade?link=eyJhZGRyZXNzIjoiMHg2N0MwZGVEMUNjNjAxZkIyODRFNDUxNEFhQzI0RTQ2RjM0ZDMzY0EyIiwia2V5IjoiMHg4MjFhYjJkYWNjZTE4YjhjMjE2NDdmNzE1ZWU3YTMwOGRiZjNkZWMzNjFhMmIzM2Q3MzY1NjY1OTk0OWU1MmVjIn0="
            let str = "https://app.hyperliquid.xyz/trade?link=eyJhZGRyZXNzIjoiMHg2NGZDNmI3OTM2ZWFkRmEyODdBNUY5Yzg5MkRjOTZGY2FiMEE3NUM4Iiwia2V5IjoiMHg2OWYyOGE4YmU0YmU5MmNiZTY3NTI0ODdhMzg1NzA3ODQyODEwNzhmMGYyMDQ1N2Y5ODAwNzliZjFlNDI2NWQyIn0="
            const url = new URL(str)
            const linkValue = url.searchParams.get('link')

            if (linkValue != null) {

                // base64 str to str
                const decodedLinkValue = atob(linkValue);
                
                // str to json
                const json = JSON.parse(decodedLinkValue)

                const agentWalletResult: AgentWalletModel = {
                    address: json.address,
                    key: json.key
                }

                await storeAgentWalletData(json)

                globalContext.setAgentWallet(agentWalletResult)

                router.replace("/")

            } else {
                throw new Error("Wrong link")
            }

        } catch (error) {
            alert(error)
        }
    }

    return(
        <SafeAreaView 
            style={{flex: 1}}
        >
            <View style={{
                flex: 1,
                justifyContent: "space-between"
            }}>
                <StyledText style={{marginTop: 20, marginLeft: 20, fontSize: 32, fontWeight: 'bold'}}>Login</StyledText>

                <View>
                    <View style={{
                    backgroundColor: '#EAB68F',
                    borderRadius: 10,
                    marginHorizontal: 20,
                    marginBottom: 10,
                    
                    // height: 100,
                    //  alignItems: 'center',
                    //  justifyContent:"center"
                }}>
                    <Button color={'white'} title='scan qr' onPress={() => router.navigate("/auth/scan-qr-code-screen") }/>
                </View>
                <LoginButton
                    text="Login"
                    styles={{
                        // marginBottom: insets.bottom,
                    }}
                    onPress={scanQrCodeButtonAction}
                    isLoading={false}
                />
                </View>
            </View>
        </SafeAreaView>
    )
}


function LoginButton({text, styles, onPress, isLoading}: {text: string, styles: any, onPress: () => {}, isLoading: boolean}) {
    return(
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            disabled={isLoading}
            style={{
                backgroundColor: COLORS.HL_GREEN,
                height: 44,
                borderRadius: 10,
                marginHorizontal: 20,
                justifyContent: 'center',
                alignItems: 'center',
                ...styles
            }}
            >
                <StyledText style={{color: COLORS.HL_TEXT_SECOND}}>{text}</StyledText>
        </TouchableOpacity>
    )
}