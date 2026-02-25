import { analyticsLogEvent } from "@/src/analytics/analytics"
import { COLORS } from "@/src/constants/colors"
import Errors from "@/src/constants/errors"
import { useGlobalContext } from "@/src/context/global-provider"
import { OrderDirectionModel } from "@/src/models/order-direction-model"
import { OrderTypeModel } from "@/src/models/order-type-model"
import hlService from "@/src/services/hl-service"
import { useAppSelector } from "@/src/store/store"
import { HttpTransport } from "@nktkas/hyperliquid"
import { formatPrice, formatSize, SymbolConverter } from "@nktkas/hyperliquid/utils"
import SegmentedControl from "@react-native-segmented-control/segmented-control"
import { router } from "expo-router"
import { FC, memo, useCallback, useEffect, useState } from "react"
import { Alert, TextInput, TouchableOpacity, View } from "react-native"
import { Hex } from "viem"
import StyledText from "../styled-text"

interface OrderViewProps {
    isShowLoadingView: (isShow: boolean) => void
}

const OrderView: FC<OrderViewProps> = memo(({ isShowLoadingView }) => {
    console.log("OrderView render")

    const { agentWallet } = useGlobalContext()
    const selectedAssetName = useAppSelector((state) => state.trade.selectedAssetName)
    const activeAssetLeverageData = useAppSelector((state) => state.trade.activeAssetLeverageData)
    const orderType = useAppSelector((state) => state.trade.orderType)
    const assets = useAppSelector((state) => state.ws.assets)

    const [activeAssetLeverageDataIsLoading, setActiveAssetLeverageDataIsLoading] = useState(false)
    // const [leverageType, setLeverageType] = useState<AssetLeverageMarginTypeModel>(AssetLeverageMarginTypeModel.ISOLATED)
    // const [leverageValue, setLeverageValue] = useState(1)
    const [orderDirection, setOrderDirection] = useState<OrderDirectionModel>(OrderDirectionModel.LONG)
    const [priceTextInputValue, setPriceTextInputValue] = useState('')
    const [sizeTextInputValue, setSizeTextInputValue] = useState('')
    const [orderValue, setOrderValue] = useState("")


    // MARK: - useEffect

    useEffect(() => {
        console.log("order view useEffect 1")
        if (selectedAssetName == null) return

        // get asset data
        getSelectedAssetLeverageData()

    }, [selectedAssetName])

    useEffect(() => {
        console.log("order view useEffect 2")
        console.log(`${priceTextInputValue == "" || sizeTextInputValue == ""}`)


        if (sizeTextInputValue == "") {
            setOrderValue("")
            return
        }

        if (orderType == OrderTypeModel.MARKET) {

            const marketPx = assets.filter((e) => e.name == selectedAssetName)[0]?.markPx //(tradeState.l2Book[1] ?? [])[0]?.px

            if (marketPx == null) {
                alert("Market price is null, please open order with Limit price")
                isShowLoadingView(false)
                return
            }

            const ov = Number(marketPx.replace(",", ".")) * Number(sizeTextInputValue.replace(",", "."))
            setOrderValue(`${ov.toFixed(2)}`)

        } else {

            if (priceTextInputValue == "") {
                setOrderValue("")
                return
            }

            const ov = Number(priceTextInputValue.replace(",", ".")) * Number(sizeTextInputValue.replace(",", "."))
            setOrderValue(`${ov.toFixed(2)}`)
        }

    }, [priceTextInputValue, sizeTextInputValue, orderType, assets])


    // MARK: - Handlers

    const onChangedPriceTextInput = useCallback((text: string) => {
        if (!_regExpNumber(text)) return
        // setPriceTextInputValue(text)
        console.log("handleChangedPrice = ", text)
        setPriceTextInputValue(text)
    }, [])

    const onChangedSizeTextInput = useCallback((text: string) => {
        if (!_regExpNumber(text)) return
        // setSizeTextInputValue(text)
        console.log("handleChangedSize = ", text)
        setSizeTextInputValue(text)
    }, [])

    const onChangeOrderDirection = useCallback((dir: OrderDirectionModel) => {
        setOrderDirection(dir)
    }, [])

    const onPlaceOrder = useCallback(async () => {
        console.log("onPlaceOrder")

        await analyticsLogEvent({ name: "place_order", params: {"coin": selectedAssetName ?? "selectedAssetName is null"} })

        try {

            if (agentWallet == null) {
                throw new Error(Errors.AGENT_WALLET_NOT_INIT)
            }

            console.log("selectedAssetName = ", selectedAssetName)
            if (selectedAssetName == null) {
                throw new Error(Errors.SELECTED_ASSET_NOT_INIT)
            }

            isShowLoadingView(true)

            const transport = new HttpTransport();
            const converter = await SymbolConverter.create({ transport });

            const assetId = converter.getAssetId(selectedAssetName)
            if (assetId == null) {
                isShowLoadingView(false)
                throw new Error(`${Errors.ASSET_ID_NOT_FOUND} ${selectedAssetName}`)
            }

            const szDecimals = converter.getSzDecimals(selectedAssetName); // 5
            if (szDecimals == null) {
                isShowLoadingView(false)
                throw new Error(`${Errors.SZ_DECIMALS_NOT_FOUND} ${selectedAssetName}`)
            }

            let orderPrice: string

            if (orderType == OrderTypeModel.MARKET) {

                const marketPx = assets.filter((e) => e.name == selectedAssetName)[0]?.markPx //(tradeState.l2Book[1] ?? [])[0]?.px

                if (marketPx == null) {
                    isShowLoadingView(false)
                    throw new Error("Market price is null, please open order with Limit price")
                }

                orderPrice = marketPx
            } else {
                orderPrice = priceTextInputValue
            }

            const price = formatPrice(orderPrice.replace(",", "."), szDecimals); // "97123"
            const size = formatSize(sizeTextInputValue.replace(",", "."), szDecimals); // "0.00123"
            const isLong = orderDirection == OrderDirectionModel.LONG

            console.log(`isLong = ${isLong}`)
            console.log(`price = ${price}`)
            console.log(`size = ${size}`)

            const result = await hlService.placeOrder({
                privateKey: agentWallet.key as Hex,
                assetId: assetId,
                isLong: isLong,
                price: price,
                size: size
            })

            Alert.alert(result.status, JSON.stringify(result))

            // reset inputs
            setPriceTextInputValue("")
            setSizeTextInputValue("")
            setOrderValue("")

        } catch (error) {
            alert(error)
        } finally {
            isShowLoadingView(false)
        }
    }, [agentWallet, selectedAssetName, orderDirection, orderType, priceTextInputValue, sizeTextInputValue, assets])



    // MARK: - Helpers

    function _regExpNumber(text: string): boolean {

        // 1. Быстрая проверка на посторонние символы
        if (/[^0-9,\.]/.test(text)) return false

        // 2. Проверка на точку/запятую в начале
        if (text.startsWith(',') || text.startsWith('.')) return false

        // 3. Проверка на 2 точки или 2 запятые
        if ((text.match(/,/g) || []).length > 1) return false
        if ((text.match(/\./g) || []).length > 1) return false

        // 4. Запрет точки если есть запятая и наоборот
        if (text.includes(",") && text.includes(".")) return false

        return true
    }


    // MARK: - Api

    async function getSelectedAssetLeverageData() {
        if (agentWallet == null) {
            alert("agentWallet is not init")
            return
        }
        if (selectedAssetName == null) {
            alert("selected asset is not init")
            return
        }

        setActiveAssetLeverageDataIsLoading(true)
        try {
            await hlService.getAssetLeverageData({ coin: selectedAssetName, user: agentWallet.address })
        } catch (error) {
            console.log("getSelectedAssetLeverageData error = ", error)
        } finally {
            setActiveAssetLeverageDataIsLoading(false)
        }
    }

    
    // MARK: - UI
    
    return (
        <View style={{
            flex: 6,
            //  backgroundColor: 'red',
            //  marginBottom: 3
        }}>
            <View style={{ flexDirection: 'row', height: 30, gap: 6, marginBottom: 6 }}>
                {!activeAssetLeverageDataIsLoading && selectedAssetName != null &&
                    <>
                        <TouchableOpacity
                            onPress={() => router.navigate("/choose-order-leverage-type-screen")}
                            style={{
                                flex: 8,
                                backgroundColor: COLORS.HL_BG1, borderRadius: 6, justifyContent: 'center', alignItems: 'center'
                            }}
                        ><StyledText>{activeAssetLeverageData?.marginType}</StyledText></TouchableOpacity>
                        <TouchableOpacity
                            style={{ flex: 2, backgroundColor: COLORS.HL_BG1, borderRadius: 6, justifyContent: 'center', alignItems: 'center' }}
                            onPress={() => router.navigate("/choose-order-leverage-value-screen")}
                        ><StyledText>{activeAssetLeverageData?.value}x</StyledText></TouchableOpacity>
                    </>
                }

            </View>

            <View style={{ marginBottom: 6 }}>
                <SegmentedControl
                    style={{ height: 35 }}
                    values={['Buy/Long', 'Sell/Short']}
                    selectedIndex={orderDirection == OrderDirectionModel.LONG ? 0 : 1}
                    tintColor={orderDirection == OrderDirectionModel.LONG ? COLORS.HL_GREEN : COLORS.HL_RED}
                    backgroundColor={COLORS.HL_BG1}
                    fontStyle={{ color: COLORS.PRIMARY_TEXT }}
                    activeFontStyle={{ color: COLORS.HL_TEXT_SECOND }}
                    onChange={(event) => {
                        onChangeOrderDirection(event.nativeEvent.selectedSegmentIndex == 0 ? OrderDirectionModel.LONG : OrderDirectionModel.SHORT);
                    }}
                />
            </View>

            <View style={{ flexDirection: 'row', height: 30, gap: 6, marginBottom: 6 }}>
                <TouchableOpacity onPress={() => router.navigate('/choose-order-type-screen')} style={{ flex: 8, backgroundColor: COLORS.HL_BG1, borderRadius: 6, alignItems: 'center', justifyContent: 'center' }}>
                    <StyledText>{orderType}</StyledText>
                </TouchableOpacity>
                {/* <TouchableOpacity style={{ flex: 2, backgroundColor: COLORS.HL_BG1, borderRadius: 6, alignItems: 'center', justifyContent: 'center' }}><StyledText>?</StyledText></TouchableOpacity> */}
            </View>

            {orderType == OrderTypeModel.LIMIT &&
                <View style={{ backgroundColor: COLORS.HL_BG1, marginBottom: 6, padding: 3, borderRadius: 6 }}>
                    <StyledText style={{ fontSize: 12, color: COLORS.HL_GRAY }}>Price(USDC)</StyledText>
                    <TextInput
                        style={{
                            height: 30,
                            fontSize: 14,
                            includeFontPadding: false,
                            padding: 0,
                            margin: 0,
                            textAlignVertical: 'center'
                        }}
                        keyboardType='numeric'
                        placeholderTextColor={COLORS.HL_GRAY}
                        color={COLORS.PRIMARY_TEXT}
                        onChangeText={onChangedPriceTextInput}
                        placeholder='Price'
                        value={priceTextInputValue}
                    />
                </View>
            }

            <View style={{ backgroundColor: COLORS.HL_BG1, marginBottom: 6, padding: 3, borderRadius: 6 }}>
                <StyledText style={{ fontSize: 12, color: COLORS.HL_GRAY }}>Size({selectedAssetName})</StyledText>
                <TextInput
                    style={{
                        height: 30,
                        fontSize: 14,
                        includeFontPadding: false,
                        padding: 0,
                        margin: 0,
                        textAlignVertical: 'center'
                    }}
                    keyboardType='numeric'
                    placeholderTextColor={COLORS.HL_GRAY}
                    color={'white'}
                    onChangeText={onChangedSizeTextInput}
                    placeholder='Size'
                    value={sizeTextInputValue}
                />
            </View>

            <View>
                {/* <View style={{
                    flexDirection: 'row',
                    marginBottom: 3,
                    justifyContent: 'space-between'
                }}>
                    <StyledText style={{ fontSize: 12, color: COLORS.HL_GRAY }}>Liquidation Price</StyledText>
                    <StyledText style={{ fontSize: 12 }}>N/A</StyledText>
                </View> */}

                <View style={{
                    flexDirection: 'row',
                    marginBottom: 3,
                    justifyContent: 'space-between'
                }}>
                    <StyledText style={{ fontSize: 12, color: COLORS.HL_GRAY }}>Order Value</StyledText>
                    <StyledText style={{ fontSize: 12 }}>{orderValue == "" ? "N/A" : orderValue}</StyledText>
                </View>

                <View style={{
                    flexDirection: 'row',
                    marginBottom: 3,
                    justifyContent: 'space-between'
                }}>
                    <StyledText style={{ fontSize: 12, color: COLORS.HL_GRAY }}>Slippage</StyledText>
                    <StyledText style={{ fontSize: 12 }}>Est: 0% / Max: 1,00%</StyledText>
                </View>

                {/* <View style={{
                    flexDirection: 'row',
                    marginBottom: 6,
                    justifyContent: 'space-between'
                }}>
                    <StyledText style={{ fontSize: 12, color: COLORS.HL_GRAY }}>Margin Required</StyledText>
                    <StyledText style={{ fontSize: 12 }}>N/A</StyledText>
                </View> */}

                <TouchableOpacity
                    style={{
                        height: 35,
                        borderRadius: 6,
                        backgroundColor: orderDirection == OrderDirectionModel.LONG ? COLORS.HL_GREEN : COLORS.HL_RED,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                    onPress={onPlaceOrder}
                >
                    <StyledText style={{ color: COLORS.HL_TEXT_SECOND }}>Place Order</StyledText>
                </TouchableOpacity>
            </View>
        </View>
    )
})

export default OrderView