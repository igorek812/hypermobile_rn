import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast, { BaseToast } from 'react-native-toast-message';
import { Provider } from 'react-redux';
import { COLORS } from "../constants/colors";
import GlobalProvider from "../context/global-provider";
import store from "../store/store";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <GlobalProvider>
        <StatusBar barStyle={'light-content'} />
        <GestureHandlerRootView>
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: COLORS.HL_BG } }}>

            {/* SPLASH  */}
            <Stack.Screen name="index" />

            {/* AUTH FLOW */}
            <Stack.Screen name="auth/login-screen" options={{ headerShown: false, contentStyle: { backgroundColor: COLORS.HL_BG } }} />
            <Stack.Screen
              name="auth/scan-qr-code-screen"
              options={{
                presentation: 'modal',
              }}
            />

            {/* TRADE FLOW */}
            <Stack.Screen name="choose-trade-pair-screen" options={{ headerShown: false, presentation: 'modal' }} />
            <Stack.Screen name="choose-order-leverage-type-screen" options={{ headerShown: false, presentation: 'modal' }} />
            <Stack.Screen name="choose-order-leverage-value-screen" options={{ headerShown: false, presentation: 'modal' }} />
            <Stack.Screen name="choose-order-type-screen" options={{ headerShown: false, presentation: 'modal' }} />

          </Stack>
          <Toast config={toastConfig} />
        </GestureHandlerRootView>
      </GlobalProvider>
    </Provider>
  )
}

const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{ backgroundColor: COLORS.HL_BG1, borderColor: COLORS.HL_BG1, borderWidth: 1 }}
      // contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 15,
        fontWeight: '400',
        color: COLORS.PRIMARY_TEXT
      }}
    />
  )
};