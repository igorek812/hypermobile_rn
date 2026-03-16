// import analytics from '@react-native-firebase/analytics';
import { trackEvent } from "@aptabase/react-native";

export const analyticsLogEvent = async (
    { name, params }:
        // { name: string, params?: { [key: string]: any }, }
        { name: string, params?: Record<string, string | number | boolean> }
) => {
    // await analytics().logEvent(name, params)
        trackEvent(name, params);
}
