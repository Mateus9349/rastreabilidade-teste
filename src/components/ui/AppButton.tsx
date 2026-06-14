import React from 'react';
import { Button, ButtonProps, useTheme } from 'react-native-paper';

type AppButtonProps = ButtonProps & {
    children: React.ReactNode;
};

export default function AppButton({
    children,
    mode = 'contained',
    ...rest
}: AppButtonProps) {
    const theme = useTheme();

    return (
        <Button
            mode={mode}
            contentStyle={{ height: 48 }}
            style={{ borderRadius: theme.roundness }}
            labelStyle={{ fontWeight: '600' }}
            {...rest}
        >
            {children}
        </Button>
    );
}