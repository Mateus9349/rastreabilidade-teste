import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
      width: 155,
      height: 180,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 16,
      overflow: "hidden", // Garante que o gradiente respeite as bordas
      borderColor: 'grey',
      borderWidth: 1
    },
    gradient: {
      width: "100%",
      height: "100%",
      justifyContent: "center",
      alignItems: "center",
    },
    content: {
      width: "100%",
      height: "100%",
      paddingVertical: 32,
      paddingHorizontal: 16,
    },
    containerImagemText: {
      flexDirection: "column",
      alignItems: "center",
      alignSelf: "stretch",
      marginBottom: 8,
    },
    image: {
      width: 46,
      height: 46,
      marginBottom: 8,
    },
    title: {
      alignSelf: "stretch",
      color: "#FFFFFF",
      textAlign: "center",
      fontFamily: "Inter",
      fontSize: 13,
      fontStyle: "normal",
      fontWeight: "700",
    },
    text: {
      alignSelf: "stretch",
      color: "#BFC6D6",
      textAlign: "center",
      fontFamily: "Inter",
      fontSize: 11,
      fontStyle: "normal",
      fontWeight: "300",
      lineHeight: 13.2,
    },
  });