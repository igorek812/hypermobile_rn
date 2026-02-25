import { COLORS } from "@/src/constants/colors";
import { useGlobalContext } from "@/src/context/global-provider";
import webSocketServiceLib from "@/src/services/web-socket-service-lib";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Tabs } from "expo-router";
import { useEffect } from "react";

export default function TabsLayout() {

  const { agentWallet } = useGlobalContext();

  useEffect(() => {
    console.log("TABS!!")
    if (agentWallet != null) {
      webSocketServiceLib.connect()
      webSocketServiceLib.subscribeToWebData2({ user: agentWallet.address })
      webSocketServiceLib.subscribeToFundingHistory({ user: agentWallet.address })
      webSocketServiceLib.subscribeToOrderHistory({ user: agentWallet.address })
      webSocketServiceLib.subscribeToUserTradeHistory({ user: agentWallet.address })
    } else {
      console.log("agentWallet NULL!!!")
    }

    // return () => {
    //   console.log("webSocketRepository.disconnect")
    //   // webSocketRepository.disconnect()
    // }
  }, [])


  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.HL_GREEN,
        tabBarStyle: {
          backgroundColor: COLORS.HL_BG,
          borderColor: COLORS.HL_BG
        },
        sceneStyle: { backgroundColor: COLORS.HL_BG }
      }}
    >
      <Tabs.Screen
        name="market-screen"
        options={{
          headerShown: false,
          title: "Market",
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="chart-areaspline" size={18} color={color} />
        }}
      />
      <Tabs.Screen
        name="trade-screen"
        options={{
          headerShown: false,
          title: "Trade",
          tabBarIcon: ({ color }) => <FontAwesome5 name="coins" size={18} color={color} />
        }}
      />
      <Tabs.Screen
        name="nft-screen"
        options={{
          headerShown: false,
          title: "Nft",
          tabBarIcon: ({ color }) => <FontAwesome name="picture-o" size={18} color={color} />
        }}
      />
      <Tabs.Screen
        name="account-screen"
        options={{
          title: "Account",
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="account-circle-outline" size={20} color={color} />
        }}

      // options={{title: "", headerRight: () => (<TouchableOpacity><StyledText>12</StyledText></TouchableOpacity>), headerStyle: {backgroundColor: COLORS.HL_BG}}}
      />
    </Tabs>
  )
}
