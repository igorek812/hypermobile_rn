import { COLORS } from "@/src/constants/colors"
import { useAppSelector } from "@/src/store/store"
import { memo } from "react"
import { FlatList, View } from "react-native"
import StyledText from "../styled-text"

const L2BookView = memo(() => {
    // console.log("L2BookView render")

    const l2Book = useAppSelector((state) => state.trade.l2Book)

    return (
        <View style={{ flex: 4, gap: 1 }}>
            <View style={{ flex: 5, marginHorizontal: 5 }}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                }}>
                    <StyledText style={{ color: COLORS.HL_GRAY, fontSize: 12 }}>Price</StyledText>
                    <StyledText style={{ color: COLORS.HL_GRAY, fontSize: 12 }}>Size</StyledText>
                </View>
                <FlatList
                    id='l2_asks_list'
                    scrollEnabled={false}
                    data={l2Book[0] ?? []}
                    renderItem={({ item }) => (
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <StyledText style={{ fontSize: 12, color: COLORS.HL_GRAY }}>{item.px}</StyledText>
                            <StyledText style={{ fontSize: 12, color: COLORS.HL_GRAY }}>{item.sz}</StyledText>
                        </View>
                    )}
                    ItemSeparatorComponent={() => (
                        <View style={{ height: 1 }} />
                    )}
                />
            </View>
            <View style={{ flex: 1, justifyContent: 'center' }}><StyledText style={{ marginLeft: 5, fontSize: 19, color: COLORS.HL_GRAY }}>{(l2Book[1] ?? [])[0]?.px ?? "-"}</StyledText></View>
            <View style={{ flex: 5, marginHorizontal: 5 }}>
                <FlatList
                    id='l2_bids_list'
                    scrollEnabled={false}
                    data={l2Book[1] ?? []}
                    renderItem={({ item }) => (
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <StyledText style={{ fontSize: 12, color: COLORS.HL_GRAY }}>{item.px}</StyledText>
                            <StyledText style={{ fontSize: 12, color: COLORS.HL_GRAY }}>{item.sz}</StyledText>
                        </View>
                    )}
                    ItemSeparatorComponent={() => (
                        <View style={{ height: 1 }} />
                    )}
                />
            </View>
        </View>
    )
})

export default L2BookView