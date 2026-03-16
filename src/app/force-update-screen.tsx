import { Linking, Platform, View } from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import StyledButton from "../components/styled-button"
import StyledText from "../components/styled-text"
import { CONSTANTS } from "../constants/constants"

const ForceUpdateScreen = () => {
    const insets = useSafeAreaInsets();

    
    // MARK: - Handlers
    
    const onPressUpdate = () => {
        // go to store
        if (Platform.OS == "ios") {
            openUrl({ url: CONSTANTS.APPSTORE_URL })
        } else if (Platform.OS == "android") {
            openUrl({ url: CONSTANTS.PLAYMARKET_URL })
        } else {
            alert("Unsupported platform")
        }
    }


    // MARK: - Functions

    const openUrl = async ({ url }: { url: string }) => {
        const supported = await Linking.canOpenURL(url)

        if (supported) {
            Linking.openURL(url)
        } else {
            alert(`Cant open url: ${url}`)
        }
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
                    <StyledText style={{ marginTop: 20, marginLeft: 20, fontSize: 32, fontWeight: 'bold' }}>Update required</StyledText>
                    <StyledText style={{ marginTop: 20, marginHorizontal: 20 }}>New version is available. Please update app</StyledText>
                </View>

                <View>
                    <StyledButton
                        style={{
                            marginBottom: insets.bottom + 20,
                        }}
                        text="UPDATE"
                        onPress={onPressUpdate}
                        isLoading={false}
                    />
                </View>
            </View>
        </SafeAreaView>
    )
}

export default ForceUpdateScreen
