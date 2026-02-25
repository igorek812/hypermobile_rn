import L2BookView from '@/src/components/trade/l2-book-view';
import OrderView from '@/src/components/trade/order-view';
import SelectedAssetView from '@/src/components/trade/selected-asset-view';
import TradeMenuView from '@/src/components/trade/trade-menu-view';
import webSocketServiceLib from '@/src/services/web-socket-service-lib';
import { useAppSelector } from '@/src/store/store';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Modal, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function TradeScreen() {
    console.log("TradeScreen render")

    const selectedAssetName = useAppSelector((state) => state.trade.selectedAssetName)

    const [loadingViewVisible, setLoadingViewVisible] = useState(false);

    useEffect(() => {
        if (selectedAssetName == null) return
        webSocketServiceLib.subscribeToL2Book({ coin: selectedAssetName })

    }, [selectedAssetName])

    // // TODO: - NEED PLACE LOGIC
    // useEffect(() => {
    //     const handleAppStateChange = (nextAppState: any) => {
    //         if (nextAppState === 'active') {
    //             webSocketRepository.connect();
    //         } else if (nextAppState === 'background' || nextAppState === 'inactive') {
    //             webSocketRepository.disconnect();
    //         }
    //     };

    //     const subscription = AppState.addEventListener('change', handleAppStateChange);

    //     return () => {
    //         subscription.remove();
    //     };
    // }, []);


    const handleTradeMenuViewIsShowLoadingView = useCallback((isShow: boolean) => {
        setLoadingViewVisible(isShow)
    }, [])


    return (
        <SafeAreaView edges={["top", "left", "right"]} style={{ flex: 1 }}>
            <Modal
                animationType="fade"
                transparent={true}
                visible={loadingViewVisible}
            // onRequestClose={() => {
            //     Alert.alert('Modal has been closed.');
            //     setLoadingViewVisible(loadingViewVisible);
            // }}
            >
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#00000080'
                }}>
                    <ActivityIndicator color={'white'} />
                </View>
            </Modal>
            <ScrollView
                style={{
                    flex: 1,
                }}
                alwaysBounceVertical={true}
            >

                <SelectedAssetView />

                <View style={{
                    flexDirection: 'row',
                    height: 300,
                    gap: 3,
                    marginBottom: 12,
                    marginHorizontal: 6
                }}>
                    <OrderView isShowLoadingView={handleTradeMenuViewIsShowLoadingView} />
                    <L2BookView />
                </View>

                <TradeMenuView isShowLoadingView={handleTradeMenuViewIsShowLoadingView} />

            </ScrollView>
        </SafeAreaView>
    )
}
