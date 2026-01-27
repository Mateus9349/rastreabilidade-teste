import React, { useState } from "react";
import { TouchableOpacity, View, Text, StyleSheet, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const BotaoHome = ({
  onPress,
  title,
  text,
  src,
}: {
  onPress: () => void;
  title: string;
  text: string;
  src: any;
}) => {
  const [pressed, setPressed] = useState(false);

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.buttonContainer}
      activeOpacity={1}
      onPressIn={() => setPressed(true)} // Quando pressionado
      onPressOut={() => setPressed(false)} // Quando solto
    >
      <LinearGradient
        colors={pressed ? ["#630A0E", "#871B21"] : ["rgb(95, 89, 92)", "rgb(33, 23, 28)"]} // Alterna o gradiente
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradient}
      >
        <Image style={styles.icon} source={src} />
        <View style={styles.containerText}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.text}>{text}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default BotaoHome;

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: 16,
    overflow: "hidden", // Garante que o gradiente respeite as bordas arredondadas
    marginBottom: 28,
    height: 81,
    width: 350,
  },
  gradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 32,
    height: 81,
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 16,
  },
  containerText: {
    flex: 1,
    flexDirection: "column",
    alignItems: "flex-start",
  },
  title: {
    color: "#F9F9F9",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  text: {
    color: "#F9F9F9",
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 17,
  },
});
