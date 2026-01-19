import StyledText from '@/src/components/styled-text';
import BalanceListView from '@/src/components/trade-list-views/balance-list-view';
import FundingHistoryListView from '@/src/components/trade-list-views/funding-history-list-view';
import OpenOrdersListView from '@/src/components/trade-list-views/open-orders-list-view';
import OrderHistoryListView from '@/src/components/trade-list-views/order-history-list-view';
import PositionListView from '@/src/components/trade-list-views/position-list-view';
import TradeHistoryListView from '@/src/components/trade-list-views/trade-history-list-view';
import { COLORS } from '@/src/constants/colors';
import { useGlobalContext } from '@/src/context/global-provider';
import AssetPositionModel from '@/src/models/asset-position-model';
import BalanceModel from '@/src/models/balance-model';
import OpenOrders from '@/src/models/open-orders-model';
import webSocketServiceLib from '@/src/services/web-socket-service-lib';
import { useAppSelector } from '@/src/store/store';
import { ExchangeClient, HttpTransport } from '@nktkas/hyperliquid';
import { formatPrice, formatSize, SymbolConverter } from "@nktkas/hyperliquid/utils";
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, FlatList, Modal, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import { MaskedTextInput } from "react-native-advanced-input-mask";
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    CandlestickChart
} from 'react-native-wagmi-charts';
import { Hex } from 'viem';
import { privateKeyToAccount } from "viem/accounts";
import { percentChangePrice1d } from '../choose-trade-pair-screen';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

enum MenuType {
    BALANCE = "Balance",
    POSITIONS = "Positions",
    OPEN_ORDERS = "Open Orders",
    TWAP = "TWAP",
    TRADE_HISTORY = "Trade History",
    FUNDING_HISTORY = "Funding History",
    ORDER_HISTORY = "Order History"
}

interface MenuModel {
    type: MenuType
    title: string
}

interface MenuItemsModel {
    balances: BalanceModel[]
    positions: AssetPositionModel[]
    openOrders: OpenOrders[]
}

