export interface IUser {
    id: number;
    email: string;
    nome: string;
    permissoes: string[];
    senha?: string;
}