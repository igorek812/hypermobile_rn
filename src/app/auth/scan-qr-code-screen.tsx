import { BarcodeScanningResult, CameraView, CameraViewRef } from 'expo-camera';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const ScanQrCodeScreen = () => {
    const cameraRef = useRef<CameraViewRef>(null)

    const [isLoading, setIsLoading] = useState(true)
    const [qrCodeData, setQrCodeData] = useState<string | null>(null)

    async function onBarcodeScanned(scanningResult: BarcodeScanningResult) {
        console.log(scanningResult.data)
        await cameraRef.current?.pausePreview()
        console.log("!@#!@#!@!@#!@#!@")
        setIsLoading(false)
        setQrCodeData(scanningResult.data)
        // ameraViewRef.pausePreview()
        // cameraRef.current?.pausePreview()
        // router.dismiss()
    }

    useEffect(() => {
        console.log(`CHECK, qrCodeData = ${qrCodeData}; isLoading = ${isLoading}`)

        if (qrCodeData == null && isLoading) {
            console.log('asdasdasd')
            return
        }

        async function koko() {
            console.log("FINISH")
            // await cameraRef.current?.pausePreview()
            router.setParams({test: "123"})
            router.dismiss()
        }

        koko()

    }, [isLoading, qrCodeData])


    return (
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
            <View>
                <Text>KOKOKO</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 64,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    width: '100%',
    paddingHorizontal: 64,
  },
  button: {
    flex: 1,
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default ScanQrCodeScreen