export default function TradeScreen() {
  const [value, setValue] = useState({ extracted: "10", formatted: "$10" });

    const [priceValue, setPriceValue] = useState(0)
    const [sizeValue, setSizeValue] = useState(0)

    const {agentWallet} = useGlobalContext()
    const [loadingViewVisible, setLoadingViewVisible] = useState(false);

    const [orderViewIsShow, setOrderViewIsShow] = useState(true)
    const [orderTypeSegmentControlIndex, setOrderTypeSegmentControlIndex] = useState(0)

    const selectedAsset = useAppSelector((state) => state.trade.selectedAsset)
    const l2Book = useAppSelector((state) => state.trade.l2Book)

    // menu
    const [selectedMenuType, setSelectedMenuType] = useState<MenuType>(MenuType.BALANCE)
    const [menu, setMenu] = useState<MenuModel[]>([
        {type: MenuType.BALANCE, title: "Balance"},
        {type: MenuType.POSITIONS, title: "Positions"},
        {type: MenuType.OPEN_ORDERS, title: "Open Orders"},
        {type: MenuType.TWAP, title: "TWAP"},
        {type: MenuType.TRADE_HISTORY, title: "Trade History"},
        {type: MenuType.FUNDING_HISTORY, title: "Funding History"},
        {type: MenuType.ORDER_HISTORY, title: "Order History"},
    ])
    const [balancesCount, setBalancesCount] = useState(0)
    const [assetPositionsCount, setAssetPositionsCount] = useState(0)
    const [openOrdersCount, setOpenOrdersCount] = useState(0)

    // menu table
    const balances = useAppSelector((state) => state.trade.balances)
    const assetPositions = useAppSelector((state) => state.trade.assetPositions)
    const openOrders = useAppSelector((state) => state.trade.openOrders)
    // mock twap
    const tradeHistory = useAppSelector((state) => state.trade.tradeHistory)
    const fundingHistory = useAppSelector((state) => state.trade.fundingHistory)
    const orderHistory = useAppSelector((state) => state.trade.orderHistory)

    
    const [data, setData] = useState([
    { timestamp: 1625945400000, open: 335.75, high: 336.25, low: 334.75, close: 335.50 },
    { timestamp: 1625947200000, open: 335.50, high: 336.10, low: 334.80, close: 335.80 },
    { timestamp: 1625949000000, open: 335.80, high: 336.50, low: 335.20, close: 336.20 },
    // ... больше данных
  ]);
  // Генерация тестовых данных
  useEffect(() => {
    const generateMockData = () => {
      const newData = [];
      let basePrice = 300;
      let timestamp = Date.now() - 30 * 24 * 60 * 60 * 1000; // 30 дней назад

      for (let i = 0; i < 100; i++) {
        const open = basePrice + Math.random() * 10 - 5;
        const close = open + Math.random() * 10 - 5;
        const high = Math.max(open, close) + Math.random() * 5;
        const low = Math.min(open, close) - Math.random() * 5;

        newData.push({
          timestamp: timestamp + i * 24 * 60 * 60 * 1000,
          open,
          high,
          low,
          close,
        });

        basePrice = close;
      }
      setData(newData);
    };

    generateMockData();
  }, []);


    // Update balance count
    useEffect(() => {
        if (balances.length == balancesCount) return
        setBalancesCount(balances.length)
    }, [balances])

    useEffect(() => {
        for (let i=0; i<menu.length;i++) {
            if (menu[i].type == MenuType.BALANCE) {
                menu[i].title = `Balance (${balancesCount})`
                return
            }
        }
        setMenu(menu)
    }, [balancesCount])


    // Update positions count
    useEffect(() => {
        if (assetPositions.length == assetPositionsCount) return
        setAssetPositionsCount(assetPositions.length)
    }, [assetPositions])

    useEffect(() => {
        for (let i=0; i<menu.length;i++) {
            if (menu[i].type == MenuType.POSITIONS) {
                menu[i].title = `Positions (${assetPositionsCount})`
                return
            }
        }
        setMenu(menu)
    }, [assetPositionsCount])


    // Update open orders count
    useEffect(() => {
        if (openOrders.length == openOrdersCount) return
        setOpenOrdersCount(openOrders.length)
    }, [openOrders])

    useEffect(() => {
        for (let i=0; i<menu.length;i++) {
            if (menu[i].type == MenuType.OPEN_ORDERS) {
                menu[i].title = `Open Orders (${openOrdersCount})`
                return
            }
        }
        setMenu(menu)
    }, [openOrdersCount])

    
    useEffect(() => {
        if (selectedAsset == null) return
        webSocketServiceLib.subscribeToL2Book({coin: selectedAsset.name})
    }, [selectedAsset])


    // MARK: - Exchange Client
    
    // const [ExchangeClient, setExchangeClient] = useState<ExchangeClient | null>(null)
    
    async function cancelOrder({assetName, oid}: {assetName: string, oid: number}) {
        if (agentWallet == null) {
           alert("agentWallet is not init")
            return
        }
        const transport = new HttpTransport();

        const exchange = new ExchangeClient({
            transport: transport,
            wallet: privateKeyToAccount(agentWallet.key as Hex),
        });

        const converter = await SymbolConverter.create({ transport });
        const assetId = converter.getAssetId(assetName)

        if (assetId == null) {
            alert(`Wrong asset id, asset=${assetName}, id=${assetId}`)
            return
        }
        
        setLoadingViewVisible(true)
        const result = await exchange.cancel({"cancels": [{"a": assetId, "o": oid}]})
        setLoadingViewVisible(false)

        Alert.alert(result.response.data.statuses.join(" "))
        console.log(result)
    }

    async function placeOrder() {
        if (agentWallet == null) {
            alert("agentWallet is not init")
            return
        }
        if (selectedAsset == null) {
            alert("selected asset is not init")
            return
        }
        if (priceValue <= 0) {
            alert("price value is wrong")
            return
        }
        if (sizeValue <= 0) {
            alert("size value is wrong")
            return
        }
        const transport = new HttpTransport();

        const exchange = new ExchangeClient({
            transport: transport,
            wallet: privateKeyToAccount(agentWallet.key as Hex),
        });

        const converter = await SymbolConverter.create({ transport });
        const assetId = converter.getAssetId(selectedAsset.name)
        const szDecimals = converter.getSzDecimals(selectedAsset.name); // 5

        if (assetId == null) {
            alert(`asset id is null, asset=${selectedAsset.name}`)
            return
        }
        if (szDecimals == null) {
            alert(`szDecimals is null, asset=${selectedAsset.name}`)
            return
        }

        const price = formatPrice(priceValue, szDecimals); // "97123"
        const size = formatSize(sizeValue, szDecimals); // "0.00123"
        
        setLoadingViewVisible(true)
        const result = await exchange.order({
            orders: [{
                a: assetId,
                b: true,
                p: price,
                s: size,
                r: false,
                t: { limit: { tif: "Gtc" } },
            }],
            grouping: "na",
        });
        setLoadingViewVisible(false)

        Alert.alert(result.response.data.statuses.join(" "))
        console.log(result)
    }

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

  const onChangeText = useCallback((formatted: any, extracted: any) => {
    console.log(formatted);
  }, []);

    return(
        <SafeAreaView edges={["top", "left", "right"]}>
            <Modal
                animationType="fade"
                transparent={true}
                visible={loadingViewVisible}
                // onRequestClose={() => {
                //     Alert.alert('Modal has been closed.');
                //     setLoadingViewVisible(loadingViewVisible);
                // }}
                >
                <View style={{flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#00000080'
                }}>
                <ActivityIndicator color={'white'}/>
            </View>
        </Modal>
            <ScrollView
                style={{
                    // flex: 1,
                    width: '100%',
                    height: '100%',
                }}
                alwaysBounceVertical={true}
             >

                 {/* MARK: - ASSET INFO */}
                <View
                    style={{
                        flexDirection: 'row',
                        padding: 10,
                        justifyContent: "space-between",
                        alignItems: 'center'
                    }}
                >

                    {selectedAsset != null ?
                        <TouchableOpacity onPress={() => {
                            router.navigate('/choose-trade-pair-screen')
                        }}>
                            <StyledText style={{fontSize: 19, fontWeight:"bold"}}>{selectedAsset?.name}-USDC ↓</StyledText>
                            {percentChangePrice1d(selectedAsset)}
                        </TouchableOpacity>
                        : 
                        <StyledText style={{fontSize: 19, fontWeight:"bold"}}>-</StyledText>
                    }
                        
                    <View style={{
                        marginRight: 10,
                        width: 120
                    }}>
                        <SegmentedControl
                                values={['Graph', 'Order']}
                                selectedIndex={1}
                                onChange={(event) => {
                                    setOrderViewIsShow(event.nativeEvent.selectedSegmentIndex == 1);
                                }}
                            />
                    </View>
                </View>

                {/* MARK: - Graph */}
                <View style={{height: 200}}>
                    <CandlestickChart.Provider data={data}>
                        <CandlestickChart height={200}>
                            <CandlestickChart.Candles />
                            <CandlestickChart.Crosshair/>
                        </CandlestickChart>
                    
                        {/* Линейный график поверх свечей (опционально) */}
                        {/* <LineChart>
                            <LineChart.Path color="#3b82f6" />
                            <LineChart.Tooltip />
                        </LineChart> */}
                    </CandlestickChart.Provider>
                </View>


                {/* MARK: - Order data */}

                <View style={{
                    flexDirection: 'row',
                    height: 300,
                    gap: 3,
                    marginBottom: 12
                }}>
                    <View style={{
                        flex: 6,
                        //  backgroundColor: 'red',
                        //  marginBottom: 3
                        }}>
                        <View style={{flexDirection: 'row', height: 30, gap: 6, marginBottom: 6}}>
                            <TouchableOpacity style={{flex: 8, backgroundColor: COLORS.HL_BG1, borderRadius: 6, justifyContent: 'center', alignItems: 'center'}}><StyledText>Cross</StyledText></TouchableOpacity>
                            <TouchableOpacity style={{flex: 2, backgroundColor: COLORS.HL_BG1, borderRadius: 6, justifyContent: 'center', alignItems: 'center'}}><StyledText>7x</StyledText></TouchableOpacity>
                        </View>

                        <View style={{marginBottom: 6}}>
                            <SegmentedControl
                                values={['Buy/Long', 'Sell/Short']}
                                selectedIndex={orderTypeSegmentControlIndex}
                                backgroundColor={COLORS.HL_BG1}
                                tintColor={orderTypeSegmentControlIndex == 0 ? COLORS.HL_GREEN : COLORS.HL_RED}
                                onChange={(event) => {
                                    setOrderTypeSegmentControlIndex(event.nativeEvent.selectedSegmentIndex);
                                }}
                            />
                        </View>
                        
                        <View style={{flexDirection: 'row', height: 30, gap: 6, marginBottom: 6}}>
                            <TouchableOpacity style={{flex: 8, backgroundColor: COLORS.HL_BG1, borderRadius: 6, alignItems: 'center', justifyContent: 'center'}}><StyledText>Limit</StyledText></TouchableOpacity>
                            <TouchableOpacity style={{flex: 2, backgroundColor: COLORS.HL_BG1, borderRadius: 6, alignItems: 'center', justifyContent: 'center'}}><StyledText>?</StyledText></TouchableOpacity>
                        </View>
                        
                        <View style={{backgroundColor: COLORS.HL_BG1, marginBottom: 6, padding: 3, borderRadius: 6}}>
                            <StyledText style={{fontSize: 12, color: COLORS.HL_GRAY}}>Price(USDC)</StyledText>
                            <TextInput
                                style={{
                                    height: 25
                                }}
                                keyboardType='numeric'
                                placeholderTextColor={COLORS.HL_GRAY}
                                color={'white'}
                                onChangeText={(text) => {
                                    console.log(text)
                                }}
                                placeholder='Price'
                                // value='123'
                            />
                        </View>

                        <View style={{backgroundColor: COLORS.HL_BG1, marginBottom: 6, padding: 3, borderRadius: 6}}>
                            <StyledText style={{fontSize: 12, color: COLORS.HL_GRAY}}>Size({selectedAsset?.name})</StyledText>
                            <MaskedTextInput
                                allowedKeys="0123456789,."
          autocomplete={false}
          keyboardType="numeric"
          mask="$[09999]{.}[09]"
          onChangeText={(formatted, extracted) => {
            console.log("123")
            setValue({
              formatted,
              extracted,
            });
          }}
          placeholder="$5"
          placeholderTextColor="blue" // Adjust your own placeholder color
          value={value.formatted} // Use formatted value from onChangeText instead
        //   style={styles.textInput}
                            />
                        </View>

                        <View>
                            <View style={{
                                flexDirection: 'row',
                                marginBottom: 3,
                                justifyContent: 'space-between'
                            }}>
                                <StyledText style={{fontSize: 12, color: COLORS.HL_GRAY}}>Liquidation Price</StyledText>
                                <StyledText style={{fontSize: 12}}>N/A</StyledText>
                            </View>

                            <View style={{
                                flexDirection: 'row',
                                marginBottom: 3,
                                justifyContent: 'space-between'
                            }}>
                                <StyledText style={{fontSize: 12, color: COLORS.HL_GRAY}}>Order Value</StyledText>
                                <StyledText style={{fontSize: 12}}>N/A</StyledText>
                            </View>

                            <View style={{
                                flexDirection: 'row',
                                marginBottom: 6,
                                justifyContent: 'space-between'
                            }}>
                                <StyledText style={{fontSize: 12, color: COLORS.HL_GRAY}}>Margin Required</StyledText>
                                <StyledText style={{fontSize: 12}}>N/A</StyledText>
                            </View>
                            
                            <TouchableOpacity
                                style={{
                                    height: 35,
                                    borderRadius: 6,
                                    backgroundColor: orderTypeSegmentControlIndex == 0 ? COLORS.HL_GREEN : COLORS.HL_RED,
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                                onPress={placeOrder}
                            >
                                <StyledText style={{color: COLORS.HL_TEXT_SECOND}}>Place Order</StyledText>
                            </TouchableOpacity>
                        </View>
                    </View>


                    {/* MARK: - L2 */}

                    <View style={{flex: 4, gap: 1}}>
                        <View style={{flex: 5, marginHorizontal: 5}}>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                            }}>
                                <StyledText style={{color: COLORS.HL_GRAY, fontSize: 12}}>Price</StyledText>
                                <StyledText style={{color: COLORS.HL_GRAY, fontSize: 12}}>Size</StyledText>
                            </View>
                            <FlatList
                                id='0'
                                scrollEnabled={false}
                                data={l2Book[0] ?? []}
                                renderItem={({item}) => (
                                     <View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
                                        <StyledText style={{fontSize: 12, color: COLORS.HL_GRAY}}>{item.px}</StyledText>
                                        <StyledText style={{fontSize: 12, color: COLORS.HL_GRAY}}>{item.sz}</StyledText>
                                    </View>
                                )}
                                ItemSeparatorComponent={() => (
                                    <View style={{height: 1}}/>
                                )}
                            />
                        </View>
                        <View style={{flex: 1, justifyContent: 'center'}}><StyledText style={{marginLeft: 5, fontSize: 19, color: COLORS.HL_GRAY}}>{(l2Book[1] ?? [])[0]?.px ?? "-"}</StyledText></View>
                        <View style={{flex: 5, marginHorizontal: 5}}>
                            <FlatList
                                id='1'
                                scrollEnabled={false}
                                data={l2Book[1] ?? []}
                                renderItem={({item}) => (
                                     <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <StyledText style={{fontSize: 12, color: COLORS.HL_GRAY}}>{item.px}</StyledText>
                                        <StyledText style={{fontSize: 12, color: COLORS.HL_GRAY}}>{item.sz}</StyledText>
                                    </View>
                                )}
                                ItemSeparatorComponent={() => (
                                    <View style={{height: 1}}/>
                                )}
                            />
                        </View>
                    </View>
                </View>

                {/* MARK: - MENU */}
                <View>
                    <FlatList
                        id='2'
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        data={menu}
                        renderItem={({item}) => (
                            <TouchableOpacity 
                                style={{paddingHorizontal: 5, paddingTop: 5, paddingBottom: 15}}
                                onPress={() => {
                                    setSelectedMenuType(item.type)
                                }}
                            >
                                <StyledText style={item.type == selectedMenuType ? {color: COLORS.HL_GREEN} : {color: COLORS.PRIMARY_TEXT}}>{item.title}</StyledText>
                            </TouchableOpacity>
                        )}
                    />
                </View>
                
                
                {/* MARK: - Balances */}
                {selectedMenuType == MenuType.BALANCE && 
                    <View>
                        {balances.length == 0 && <View style={{marginLeft: 10}}><StyledText>No balances yet</StyledText></View>}
                        <FlatList
                            id='3'
                            scrollEnabled={false}
                            showsHorizontalScrollIndicator={true}
                            data={balances}
                            renderItem={({item}) => (
                            <BalanceListView 
                                item={item}
                                onSend={() => console.log("send = ", item)}
                                onTransfer={() => console.log("transfer = ", item)}
                            />
                        )}
                        />
                    </View>
                }

                {/* MARK: - Positions */}
                {selectedMenuType == MenuType.POSITIONS && 
                    <View>
                        {assetPositions.length == 0 && <View style={{marginLeft: 10}}><StyledText>No positions yet</StyledText></View>}
                        <FlatList
                            id='4'
                            scrollEnabled={false}
                            showsHorizontalScrollIndicator={true}
                            data={assetPositions}
                            renderItem={({item}) => (<PositionListView item={item}/>)}
                        />
                    </View>
                }

                {/* MARK: - Open Orders */}
                {selectedMenuType == MenuType.OPEN_ORDERS && 
                    <View>
                        {openOrders.length == 0 && <View style={{marginLeft: 10}}><StyledText>No open orders yet</StyledText></View>}
                        <FlatList
                            id='5'
                            scrollEnabled={false}
                            showsHorizontalScrollIndicator={true}
                            data={openOrders}
                            renderItem={({item}) => (<OpenOrdersListView item={item} onCancel={() => {
                                cancelOrder({assetName: item.coin, oid: item.oid})
                            }}/>)}
                        />
                    </View>
                }

                {/* MARK: - TWAP */}
                {selectedMenuType == MenuType.TWAP && 
                    <View>
                        <View style={{marginLeft: 10}}><StyledText>Soon..</StyledText></View>
                    </View>
                }

                {/* MARK: - Trade history */}
                {selectedMenuType == MenuType.TRADE_HISTORY && 
                    <View>
                        {tradeHistory.length == 0 && <View style={{marginLeft: 10}}><StyledText>No trade history yet</StyledText></View>}
                        <FlatList
                            id='6'
                            scrollEnabled={false}
                            showsHorizontalScrollIndicator={true}
                            data={tradeHistory.slice().reverse()}
                            renderItem={({item}) => (<TradeHistoryListView item={item}/>)}
                        />
                    </View>
                }

                {/* MARK: - Funding history */}
                {selectedMenuType == MenuType.FUNDING_HISTORY && 
                    <View>
                        {fundingHistory.length == 0 && <View style={{marginLeft: 10}}><StyledText>No funding history yet</StyledText></View>}
                        <FlatList
                            id='7'
                            scrollEnabled={false}
                            showsHorizontalScrollIndicator={true}
                            data={fundingHistory.slice().reverse()}
                            renderItem={({item}) => (<FundingHistoryListView item={item}/>)}
                        />
                    </View>
                }

                {/* MARK: - Order history */}
                {selectedMenuType == MenuType.ORDER_HISTORY && 
                    <View>
                        {orderHistory.length == 0 && <View style={{marginLeft: 10}}><StyledText>No order history yet</StyledText></View>}
                        <FlatList
                            id='8'
                            scrollEnabled={false}
                            showsHorizontalScrollIndicator={true}
                            data={orderHistory.slice().reverse()}
                            renderItem={({item}) => (<OrderHistoryListView item={item}/>)}
                        />
                    </View>
                }

            </ScrollView>
        </SafeAreaView>
    )
}
