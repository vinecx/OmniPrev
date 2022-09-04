export interface IItem {
  id?: string;
  codigo: number;
  nome: string;
  descricao?: string;
  quantidade?: number | null;

  elemento: string;
  elementoDesc?: string;

  periodicidade?: number;
  fabricante?: string;
  tempoEstimado?: string;
}
