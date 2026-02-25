import analytics from '@react-native-firebase/analytics';

export const analyticsLogEvent = async (
    { name, params }:
        { name: string, params?: { [key: string]: any }, }
) => {
    await analytics().logEvent(name, params)
}
