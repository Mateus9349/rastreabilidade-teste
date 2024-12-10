import api from './api';

export interface IPeixe {
  especie: string; // Espécie do peixe
  cat: string; // Categoria do peixe
  lacre: string; // Código único do lacre, padrão UUID
  sexo: string; // Sexo do peixe
  unidade: string; // Unidade de medida associada ao peixe
  gona: string; // Estado da gonada
  comprimento: string; // Comprimento do peixe
  peso: string; // Peso do peixe
  hPesca: string; // Horário da pesca
  lago: string; // Nome do lago de origem
  comunidade: string; // Nome da comunidade de origem
  hEvisceramento: string; // Horário de evisceração do peixe
  hChegadaSalgadeira: string; // Horário de chegada do peixe na salgadeira
  createdBy: string; // Usuário que está cadastrando o peixe
  status: "PENDING" | "CONFIRMED"; // Status do peixe ("PENDING" ou "CONFIRMED")
}

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

  static async criarPeixe(peixe: IPeixe): Promise<IPeixe> {
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
