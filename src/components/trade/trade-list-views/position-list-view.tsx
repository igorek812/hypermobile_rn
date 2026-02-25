import { COLORS } from "@/src/constants/colors"
import Errors from "@/src/constants/errors"
import { useGlobalContext } from "@/src/context/global-provider"
import AssetPositionModel from "@/src/models/asset-position-model"
import hlService from "@/src/services/hl-service"
import { tradeSliceActions } from "@/src/services/trade-redux"
import { useAppSelector } from "@/src/store/store"
import { memo, useState } from "react"
import { ActivityIndicator, Alert, FlatList, TouchableOpacity, View } from "react-native"
import { useDispatch } from "react-redux"
import StyledText from "../../styled-text"

const PositionListView = memo(() => {
    console.log("PositionListView render")

    const assetPositions = useAppSelector((state) => state.trade.assetPositions)
    const dispatcher = useDispatch()

    const onPressAsset = (coinName: string) => {
        console.log(coinName)
        dispatcher(tradeSliceActions.setSelectedAssetName(coinName))
    }

    if (assetPositions.length == 0) {
        return <View style={{ marginLeft: 10 }}><StyledText>No positions yet</StyledText></View>
    }

    return (
        <View>
            <FlatList
                id='positions_list_id'
                scrollEnabled={false}
                showsHorizontalScrollIndicator={true}
                data={assetPositions}
                renderItem={({ item }) => (<PositionListItemView item={item} onPressAsset={() => onPressAsset(item.position.coin)} />)}
            />
        </View>
    )
})

export default PositionListView


// MARK: - Item

