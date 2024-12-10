import { useEffect, useState } from 'react';
import { UserService } from '../../services/UserService';
import { IUser } from '../../interfaces/User';

export function useUsers() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState<boolean>(true);
  const [errorUsers, setErrorUsers] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true); // Inicia o carregamento
      setErrorUsers(null); // Reseta o erro ao iniciar a chamada

      try {
        const fetchedUsers = await UserService.buscarUsuarios();
        setUsers(fetchedUsers);
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        setErrorUsers('Erro ao buscar usuários.'); // Define a mensagem de erro
      } finally {
        setLoadingUsers(false); // Finaliza o carregamento
      }
    };

    fetchUsers();
  }, []);

  return { users, loadingUsers, errorUsers };
}
