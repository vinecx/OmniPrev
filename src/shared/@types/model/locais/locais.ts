export interface ILocal {
  id?: string;

  nome: string;
  descricao: string;

  sessoes: {
    nome: string;
  }[];
}
