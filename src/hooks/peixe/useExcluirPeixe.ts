import { useState } from 'react';
import { PeixeService } from '../../services/PeixeService';

export const useExcluirPeixe = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const excluirPeixe = async (id: number) => {
    setLoading(true);
    try {
      await PeixeService.excluirPeixe(id);
    } catch (err) {
      setError(`Erro ao excluir peixe com id ${id}`);
    } finally {
      setLoading(false);
    }
  };

  return { excluirPeixe, loading, error };
};
