// services/PeixeService.ts
import api from './api';
import { IPeixe } from '../interfaces/Peixe';
import { IPeixeDTO } from '../interfaces/DTO/Peixe.DTO';

type CriarPeixePayload = Omit<IPeixeDTO, 'loteId' | 'lacre' | 'sexo'> & {
  lacre: string | number;
  sexo: string;
  loteId?: number;
};

export class PeixeService {
  static async buscarPeixes(): Promise<IPeixe[]> {
    try {
      const response = await api.get<IPeixe[]>('/fishes');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar peixes:', error);
      throw error;
    }
  }

  static async buscarPeixePorId(id: number): Promise<IPeixe> {
    try {
      const response = await api.get<IPeixe>(`/fishes/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar o peixe com id ${id}:`, error);
      throw error;
    }
  }

  // cria UM peixe (segue disponível caso precise)
  static async criarPeixe(peixe: CriarPeixePayload): Promise<IPeixe> {
    try {
      const response = await api.post<IPeixe>('/fishes', peixe);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        console.error('Erro ao criar peixe - Dados:', error.response.data);
        console.error('Erro ao criar peixe - Status:', error.response.status);
      } else {
        console.error('Erro na requisição:', error.message);
      }
      throw error;
    }
  }

  // cria VÁRIOS peixes de uma vez
  static async criarPeixesBulk(peixes: IPeixeDTO[]): Promise<IPeixe[]> {
    try {
      // A maioria dos backends NestJS para batch espera um ARRAY puro no body:
      // body: IPeixeDTO[]
      const response = await api.post<IPeixe[]>('/fishes/batch', peixes);

      // Se seu backend, por acaso, espera um wrapper (ex.: { createFishDto: IPeixeDTO[] }),
      // troque a linha acima por:
      // const response = await api.post<IPeixe[]>('/fishes/batch', { createFishDto: peixes });

      return response.data;
    } catch (error: any) {
      if (error.response) {
        console.error('Erro ao criar peixes (bulk) - Dados:', error.response.data);
        console.error('Erro ao criar peixes (bulk) - Status:', error.response.status);
      } else {
        console.error('Erro na requisição (bulk):', error.message);
      }
      throw error;
    }
  }

  static async atualizarPeixe(id: number, peixe: IPeixe): Promise<IPeixe> {
    try {
      const response = await api.put<IPeixe>(`/fishes/${id}`, peixe);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar o peixe com id ${id}:`, error);
      throw error;
    }
  }

  static async excluirPeixe(id: number): Promise<void> {
    try {
      await api.delete(`/fishes/${id}`);
    } catch (error) {
      console.error(`Erro ao excluir o peixe com id ${id}:`, error);
      throw error;
    }
  }
}
