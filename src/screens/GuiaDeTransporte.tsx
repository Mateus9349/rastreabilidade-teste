import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import CardGuiaDeTransporte from '../components/CardGuiaDeTransporte';
import { useSQLiteContext } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as loteSchema from '../database/schemas/loteSchema';
import { eq } from 'drizzle-orm';

type Props = NativeStackScreenProps<RootStackParamList, 'GuiaDeTransporte'>;

export default function GuiaDeTransporte({ navigation }: Props) {
  const [lotes, setLotes] = useState<Object[] | undefined>(undefined);

  const database = useSQLiteContext();
  const db = drizzle(database, { schema: loteSchema });

  async function fetchLotes() {
    try {
      const response = await db.query.lote.findMany();
      console.log(response[0].peixes);
      setLotes(response);
    } catch (error) {
      console.log(error);
    }
  }

  async function removeLote(id: number | undefined) {
    if (id === undefined || id === 0) {
      // Exibir uma mensagem de erro ou não fazer nada
      Alert.alert("Erro", "ID inválido.");
      return;
    }

    try {
      Alert.alert("Remover", "Deseja remover?", [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Sim",
          onPress: async () => {
            try {
              await db
                .delete(loteSchema.lote)
                .where(eq(loteSchema.lote.id, id)); // Ajuste conforme a sintaxe correta da Drizzle ORM

              await fetchLotes();
            } catch (error) {
              console.log(error);
            }
          },
        },
      ]);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchLotes();
  }, [])

  return (
    <>
      <CardGuiaDeTransporte
        lotes={lotes}
        remove={removeLote}
      />
    </>
  );
}