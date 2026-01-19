import AsyncStorage from '@react-native-async-storage/async-storage';
import { CONSTANTS } from '../constants/constants';
import AgentWalletModel from '../models/agent-wallet-model';

const storeData = async (key: string, value: any) => {
  const jsonValue = JSON.stringify(value)
  await AsyncStorage.setItem(key, jsonValue)
};

const getData = async (key: string): Promise<any | null> => {
  const jsonValue = await AsyncStorage.getItem(key)
  return jsonValue != null ? JSON.parse(jsonValue) : null
  // return jsonValue != null ? jsonValue : null
};

const removeData = async (key: string): Promise<Error | null> => {
  let error: Error | null = null

  await AsyncStorage.removeItem(key, (resultError) => {
    if (resultError) {
      error = resultError
    }
  })
  return error
};


export const storeAgentWalletData = async (value: any) => {
  await storeData(CONSTANTS.AGENT_WALLET_KEY, value)
};

export const getAgentWalletData = async (): Promise<AgentWalletModel | null> => {
  const result = await getData(CONSTANTS.AGENT_WALLET_KEY)
  if (result != null) {
    return {
      address: result.address,
      key: result.key
    }
  }
  return null
};


export const removeAgentWalletData = async () => {
  await removeData(CONSTANTS.AGENT_WALLET_KEY)
};