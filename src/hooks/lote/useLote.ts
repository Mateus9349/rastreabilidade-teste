import { useEffect, useState } from 'react';
import { LoteService } from '../../services/LoteService';
import { ILoteDTO } from '../../interfaces/DTO/Lote.DTO';

export const useLote = (id: number) => {
  const [lote, setLote] = useState<ILoteDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLote = async () => {
      setLoading(true);
      try {
        const data = await LoteService.buscarLotePorId(id);
        setLote(data);
      } catch (err) {
        setError(`Erro ao buscar o lote com id ${id}`);
      } finally {
        setLoading(false);
      }
    };

    fetchLote();
  }, [id]);

  return { lote, loading, error };
};
