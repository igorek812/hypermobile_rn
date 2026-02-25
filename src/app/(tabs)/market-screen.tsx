import ChartView from "@/src/components/trade/chart-view"
import SelectedAssetView from "@/src/components/trade/selected-asset-view"
import { ScrollView, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export default function MarketScreen() {
    console.log("MarketScreen render")

    return (
        <SafeAreaView edges={["top", "left", "right"]} style={{ flex: 1 }}>
            <ScrollView
                alwaysBounceVertical={true}
            >
                <View style={{ flex: 1 }}>

                    <SelectedAssetView />

                    <ChartView />

                </View>

            </ScrollView>
        </SafeAreaView>
    )
}
