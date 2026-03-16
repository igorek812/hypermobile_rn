import { analyticsLogEvent } from '@/src/analytics/analytics';
import StyledButton from '@/src/components/styled-button';
import StyledText from '@/src/components/styled-text';
import { CONSTANTS } from '@/src/constants/constants';
import { useGlobalContext } from '@/src/context/global-provider';
import AgentWalletModel from '@/src/models/agent-wallet-model';
import { storeAgentWalletData } from '@/src/storage/async-storage';
import { router } from 'expo-router';
import { View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function LoginScreen() {
    const insets = useSafeAreaInsets();
    const globalContext = useGlobalContext()


    // MARK: - Functions

    async function scanQrCodeHandle(str: string) {
        try {

            await analyticsLogEvent({ name: "scan_qr_code", params: { "test": 123, "ping": "pong" } })

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

    const onPressScanQr = async () => {
        await analyticsLogEvent({ name: "scan_qr_code" })
        router.navigate("/auth/scan-qr-code-screen")
    }


    // MARK: - UI

    return (
        <SafeAreaView
            style={{ flex: 1 }}
        >
            <View style={{
                flex: 1,
                justifyContent: "space-between"
            }}>
                <View>
                    <StyledText style={{ marginTop: 20, marginLeft: 20, fontSize: 32, fontWeight: 'bold' }}>Login</StyledText>
                    <StyledText style={{ marginTop: 20, marginHorizontal: 20 }}>Trade, invest and explore in Hyperliquid ecosystem with HyperMobile</StyledText>
                    <StyledText style={{ marginTop: 5, marginHorizontal: 20, fontStyle: 'italic' }}>build for Hyperliquid community. not affiliated with team</StyledText>
                </View>

                <View>

                    {CONSTANTS.IS_DEV &&
                        <StyledButton
                            style={{
                                backgroundColor: '#EAB68F',
                                marginBottom: 20,
                            }}
                            text="MOCK LOGIN"
                            // onPress={() => scanQrCodeButtonAction("https://app.hyperliquid.xyz/trade?link=eyJhZGRyZXNzIjoiMHg2N0MwZGVEMUNjNjAxZkIyODRFNDUxNEFhQzI0RTQ2RjM0ZDMzY0EyIiwia2V5IjoiMHg4MjFhYjJkYWNjZTE4YjhjMjE2NDdmNzE1ZWU3YTMwOGRiZjNkZWMzNjFhMmIzM2Q3MzY1NjY1OTk0OWU1MmVjIn0=")}
                            onPress={() => scanQrCodeHandle("https://app.hyperliquid.xyz/trade?link=eyJhZGRyZXNzIjoiMHg2NGZDNmI3OTM2ZWFkRmEyODdBNUY5Yzg5MkRjOTZGY2FiMEE3NUM4Iiwia2V5IjoiMHg2OWYyOGE4YmU0YmU5MmNiZTY3NTI0ODdhMzg1NzA3ODQyODEwNzhmMGYyMDQ1N2Y5ODAwNzliZjFlNDI2NWQyIn0=")}
                            isLoading={false}
                        />
                    }

                    <StyledButton
                        style={{
                            marginBottom: insets.bottom + 20,
                        }}
                        text="Scan QR"
                        onPress={onPressScanQr}
                        isLoading={false}
                    />
                </View>
            </View>
        </SafeAreaView>
    )
}
