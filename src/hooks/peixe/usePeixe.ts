import { useEffect, useState } from 'react';
import { PeixeService } from '../../services/PeixeService';
import { IPeixe } from '../../interfaces/Peixe';

export const usePeixe = (id: number) => {
  const [peixe, setPeixe] = useState<IPeixe | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPeixe = async () => {
      setLoading(true);
      try {
        const data = await PeixeService.buscarPeixePorId(id);
        setPeixe(data);
      } catch (err) {
        setError(`Erro ao buscar o peixe com id ${id}`);
      } finally {
        setLoading(false);
      }
    };

    fetchPeixe();
  }, [id]);

  return { peixe, loading, error };
};
