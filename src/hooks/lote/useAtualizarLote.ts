import { useState } from 'react';
import { LoteService } from '../../services/LoteService';
import { ILoteDTO } from '../../interfaces/DTO/Lote.DTO';

export const useAtualizarLote = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const atualizarLote = async (id: number, loteAtualizado: Partial<ILoteDTO>) => {
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
