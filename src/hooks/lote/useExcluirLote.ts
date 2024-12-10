import { useState } from 'react';
import { LoteService } from '../../services/LoteService';

export const useExcluirLote = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const excluirLote = async (id: number) => {
    setLoading(true);
    try {
      await LoteService.excluirLote(id);
    } catch (err) {
      setError(`Erro ao excluir lote com id ${id}`);
    } finally {
      setLoading(false);
    }
  };

  return { excluirLote, loading, error };
};
