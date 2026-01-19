import { router } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from "react-native";

import StyledText from '../components/styled-text';
import { useGlobalContext } from '../context/global-provider';
import { getAgentWalletData } from '../storage/async-storage';

export default function App() {
  const {agentWallet, isLoading, setAgentWallet, setIsLoading} = useGlobalContext();

    useEffect(() => {
        // check agent wallet
        getAgentWallet()
    }, [])

    async function getAgentWallet() {
        const result = await getAgentWalletData()
        console.log("agent wallet result = ", result)
        setAgentWallet(result)
        setIsLoading(false)
    }

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

  return (
    <View
      style={{
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        gap: 10
      }}>
      <ActivityIndicator/>
      <StyledText>Loading..</StyledText>
    </View>
  );
}
