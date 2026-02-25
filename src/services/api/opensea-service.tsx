import { Dispatch } from "@reduxjs/toolkit"
import { nftSliceActions } from "../redux/opensea-redux"

export const getNftList = ({ chain, accountAddress }: { chain: "hyperevm", accountAddress: string }) => async (dispatch: Dispatch) => {
    dispatch(nftSliceActions.setIsLoading())

    try {
        const result = await fetch(`https://api.opensea.io/api/v2/chain/${chain}/account/${accountAddress}/nfts`, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'accept': '*/*',
                'x-api-key': '0501a72914ff473aac2ca69b0eeabf5b',
            },
        })

        const jsonData = await result.json()

        console.log("jsonData = ", jsonData)

        if (jsonData['nfts'] != null) {
            dispatch(nftSliceActions.setNftData(jsonData))
        } else if (jsonData['errors'] != null) {
            dispatch(nftSliceActions.setError(`Unowned error: ${JSON.stringify(jsonData['errors'])}`))
        } else {
            dispatch(nftSliceActions.setError(`Unowned error: ${JSON.stringify(jsonData)}`))
        }

    } catch (error) {

        console.log("jsonData = ", error)

        // @ts-ignore
        dispatch(nftSliceActions.setError(error.message))
    }
}

export interface GetNftListResponseInterface {
    nfts: GetNftListItemInterface[]
    next: string | null
}

export interface GetNftListItemInterface {
    identifier: string
    collection: string
    contract: string
    token_standard: string
    name: string
    description: string
    image_url: string
    display_image_url: string
    display_animation_url: string | null
    metadata_url: string
    opensea_url: string
    updated_at: string
    is_disabled: boolean
    is_nsfw: boolean
    original_image_url: string
    original_animation_url: string | null
}