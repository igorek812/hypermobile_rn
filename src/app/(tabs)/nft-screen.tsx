import StyledImage from '@/src/components/styled-image';
import StyledText from '@/src/components/styled-text';
import { COLORS } from '@/src/constants/colors';
import { CONSTANTS } from '@/src/constants/constants';
import Errors from '@/src/constants/errors';
import { useGlobalContext } from '@/src/context/global-provider';
import { getNftList, GetNftListItemInterface } from '@/src/services/api/opensea-service';
import { useAppDispatch, useAppSelector } from '@/src/store/store';
import Feather from '@expo/vector-icons/Feather';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Linking, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const windowWidth = Dimensions.get('window').width;

export default function NftScreen() {
    const { agentWallet } = useGlobalContext()
    const appDispatch = useAppDispatch()

    const nftList = useAppSelector(state => state.nft.data)
    const isLoading = useAppSelector(state => state.nft.isLoading)
    const getNftError = useAppSelector(state => state.nft.error)

    const [error, setError] = useState<string | null>(null)


    // MARK: - Handlers

    useEffect(() => {
        getNfts()
    }, [])

    useEffect(() => {
        setError(getNftError)
    }, [getNftError])


    // MARK: - Functions

    const getNfts = () => {
        if (agentWallet == null) {
            setError(Errors.AGENT_WALLET_NOT_INIT)
            return
        }

        const accountAddress = CONSTANTS.IS_DEV
            ? CONSTANTS.NFT_TEST_ACCOUNT
            : agentWallet.address

        appDispatch(getNftList({
            chain: 'hyperevm',
            accountAddress: accountAddress
        }))
    }


    const openOpenSeaCollection = async () => {
        const openSeaUrl = 'https://opensea.io/collection/hypurr-hyperevm'
        const supported = await Linking.canOpenURL(openSeaUrl)

        if (supported) {
            Linking.openURL(openSeaUrl)
        } else {
            alert(`Cant open url: ${openSeaUrl}`)
        }
    }


    // console.log(`nftList = ${JSON.stringify(nftList)}, isLoading = ${isLoading}, error = ${error}`)


    // MARK: - UI

    return (
        <SafeAreaView edges={["top", "bottom"]} style={{ flex: 1 }}>
            <ScrollView style={{ marginHorizontal: 6, marginVertical: 12 }}>
                <StyledText style={{ fontSize: 19, fontWeight: "bold", marginBottom: 12 }}>Your HyperEvm Nft</StyledText>

                {isLoading && <ActivityIndicator color={COLORS.PRIMARY_TEXT} />}

                {error &&
                    <View style={{ justifyContent: 'center', alignItems: 'center', gap: 12, flex: 1 }}>
                        <StyledText>{error}</StyledText>
                        <TouchableOpacity onPress={getNfts} style={{ backgroundColor: COLORS.HL_BG1, paddingVertical: 5, paddingHorizontal: 15, borderRadius: 6 }}>
                            <StyledText>Repeat</StyledText>
                        </TouchableOpacity>
                    </View>
                }

                {nftList != null &&
                    //     <FlatList
                    //     id='nft'
                    //     horizontal={true}
                    //     data={nftList.nfts}
                    //     keyExtractor={(item) => item.identifier}
                    //     renderItem={(item) => <NftItem item={item.item} />}
                    // />

                    <>
                        <View style={{
                            flex: 1,
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            // alignItems: 'flex-start'
                        }}>
                            {nftList.nfts.map((e) => <NftItem key={e.identifier} item={e} />)}
                        </View>

                        {nftList.nfts.length == 0 &&
                            <View>
                                <TouchableOpacity onPress={openOpenSeaCollection} style={{ flexDirection: 'row' }}>
                                    <StyledText>No ntf yet</StyledText>
                                    <StyledText style={{ textDecorationLine: 'underline', marginLeft: 6 }}>OpenSea</StyledText>
                                    <Feather name="arrow-up-right" size={18} color={COLORS.PRIMARY_TEXT} />
                                </TouchableOpacity>
                            </View>
                        }
                    </>
                }
            </ScrollView>
        </SafeAreaView>
    )
}

const NftItem = ({ item }: { item: GetNftListItemInterface }) => {
    const itemWidth = (windowWidth - 12) / 2

    const openOpenSeaLink = async () => {
        const openSeaUrl = `https://opensea.io/item/hyperevm/${item.contract}/${item.identifier}`

        const supported = await Linking.canOpenURL(openSeaUrl)

        if (supported) {
            Linking.openURL(openSeaUrl)
        } else {
            alert(`Cant open url: ${openSeaUrl}`)
        }
    }

    return (
        <View style={{ width: itemWidth - 4, marginHorizontal: 2, marginBottom: 15, }}>
            <StyledImage
                // source={require('./assets/photo_202411.jpg')}
                source={{ uri: item.image_url }}
                style={{ width: '100%', height: itemWidth, marginBottom: 3 }}
            />
            <StyledText
                style={{ fontSize: 16, marginBottom: 3 }}
            >{item.name}</StyledText>

            <TouchableOpacity
                style={{
                    flexDirection: 'row',

                }}
                onPress={openOpenSeaLink}
            >
                <StyledText style={{ textDecorationLine: 'underline' }}>OpenSea</StyledText>
                <Feather name="arrow-up-right" size={18} color={COLORS.PRIMARY_TEXT} />
            </TouchableOpacity>
        </View>
    )
}
