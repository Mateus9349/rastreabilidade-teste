import { useEffect, useState } from 'react';
import { LoteService } from '../../services/LoteService';
import { ILote } from '../../interfaces/Lote';

export const useLotes = () => {
  const [lotes, setLotes] = useState<ILote[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLotes = async () => {
      setLoading(true);
      try {
        const data = await LoteService.buscarLotes();
        setLotes(data);
      } catch (err) {
        setError('Erro ao buscar lotes');
      } finally {
        setLoading(false);
      }
    };

    fetchLotes();
  }, []);

  return { lotes, loading, error };
};
