import StyledText from "@/src/components/styled-text";
import AssetModel from "@/src/models/asset-model";
import { setSelectedAsset } from "@/src/services/trade-redux";
import { useAppSelector } from "@/src/store/store";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
const numeral = require('numeral');

const ChooseTradePairScreen = () => {

    const [assets, setAssets] = useState<AssetModel[]>([])
    const [searchQ, setSearchQ] = useState('')
    const originalAssets = useAppSelector((state) => state.ws.assets)
    const dispatcher = useDispatch()

    useEffect(() => {
        updateAssets()
    }, [originalAssets])

    useEffect(() => {
        updateAssets()
    }, [searchQ])

    function updateAssets() {

        const formattedSearchQ = searchQ.toLowerCase()
        let pairs: AssetModel[] = []
        
        if (formattedSearchQ.length > 0) {
            pairs = originalAssets.filter((e: AssetModel) => e.name.toLowerCase().includes(formattedSearchQ))
        } else {
            pairs = originalAssets
        }
        
        pairs.slice().sort((a: AssetModel, b: AssetModel) => (a.dayNtlVlm > b.dayNtlVlm) ? 1 : -1)
        setAssets(pairs)
    }

    return (
        <SafeAreaView 
        // edges={['bottom', 'top']}
        >
            <TextInput
                placeholder="Search"
                autoCorrect={false}
                // autoComplete={"off"}
                spellCheck={false}
                style={{
                     height: 35,
                     borderWidth: 1,
                     borderRadius: 8,
                     marginHorizontal: 5,
                     marginTop: 10,
                     borderColor: 'gray',
                     padding: 10,

                }}
                placeholderTextColor={'white'}
                cursorColor={'red'}
                selectionColor={'white'}
                color={'white'}
                onChangeText={setSearchQ}
            />
            
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: 10,
                marginTop: 15
            }}>
                <StyledText style={{color: 'gray'}}>Pair / Vol</StyledText>
                <StyledText style={{color: 'gray'}}>Price / Change</StyledText>
            </View>

            <FlatList
                data={assets}
                renderItem={(item) => (
                    <ChooseTradePairItem item={item.item} onPress={() => {
                        console.log(item.item.name)
                        dispatcher(setSelectedAsset(item.item))
                        router.dismiss()
                    }}/>
                )}
                ItemSeparatorComponent={() => (
                    <View 
                        style={{
                            backgroundColor: '#1d1d1d',
                            height: 1,
                            marginLeft: 10,
                        }}
                    />
                )}
                
            />
        </SafeAreaView>
    )
}

export default ChooseTradePairScreen;


const ChooseTradePairItem = ({item, onPress}) => {
    return(
        <TouchableOpacity 
            style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: 10,
                paddingVertical: 10,
            }}
            onPress={onPress}
        >
        <View>
            <View style={{flexDirection: 'row'}}>
                <StyledText>{item.name}-USDC</StyledText>
                <StyledText style={{marginLeft: 5, backgroundColor: 'red'}}>{item.maxLeverage}x</StyledText>
            </View>
            <StyledText>{numeral(item.dayNtlVlm).format('0.0 a').toUpperCase()}</StyledText>
        </View>

        <View style={{alignItems: 'flex-end'}}>
            <StyledText>{item.markPx}</StyledText>
            {percentChangePrice1d(item)}
        </View>
    </TouchableOpacity>
    )
}


export const percentChangePrice1d = (item: AssetModel) => {
    let val = (item.markPx-item.prevDayPx)/item.prevDayPx*100
        if (val >= 0) {
            return <StyledText style={{fontSize: 12, color: 'green'}}>{`+${numeral(val).format('0.00')}%`}</StyledText>
        }
    return <StyledText style={{fontSize: 12, color: 'red'}}>{`${numeral(val).format('0.00')}%`}</StyledText>
}