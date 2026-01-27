import api from './api';
import { ILoteDTO, LoteOnlyDTO } from '../interfaces/DTO/Lote.DTO';

function unwrap<T>(raw: any): T {
  return raw?.data?.data ?? raw?.data ?? raw;
}

export class LoteService {
  static async buscarLotes(): Promise<ILoteDTO[]> {
    const { data } = await api.get('/batches');
    return unwrap<ILoteDTO[]>(data);
  }

  static async buscarLotePorId(id: number): Promise<ILoteDTO> {
    const { data } = await api.get(`/batches/${id}`);
    return unwrap<ILoteDTO>(data);
  }

  // Aqui usamos LoteOnlyDTO na criação
  static async criarLote(payload: LoteOnlyDTO) {
    const { data } = await api.post('/batches', payload);
    return data; // pode vir { data: {...} } dependendo do seu backend
  }

  static async atualizarLote(id: number, lote: Partial<ILoteDTO>): Promise<ILoteDTO> {
    const { data } = await api.put(`/batches/${id}`, lote);
    return unwrap<ILoteDTO>(data);
  }

  static async excluirLote(id: number): Promise<void> {
    await api.delete(`/batches/${id}`);
  }
}
