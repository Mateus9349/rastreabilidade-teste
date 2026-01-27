import React, { useState } from "react";
import { TouchableOpacity, View, Text, Image, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { styles } from "./style";

export default function BotaoPescas({
  title,
  text,
  src,
  OnPress,
}: {
  title: string;
  text: string;
  src: any;
  OnPress: () => void;
}) {
  const [pressed, setPressed] = useState(false);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={OnPress}
      onPressIn={() => setPressed(true)} // Define como pressionado
      onPressOut={() => setPressed(false)} // Define como não pressionado
    >
      {pressed ? (
        <LinearGradient
          colors={["#630A0E", "#871B21"]}
          style={styles.gradient}
        >
          <View style={styles.content}>
            <View style={styles.containerImagemText}>
              <Image style={styles.image} source={src} />
              <Text style={styles.title}>{title}</Text>
            </View>
            <Text style={styles.text}>{text}</Text>
          </View>
        </LinearGradient>
      ) : (
        <View style={styles.content}>
          <View style={styles.containerImagemText}>
            <Image style={styles.image} source={src} />
            <Text style={styles.title}>{title}</Text>
          </View>
          <Text style={styles.text}>{text}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
