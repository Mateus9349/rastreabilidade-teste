import { useState } from 'react';
import { LoteService } from '../../services/LoteService';
import { ILote } from '../../interfaces/Lote';

export const useAtualizarLote = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const atualizarLote = async (id: number, loteAtualizado: ILote) => {
    setLoading(true);
    try {
      await LoteService.atualizarLote(id, loteAtualizado);
    } catch (err) {
      setError(`Erro ao atualizar lote com id ${id}`);
    } finally {
      setLoading(false);
    }
  };

  return { atualizarLote, loading, error };
};
