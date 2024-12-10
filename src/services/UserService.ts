import api from './api';
import { IUser } from '../interfaces/User';

export class UserService {
  static async buscarUsuarios(): Promise<IUser[]> {
    try {
      const response = await api.get<IUser[]>('/users');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      console.log(error);
      throw error;
    }
  }

  static async buscarUsuarioPorId(id: number): Promise<IUser> {
    try {
      const response = await api.get<IUser>(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar o usuário com id ${id}:`, error);
      throw error;
    }
  }

  static async criarUsuario(usuario: IUser): Promise<IUser> {
    try {
      const response = await api.post<IUser>('/users', usuario);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw error;
    }
  }

  static async atualizarUsuario(id: number, usuario: IUser): Promise<IUser> {
    try {
      const response = await api.put<IUser>(`/users/${id}`, usuario);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar o usuário com id ${id}:`, error);
      throw error;
    }
  }

  static async excluirUsuario(id: number): Promise<void> {
    try {
      await api.delete(`/users/${id}`);
    } catch (error) {
      console.error(`Erro ao excluir o usuário com id ${id}:`, error);
      throw error;
    }
  }
}
