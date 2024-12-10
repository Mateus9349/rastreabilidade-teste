import { useState } from 'react';
import { PeixeService } from '../../services/PeixeService';
import { IPeixe } from '../../interfaces/Peixe';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IUser } from '../../interfaces/User';

export interface IPeixeBackEnd {
  especie: string; // Espécie do peixe
  cat: string; // Categoria do peixe
  lacre: string; // Código único do lacre, padrão UUID
  sexo: string; // Sexo do peixe
  unidade: string; // Unidade de medida associada ao peixe
  gona: string; // Estado da gonada
  comprimento: string; // Comprimento do peixe
  peso: string; // Peso do peixe
  hPesca: string; // Horário da pesca
  lago: string; // Nome do lago de origem
  comunidade: string; // Nome da comunidade de origem
  hEvisceramento: string; // Horário de evisceração do peixe
  hChegadaSalgadeira: string; // Horário de chegada do peixe na salgadeira
  createdBy: string; // Usuário que está cadastrando o peixe
  status: "PENDING" | "CONFIRMED"; // Status do peixe ("PENDING" ou "CONFIRMED")
}


export const useCriarPeixe = () => {
  const [loadingPeixe, setLoading] = useState<boolean>(false);
  const [errorPeixe, setError] = useState<string | null>(null);

  const criarPeixe = async (novoPeixe: IPeixe) => {
    setLoading(true);

    const peixeBackEnd: IPeixeBackEnd = {
      especie: novoPeixe.especie,
      cat: novoPeixe.cat,
      lacre: novoPeixe.lacre,
      sexo: novoPeixe.sexo,
      unidade: novoPeixe.unidade,
      gona: novoPeixe.gona,
      comprimento: novoPeixe.comprimento,
      peso: novoPeixe.peso,
      hPesca: novoPeixe.hPesca,
      lago: novoPeixe.lago,
      comunidade: novoPeixe.comunidade,
      hEvisceramento: novoPeixe.hEvisceramento,
      hChegadaSalgadeira: novoPeixe.hChegadaSalgadeira || "",
      createdBy: "",
      status: "PENDING",
    };

    const user = await AsyncStorage.getItem('@myapp:user');
    if (user) {
      const parsedUser = JSON.parse(user) as IUser;
      peixeBackEnd.createdBy = parsedUser.email; // Apenas o nome do usuário
    }

    try {
      await PeixeService.criarPeixe(peixeBackEnd);
    } catch (err) {
      setError('Erro ao criar peixe');
      throw err;

    } finally {
      setLoading(false);
    }
  };

  return { criarPeixe, loadingPeixe, errorPeixe };
};