const PositionListItemView = memo(({ item, onPressAsset }: { item: AssetPositionModel, onPressAsset: () => void }) => {
    console.log("PositionListItemView render. item = ", item)

    const { agentWallet } = useGlobalContext()
    
    const [isLoading, setIsLoading] = useState(false)

    const positionColor = Number(item.position.szi) > 0 ? COLORS.HL_GREEN : COLORS.HL_RED

    // const roe = String(format: "%.2f", (Double(cellModel.position.returnOnEquity) ?? 0)*100)
    const roe = Number(item.position.returnOnEquity) * 100
    const pnl = Number(item.position.unrealizedPnl)//.toDouble().formatToHlStyle()
    const pnlColor = pnl > 0 ? COLORS.HL_GREEN : COLORS.HL_RED

    const fundingValue = Number(item.position.cumFunding.sinceOpen.replace("-", ""))
    const fundingColor = Number(item.position.cumFunding.sinceOpen) > 0 ? COLORS.HL_RED : COLORS.HL_GREEN


    // MARK: - Handlers

    const onPressMarketClose = () => {
        Alert.alert(`Close ${item.position.coin} by market price?`, "", [
            { text: "Cancel" },
            {
                text: "Confirm",
                onPress: () => {
                    closeByMarketHandle()
                }
            }
        ])
    }

    const onPressLimitClose = () => {
        alert("Soon..")
    }


    // MARK: - Functions

    const closeByMarketHandle = async () => {
        try {

            if (agentWallet == null) {
                throw new Error(Errors.AGENT_WALLET_NOT_INIT)
            }

            setIsLoading(true)

            await hlService.closeByMarket({ privateKey: agentWallet.key, asset: item })

        } catch (error) {
            alert(error)
        } finally {
            setIsLoading(false)
        }
    }


    // MARK: - UI

    return (
        <View style={{ backgroundColor: COLORS.HL_BG1, borderColor: COLORS.HL_BORDER, borderWidth: 1, borderRadius: 6, marginBottom: 5, marginHorizontal: 5, padding: 10 }}>

            {/* First row */}
            <View style={{ flexDirection: 'row', justifyContent: "space-between", marginBottom: 10 }}>
                <TouchableOpacity style={{ flex: 1 }} onPress={onPressAsset}>
                    <StyledText style={{ fontSize: 12, color: COLORS.HL_GRAY }}>Coin</StyledText>
                    <StyledText style={{ color: positionColor, fontWeight: 'bold' }} numberOfLines={1}>{item.position.coin} {item.position.leverage.value}x</StyledText>
                </TouchableOpacity>

                <View style={{ flex: 1 }}>
                    <StyledText style={{ fontSize: 12, color: COLORS.HL_GRAY }}>Size</StyledText>
                    <StyledText style={{ color: positionColor }} numberOfLines={1}>${item.position.szi.replace("-", "")} {item.position.coin}</StyledText>
                </View>

                <TouchableOpacity style={{ flex: 1 }}>
                    <StyledText style={{ fontSize: 12, color: COLORS.HL_GRAY }}>PNL (ROE %)</StyledText>
                    <StyledText style={{ color: pnlColor }} numberOfLines={1}>${pnl.toFixed(2)} ({roe.toFixed(2)}%)</StyledText>
                </TouchableOpacity>
            </View>

            {/* Second row */}
            <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                <View style={{ flex: 1 }}>
                    <StyledText style={{ fontSize: 12, color: COLORS.HL_GRAY }}>Enry Price</StyledText>
                    <StyledText numberOfLines={1}>{item.position.entryPx}</StyledText>
                </View>

                <View style={{ flex: 1 }}>
                    <StyledText style={{ fontSize: 12, color: COLORS.HL_GRAY }}>Mark Price</StyledText>
                    <StyledText numberOfLines={1}>{item.position.markPx != null ? item.position.markPx : "-"}</StyledText>
                </View>

                <View style={{ flex: 1 }}>
                    <StyledText style={{ fontSize: 12, color: COLORS.HL_GRAY }}>Liq. Price</StyledText>
                    <StyledText numberOfLines={1}>{item.position.liquidationPx ?? "N/A"}</StyledText>
                </View>
            </View>

            {/* Thirds row */}
            <View style={{ flexDirection: 'row', justifyContent: "space-between", marginBottom: 10 }}>
                <View style={{ flex: 1 }}>
                    <StyledText style={{ fontSize: 12, color: COLORS.HL_GRAY }}>Position Value</StyledText>
                    <StyledText numberOfLines={1}>{Number(item.position.positionValue).toFixed(2)} USDC</StyledText>
                </View>

                <View style={{ flex: 1 }}>
                    <StyledText style={{ fontSize: 12, color: COLORS.HL_GRAY }}>Margin</StyledText>
                    <StyledText numberOfLines={2}>${Number(item.position.marginUsed).toFixed(2)} ({item.position.leverage.type.charAt(0).toUpperCase() + item.position.leverage.type.slice(1)})</StyledText>
                </View>

                <TouchableOpacity style={{ flex: 1 }}>
                    <StyledText style={{ fontSize: 12, color: COLORS.HL_GRAY }}>TP/SL</StyledText>
                    <StyledText numberOfLines={1}>??</StyledText>
                </TouchableOpacity>
            </View>

            {/* Fourth row */}
            <View style={{ marginBottom: 10 }}>
                <StyledText style={{ fontSize: 12, color: COLORS.HL_GRAY }}>Funding</StyledText>
                <StyledText style={{ color: fundingColor }} numberOfLines={1}>${fundingValue.toFixed(2)}</StyledText>
            </View>

            {/* Fifth row */}
            <View style={{ flexDirection: 'row', justifyContent: "flex-end", gap: 20 }}>
                {isLoading
                    ? <ActivityIndicator color={COLORS.PRIMARY_TEXT} size={'small'} />
                    : <>
                        <TouchableOpacity onPress={onPressLimitClose}>
                            <StyledText style={{ fontSize: 12, color: COLORS.HL_GREEN }}>Limit Close</StyledText>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={onPressMarketClose}>
                            <StyledText style={{ fontSize: 12, color: COLORS.HL_GREEN }}>Market Close</StyledText>
                        </TouchableOpacity>
                    </>
                }
            </View>

        </View>
    )
})
