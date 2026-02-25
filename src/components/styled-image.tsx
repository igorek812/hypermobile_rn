import React, { useMemo, useState } from "react";
import { ActivityIndicator, Image, View } from "react-native";
import { COLORS } from "../constants/colors";

const StyledImage = ({ style, source }: { style: any, source: any }) => {

    const [loading, setLoading] = useState(true);

    const handleLoadStart = () => {
        setLoading(true);
    };

    const handleLoadEnd = () => {
        setLoading(false);
    };

    const handleLoad = () => {
        setLoading(false);
    };

    const memorizedImage = useMemo(() => (
        <Image
            style={style}
            source={source}
            onLoadStart={handleLoadStart}
            onLoadEnd={handleLoadEnd}
            onLoad={handleLoad}
            // onError={(error) => console.log("qweqweqw = ", error)}
            // onProgress={(e) => console.log("sss = ", e)}
        />
    ), [source])

    return (
        <View>
            {loading && (
                <ActivityIndicator color={COLORS.PRIMARY_TEXT} style={{ ...style, position: 'absolute' }} />
            )}
            {memorizedImage}
        </View>
    );
};

export default StyledImage
