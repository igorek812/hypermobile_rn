import { StyleSheet, TouchableOpacity } from "react-native"
import { COLORS } from "../constants/colors"
import StyledText from "./styled-text"

interface StyledButtonProps {
    style: any,
    text: string,
    isLoading: boolean
    onPress: () => void,
}

const StyledButton: React.FC<StyledButtonProps> = ({ style, text, isLoading, onPress }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            disabled={isLoading}
            style={[styles.container, style]}
        >
            <StyledText style={{ color: COLORS.HL_TEXT_SECOND }}>{text}</StyledText>
        </TouchableOpacity>
    )
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.HL_GREEN,
        height: 40,
        borderRadius: 10,
        marginHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: COLORS.HL_TEXT_SECOND
    }
})

export default StyledButton