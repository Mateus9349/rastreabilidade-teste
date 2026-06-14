import React, { useContext, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Surface, Text, useTheme, Divider } from "react-native-paper";
import { useSQLiteContext } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";

import { IUser } from "../interfaces/User";
import { AuthContext } from "../contexts/AuthContext";

import { useCriarLoteCom500Auto } from "../hooks/lote/useCriarLoteCom500";
import * as peixeSchema from "../database/schemas/peixeSchema";
import * as loteSchema from "../database/schemas/loteSchema";

import AppButton from "../components/ui/AppButton";
import AppInput from "../components/ui/AppInput";
import AppCard from "../components/ui/AppCard";

export default function UserScreen() {
  const theme = useTheme();
  const { user, logout } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [editUser, setEditUser] = useState<IUser | null>(user);

  /** UMA única conexão drizzle com ambos schemas */
  const database = useSQLiteContext();
  const db = drizzle(database, { schema: { ...peixeSchema, ...loteSchema } });
  const { criarLoteCom500Auto, loading } = useCriarLoteCom500Auto();

  const lote = async () => {
    const base = {
      planilha: 2026,
      comunidade: "Jussara",
      setor: "Setor A",
      assistente: "Fulano",
      barco: "Barco 01",
      data: new Date(),
      apetrechos: "Rede",
      ambiente: "Lago Macopani",
    } as const;

    const res = await criarLoteCom500Auto(db, base, {
      pesoMinKg: 8,
      pesoMaxKg: 140,
      compMinM: 0.8,
      compMaxM: 1.7,
      createdBy: "Mateus",
    });

    console.log("Lote criado com 500 peixes:", res);
  };

  if (!user) {
    return (
      <Surface style={[styles.screen, { backgroundColor: theme.colors.background }]}>
        <View style={styles.emptyContainer}>
          <Text
            variant="headlineSmall"
            style={[styles.emptyTitle, { color: theme.colors.primary }]}
          >
            Usuário não encontrado
          </Text>
        </View>
      </Surface>
    );
  }

  const handleInputChange = (field: keyof IUser, value: string) => {
    if (editUser) {
      setEditUser({ ...editUser, [field]: value });
    }
  };

  const toggleEditing = () => {
    setIsEditing(!isEditing);
    setEditUser(user);
  };

  const handleSave = () => {
    if (editUser) {
      // Aqui você pode implementar a lógica para salvar os dados atualizados (ex.: enviar ao backend).
      console.log("Usuário atualizado:", editUser);
    }

    setIsEditing(false);
  };

  return (
    <Surface style={[styles.screen, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text
          variant="headlineLarge"
          style={[styles.title, { color: theme.colors.primary }]}
        >
          Informações do Usuário
        </Text>

        <Text
          variant="bodyMedium"
          style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}
        >
          Visualize e gerencie os dados do usuário logado
        </Text>

        <AppCard style={styles.card}>
          <View style={styles.fieldContainer}>
            <Text
              variant="labelLarge"
              style={[styles.label, { color: theme.colors.onSurfaceVariant }]}
            >
              ID
            </Text>

            <Text
              variant="bodyLarge"
              style={[styles.value, { color: theme.colors.onSurface }]}
            >
              {user.id}
            </Text>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.fieldContainer}>
            <Text
              variant="labelLarge"
              style={[styles.label, { color: theme.colors.onSurfaceVariant }]}
            >
              Email
            </Text>

            {isEditing ? (
              <AppInput
                value={editUser?.email || ""}
                onChangeText={(value: string) => handleInputChange("email", value)}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
              />
            ) : (
              <Text
                variant="bodyLarge"
                style={[styles.value, { color: theme.colors.onSurface }]}
              >
                {user.email}
              </Text>
            )}
          </View>

          <Divider style={styles.divider} />

          <View style={styles.fieldContainer}>
            <Text
              variant="labelLarge"
              style={[styles.label, { color: theme.colors.onSurfaceVariant }]}
            >
              Nome
            </Text>

            {isEditing ? (
              <AppInput
                value={editUser?.nome || ""}
                onChangeText={(value: string) => handleInputChange("nome", value)}
                style={styles.input}
              />
            ) : (
              <Text
                variant="bodyLarge"
                style={[styles.value, { color: theme.colors.onSurface }]}
              >
                {user.nome}
              </Text>
            )}
          </View>

          <Divider style={styles.divider} />

          <View style={styles.fieldContainer}>
            <Text
              variant="labelLarge"
              style={[styles.label, { color: theme.colors.onSurfaceVariant }]}
            >
              Permissões
            </Text>

            <Text
              variant="bodyLarge"
              style={[styles.value, { color: theme.colors.onSurface }]}
            >
              {user.permissoes.join(", ")}
            </Text>
          </View>

          {isEditing && (
            <>
              <Divider style={styles.divider} />

              <View style={styles.fieldContainer}>
                <Text
                  variant="labelLarge"
                  style={[styles.label, { color: theme.colors.onSurfaceVariant }]}
                >
                  Senha
                </Text>

                <AppInput
                  value={editUser?.senha || ""}
                  onChangeText={(value: string) => handleInputChange("senha", value)}
                  secureTextEntry
                  style={styles.input}
                />
              </View>
            </>
          )}
        </AppCard>

        {/* <View style={styles.actions}>
          {isEditing ? (
            <AppButton mode="contained" onPress={handleSave} style={styles.button}>
              Salvar
            </AppButton>
          ) : (
            <AppButton mode="contained" onPress={toggleEditing} style={styles.button}>
              Editar
            </AppButton>
          )}

          {isEditing && (
            <AppButton
              mode="outlined"
              onPress={toggleEditing}
              style={styles.button}
              textColor={theme.colors.primary}
            >
              Cancelar
            </AppButton>
          )}
        </View> */}

        <View style={styles.footerActions}>
          <AppButton
            mode="contained-tonal"
            onPress={logout}
            style={styles.button}
            buttonColor={theme.colors.errorContainer}
            textColor={theme.colors.onErrorContainer}
          >
            Logout
          </AppButton>

          {/* <AppButton
            mode="contained"
            onPress={lote}
            style={styles.button}
            loading={loading}
            disabled={loading}
          >
            Cadastrar Lote
          </AppButton> */}
        </View>
      </ScrollView>
    </Surface>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingTop: 72,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  title: {
    fontWeight: "700",
    marginBottom: 4,
  },
  subtitle: {
    marginBottom: 28,
  },
  card: {
    marginBottom: 24,
  },
  fieldContainer: {
    gap: 6,
  },
  label: {
    fontWeight: "700",
  },
  value: {
    lineHeight: 22,
  },
  input: {
    marginTop: 2,
  },
  divider: {
    marginVertical: 16,
  },
  actions: {
    width: "100%",
    gap: 12,
  },
  footerActions: {
    width: "100%",
    gap: 12,
    marginTop: 40,
  },
  button: {
    width: "100%",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontWeight: "700",
    textAlign: "center",
  },
});