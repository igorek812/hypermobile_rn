import { StyleSheet, Text, TextProps } from 'react-native'
import { COLORS } from '../constants/colors'

const StyledText: React.FC<TextProps> = ({ style, ...props}) => {
    return <Text style={[styles.base, style]} {...props}/>
}

const styles = StyleSheet.create({
    base: {
        color: COLORS.PRIMARY_TEXT
    }
})

export default StyledText
