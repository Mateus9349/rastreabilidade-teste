import React from 'react';
import { Text, useTheme } from 'react-native-paper';
import type { ComponentProps } from 'react';

type PaperTextProps = ComponentProps<typeof Text>;

type AppTextProps = PaperTextProps & {
    color?: string;
};

export default function AppText({
    children,
    style,
    color,
    ...rest
}: AppTextProps) {
    const theme = useTheme();

    return (
        <Text
            {...rest}
            style={[
                {
                    color: color ?? theme.colors.onSurface,
                },
                style,
            ]}
        >
            {children}
        </Text>
    );
}