import { Stack } from "expo-router";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { COLORS } from "../constants/colors";
import GlobalProvider from "../context/global-provider";
import store from "../store/store";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <GlobalProvider>
        <GestureHandlerRootView>
        <Stack screenOptions={{headerShown: false, contentStyle: {backgroundColor: COLORS.HL_BG}}}>

          {/* SPLASH  */}
          <Stack.Screen name="index"/>

          {/* AUTH FLOW */}
          <Stack.Screen name="auth/login-screen" options={{headerShown: false, contentStyle: {backgroundColor: COLORS.HL_BG}}}/>
          <Stack.Screen
            name="auth/scan-qr-code-screen"
            options={{
              presentation: 'modal',
            }}
          />

          {/* TRADE FLOW */}
          <Stack.Screen name="choose-trade-pair-screen" options={{headerShown: false, presentation: 'modal'}} />

        </Stack>
        </GestureHandlerRootView>
      </GlobalProvider>
    </Provider>
  )
}
