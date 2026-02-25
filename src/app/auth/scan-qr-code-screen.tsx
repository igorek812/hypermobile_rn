import { analyticsLogEvent } from '@/src/analytics/analytics';
import StyledText from '@/src/components/styled-text';
import { COLORS } from '@/src/constants/colors';
import { useGlobalContext } from '@/src/context/global-provider';
import AgentWalletModel from '@/src/models/agent-wallet-model';
import { storeAgentWalletData } from '@/src/storage/async-storage';
import { BarcodeScanningResult, CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Alert, Linking, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ScanQrCodeScreen = () => {
  const globalContext = useGlobalContext()
  const cameraRef = useRef<CameraView | null>(null)
  const [permission, requestPermission] = useCameraPermissions();

console.log("permission = ", permission)

  // MARK: - Handlers

  useEffect(() => {
    checkPermission();
  }, []);

  const handlePermissionRequest = async () => {
    if (!permission?.canAskAgain && permission?.status !== 'granted') {
      Alert.alert(
        "Camera Access Required",
        "Please allow camera access in the app settings to scan QR codes",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Open Settings", onPress: () => Linking.openSettings() }
        ]
      );
    } else {
      await requestPermission();
    }
  }

  async function onBarcodeScanned(scanningResult: BarcodeScanningResult) {
    console.log("scanningResult.data = ", scanningResult.data)
    await cameraRef.current?.pausePreview()
    console.log("cameraRef.current?.pausePreview")

    scanQrCodeHandle(scanningResult.data)
  }


  // MARK: - Functions

  const checkPermission = async () => {
    if (!permission) {
      return;
    }

    if (!permission.granted) {
      handlePermissionRequest();
    }
  };

  const scanQrCodeHandle = async (str: string) => {
    try {
      const url = new URL(str)
      const linkValue = url.searchParams.get('link')

      if (linkValue != null) {

        // base64 str to str
        const decodedLinkValue = atob(linkValue);

        // str to json
        const json = JSON.parse(decodedLinkValue)

        const agentWalletResult: AgentWalletModel = {
          address: json.address,
          key: json.key
        }

        await storeAgentWalletData(json)

        globalContext.setAgentWallet(agentWalletResult)

        // router.replace("/")
        router.replace('/trade-screen')

        analyticsLogEvent({ name: "scan_qr_code_success" })

      } else {
        await analyticsLogEvent({ name: "scan_qr_code_error" })
        throw new Error("Wrong link")
      }

    } catch (error) {
      alert(error)
    }
  }


  // MARK: - UI

  if (!permission) {
    return (
      <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
        <View style={styles.container}>
          <StyledText>Requesting camera permission...</StyledText>
        </View>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
        <View style={[styles.container, {justifyContent: 'center', alignItems: 'center', gap: 12}]}>
          <StyledText>No access to camera</StyledText>
          <TouchableOpacity
            style={{backgroundColor: COLORS.HL_GREEN, paddingVertical: 5, paddingHorizontal: 15, borderRadius: 6, height: 35, justifyContent: 'center'}}
            onPress={checkPermission}
          >
            <StyledText style={{color: COLORS.HL_TEXT_SECOND}}>Grant Permission</StyledText>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <View style={styles.container}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          barcodeScannerSettings={{
            barcodeTypes: ['qr']
          }}
          // onCameraReady={() => {setIsLoading(false)}}
          onBarcodeScanned={onBarcodeScanned}
        // autofocus='on'
        />
        <View style={styles.bgView}>
          <View style={styles.bgViewTop} >
            <StyledText style={styles.bgViewTopText}>Click to QR code icon [] in the top right corner on desctop to generate a QR code to scan</StyledText>
          </View>
          <View style={styles.bgViewCenter}>
            <View style={styles.bgViewCenterContentView} />
          </View>
          <View style={styles.bgViewBottom} />

        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  bgView: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  bgViewTop: {
    flex: 1,
    backgroundColor: COLORS.HL_BG1_05,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  bgViewTopText: {
    textAlign: 'center'
  },
  bgViewCenter: {
    flex: 2,
    flexDirection: 'row',
    borderWidth: 5,
    borderColor: COLORS.HL_BG1_05
  },
  bgViewCenterContentView: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY_TEXT,
    borderRadius: 10
  },
  bgViewBottom: {
    flex: 1,
    backgroundColor: COLORS.HL_BG1_05
  }
});

export default ScanQrCodeScreen
