import { useEffect, useState } from 'react';
import { LoteService } from '../../services/LoteService';
import { IPeixe } from '../../interfaces/Peixe';

interface ILote {
  id?: string;
  planilha: number; // Número da planilha associada ao lote
  comunidade: string; // Nome da comunidade do lote
  setor: string; // Setor relacionado ao lote
  assistente: string; // Nome do assistente responsável pelo lote
  barco: string; // Nome do barco usado para a pesca
  data: string; // Data do lote no formato ISO 8601
  apetrechos: string; // Tipo de apetrechos usados na pesca
  ambiente: string; // Ambiente onde foi feito o lote
  quantidade: number; // Quantidade total de peixes no lote
  quantidadeF: number; // Quantidade de peixes fêmeas no lote
  quantidadeM: number; // Quantidade de peixes machos no lote
  pesoTotal: number; // Peso total do lote em kg
  peixes: IPeixe[]; // IDs dos peixes pertencentes ao lote
  ativo: number; // Status do lote (1 para ativo, 0 para inativo)
  recebidoSalgadeira: boolean; // Indica se o lote foi recebido na salgadeira
  createdBy: string; // Usuário que está cadastrando o lote  
}

export const useLotes = () => {
  const [lotes, setLotes] = useState<ILote[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLotes = async () => {
      setLoading(true);
      try {
        const data:any = await LoteService.buscarLotes();
        setLotes(data.data);
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
