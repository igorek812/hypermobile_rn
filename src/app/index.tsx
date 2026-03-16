import { compare } from 'compare-versions';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import { getVersion } from 'react-native-device-info';
import StyledText from '../components/styled-text';
import { COLORS } from '../constants/colors';
import { CONSTANTS } from '../constants/constants';
import { useGlobalContext } from '../context/global-provider';
import { getAgentWalletData } from '../storage/async-storage';

export default function App() {
  const { agentWallet, isLoading, setAgentWallet, setIsLoading } = useGlobalContext();

  const [configError, setConfigError] = useState<string | null>(null)


  // MARK: - Hanlers

  useEffect(() => {
    checkForceUpdate()
  }, [])

  useEffect(() => {
    console.log("isLoading = ", isLoading)

    if (isLoading) return

    async function openLoginScreen() {
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (agentWallet == null) {
        router.replace('/auth/login-screen')
      } else {
        router.replace('/trade-screen')
      }
    }

    openLoginScreen()
  }, [agentWallet, isLoading])


  // MARK: - Functions

  const checkForceUpdate = async () => {
    try {
      setConfigError(null)
      const result = await fetch(CONSTANTS.GITHUB_CONFIG_URL + `?t=${Date.now()}`)

      const jsonData = await result.json()
      const forceUpdateVersion = jsonData['forceUpdateVersion']
      const appVersion = getVersion()

      console.log("forceUpdateVersion = ", forceUpdateVersion)
      console.log("getVersion = ", getVersion())

      if (compare(forceUpdateVersion, appVersion, '>')) {
        router.replace("/force-update-screen")
      } else {
        getAgentWallet()
      }

    } catch (error: any) {
      setConfigError(error.message)
    }
  }

  async function getAgentWallet() {
    const result = await getAgentWalletData()
    console.log("agent wallet result = ", result)
    setAgentWallet(result)
    setIsLoading(false)
  }


  // MARK: - UI

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10
      }}>

      {configError == null
        ? <>
          <ActivityIndicator />
          <StyledText>Loading..</StyledText>
        </>
        : <View style={{ justifyContent: 'center', alignItems: 'center', gap: 12, flex: 1 }}>
          <StyledText>Error: {configError}</StyledText>
          <TouchableOpacity onPress={checkForceUpdate} style={{ backgroundColor: COLORS.HL_BG1, paddingVertical: 5, paddingHorizontal: 15, borderRadius: 6 }}>
            <StyledText>Repeat</StyledText>
          </TouchableOpacity>
        </View>
      }
    </View>
  );
}
