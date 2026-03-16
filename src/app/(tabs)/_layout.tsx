import { COLORS } from "@/src/constants/colors";
import { useGlobalContext } from "@/src/context/global-provider";
import webSocketServiceLib from "@/src/services/web-socket-service-lib";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as Sentry from '@sentry/react-native';
import { Tabs } from "expo-router";
import { useEffect } from "react";

Sentry.init({
  dsn: 'https://4a65fb2c4311515d41ffc2a93b9bdd28@o4510946919120896.ingest.de.sentry.io/4510946920628304',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: true,

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

const TabsLayout = () => {

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

export default Sentry.wrap(TabsLayout);