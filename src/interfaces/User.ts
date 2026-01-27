export interface IUser {
    id: number;
    email: string;
    nome: string;
    //["FAS_USER", "FAS_OSKLEY", "FAS_ADMIN", "FAS_SALGADEIRA", "FAS_USER", "FAS_NOVA_KAERU", "FAS_FRIGORIFICO"]
    permissoes: string[];
    senha?: string;
}