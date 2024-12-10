import { useEffect, useState } from 'react';
import { PeixeService } from '../../services/PeixeService';
import { IPeixe } from '../../interfaces/Peixe';

export const usePeixes = () => {
  const [peixes, setPeixes] = useState<IPeixe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPeixes = async () => {
      setLoading(true);
      try {
        const data = await PeixeService.buscarPeixes();
        setPeixes(data);
      } catch (err) {
        setError('Erro ao buscar peixes');
      } finally {
        setLoading(false);
      }
    };

    fetchPeixes();
  }, []);

  return { peixes, loading, error };
};
