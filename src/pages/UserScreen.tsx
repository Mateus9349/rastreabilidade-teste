import React, { useContext, useState } from "react";
import { ScrollView, Text, TextInput, Button, StyleSheet, View, TouchableOpacity } from "react-native";
import { IUser } from "../interfaces/User";
import { AuthContext } from "../contexts/AuthContext";



import { useCriarLoteCom500Auto } from "../hooks/lote/useCriarLoteCom500";
import { useSQLiteContext } from "expo-sqlite";
import * as peixeSchema from "../database/schemas/peixeSchema";
import * as loteSchema from "../database/schemas/loteSchema";
import { drizzle } from "drizzle-orm/expo-sqlite";

export default function UserScreen() {
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
      pesoMinKg: 8,      // opcional (default 5)
      pesoMaxKg: 140,    // exigência
      compMinM: 0.8,     // opcional
      compMaxM: 1.7,     // exigência
      createdBy: "Mateus",
    });

    console.log("Lote criado com 500 peixes:", res);
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Usuário não encontrado</Text>
      </View>
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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Informações do Usuário</Text>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>ID:</Text>
        <Text style={styles.value}>{user.id}</Text>
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Email:</Text>
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={editUser?.email || ""}
            onChangeText={(value) => handleInputChange("email", value)}
            keyboardType="email-address"
          />
        ) : (
          <Text style={styles.value}>{user.email}</Text>
        )}
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Nome:</Text>
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={editUser?.nome || ""}
            onChangeText={(value) => handleInputChange("nome", value)}
          />
        ) : (
          <Text style={styles.value}>{user.nome}</Text>
        )}
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Permissões:</Text>
        <Text style={styles.value}>{user.permissoes.join(", ")}</Text>
      </View>

      {isEditing && (
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Senha:</Text>
          <TextInput
            style={styles.input}
            value={editUser?.senha || ""}
            onChangeText={(value) => handleInputChange("senha", value)}
            secureTextEntry
          />
        </View>
      )}

      <View style={styles.buttonContainer}>
        {isEditing ? (
          <TouchableOpacity style={styles.buttonEdit} onPress={handleSave}>
            <Text style={styles.textButton}>Salvar</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.buttonEdit} onPress={toggleEditing}>
            <Text style={styles.textButton}>Editar</Text>
          </TouchableOpacity>
        )}
        {isEditing &&
          <TouchableOpacity style={styles.buttonEditCancel} onPress={toggleEditing}>
            <Text style={styles.textButton}>Cancelar</Text>
          </TouchableOpacity>
        }
      </View>

      <TouchableOpacity style={styles.logout} onPress={logout}>
        <Text style={styles.textButton}>Logout</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonEditCancel} onPress={lote}>
        <Text style={styles.textButton}>Cadastrar Lote</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: '#FFFFFF'
  },
  fieldContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: '#BFC6D6'
  },
  value: {
    fontSize: 16,
    color: '#EAE5FF'
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginTop: 5,
    color: '#EAE5FF'
  },
  buttonContainer: {
    width: '100%',
    marginTop: 20,
    gap: 5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    backgroundColor: '#D4A85B'
  },
  logout: {
    backgroundColor: '#871B21',
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    marginTop: 65,
  },
  buttonEdit: {
    backgroundColor: '#D4A85B',
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    marginTop: 15,
    minWidth: '100%'
  },
  buttonEditCancel: {
    backgroundColor: 'blue',
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    marginTop: 15,
    minWidth: '100%'
  },
  textButton: {
    color: '#FFFFFF',
    fontWeight: 'bold'
  }
});
