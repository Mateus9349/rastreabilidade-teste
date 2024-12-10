import { useState } from 'react';
import { PeixeService } from '../../services/PeixeService';
import { IPeixe } from '../../interfaces/Peixe';

export const useAtualizarPeixe = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const atualizarPeixe = async (id: number, peixeAtualizado: IPeixe) => {
    setLoading(true);
    try {
      await PeixeService.atualizarPeixe(id, peixeAtualizado);
    } catch (err) {
      setError(`Erro ao atualizar o peixe com id ${id}`);
    } finally {
      setLoading(false);
    }
  };

  return { atualizarPeixe, loading, error };
};
