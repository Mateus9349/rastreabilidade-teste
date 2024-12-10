import { useState } from 'react';
import { LoteService } from '../../services/LoteService';
import { ILote } from '../../interfaces/Lote';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IUser } from '../../interfaces/User';

export const useCriarLote = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const criarLote = async (novoLote: ILote) => {
    setLoading(true);
    try {
      // Certifique-se de que `peixes` seja um array de números
      const peixesArray = typeof novoLote.peixes === 'string'
        ? JSON.parse(novoLote.peixes) // Parse string JSON para array, caso seja string
        : novoLote.peixes;

      const loteParaEnvio: any = {
        ...novoLote,
        pesoTotal: Number(novoLote.pesoTotal),
        peixes: Array.isArray(peixesArray)
          ? peixesArray.map((peixe: any) => Number(peixe))
          : [],
        recebidoSalgadeira: false,
      };

      const user = await AsyncStorage.getItem('@myapp:user');
      if (user) {
        const parsedUser = JSON.parse(user) as IUser;
        loteParaEnvio.createdBy = parsedUser.email; // Apenas o nome do usuário
      }

      console.log(loteParaEnvio); // Para verificação do payload final
      await LoteService.criarLote(loteParaEnvio);
    } catch (err) {
      setError('Erro ao criar lote');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { criarLote, loading, error };
};
