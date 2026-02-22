import { useThemeColors } from '@/src/hooks/useThemeColors';
import { Text, type TextProps } from 'react-native';

interface ScreenTitleProps extends TextProps {
    children: React.ReactNode;
}

export function ScreenTitle({ children, style, ...props }: ScreenTitleProps) {
    const colors = useThemeColors();

    return (
        <Text
            style={[
                {
                    fontSize: 28, // Standard profile/header title size
                    fontFamily: 'AbrilFatface_400Regular', // Default font assignment programmatically
                    color: colors.textPrimary,
                },
                style,
            ]}
            {...props}
        >
            {children}
        </Text>
    );
}
