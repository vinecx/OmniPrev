export interface ILocal {
  id?: string;

  nome: string;
  descricao: string;

  secoes: {
    nome: string;
  }[];
}
