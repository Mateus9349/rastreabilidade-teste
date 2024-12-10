import api from './api';

interface ILote {
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
  peixes: number[]; // IDs dos peixes pertencentes ao lote
  ativo: number; // Status do lote (1 para ativo, 0 para inativo)
  recebidoSalgadeira: boolean; // Indica se o lote foi recebido na salgadeira
  createdBy: string; // Usuário que está cadastrando o lote  
}


export class LoteService {
  static async buscarLotes(): Promise<ILote[]> {
    try {
      const response = await api.get<ILote[]>('/batches');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar lotes:', error);
      throw error;
    }
  }

  static async buscarLotePorId(id: number): Promise<ILote> {
    try {
      const response = await api.get<ILote>(`/batches/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar o lote com id ${id}:`, error);
      throw error;
    }
  }

  static async criarLote(lote: ILote): Promise<ILote> {
    try {
      console.log(lote)
      const response = await api.post<ILote>('/batches', lote);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar lote:', error);
      throw error;
    }
  }

  static async atualizarLote(id: number, lote: ILote): Promise<ILote> {
    try {
      const response = await api.put<ILote>(`/batches/${id}`, lote);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar o lote com id ${id}:`, error);
      throw error;
    }
  }

  static async excluirLote(id: number): Promise<void> {
    try {
      await api.delete(`/batches/${id}`);
    } catch (error) {
      console.error(`Erro ao excluir o lote com id ${id}:`, error);
      throw error;
    }
  }
}
