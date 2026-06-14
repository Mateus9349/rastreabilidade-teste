import React from "react";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import { Card, useTheme } from "react-native-paper";

type AppCardMode = "elevated" | "outlined" | "contained";
type AppCardElevation = 0 | 1 | 2 | 3 | 4 | 5;

interface AppCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  mode?: AppCardMode;
  elevation?: AppCardElevation;
  onPress?: () => void;
  disabled?: boolean;
  testID?: string;
}

const AppCard: React.FC<AppCardProps> = ({
  children,
  style,
  contentStyle,
  mode = "elevated",
  elevation = 2,
  onPress,
  disabled,
  testID,
}) => {
  const theme = useTheme();

  const cardStyle = [
    styles.card,
    {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.outline,
    },
    style,
  ];

  if (mode === "elevated") {
    return (
      <Card
        mode="elevated"
        elevation={elevation}
        style={cardStyle}
        onPress={onPress}
        disabled={disabled}
        testID={testID}
      >
        <Card.Content style={[styles.content, contentStyle]}>
          {children}
        </Card.Content>
      </Card>
    );
  }

  return (
    <Card
      mode={mode}
      style={cardStyle}
      onPress={onPress}
      disabled={disabled}
      testID={testID}
    >
      <Card.Content style={[styles.content, contentStyle]}>
        {children}
      </Card.Content>
    </Card>
  );
};

export default AppCard;

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 20,
  },
  content: {
    paddingVertical: 20,
  },
});