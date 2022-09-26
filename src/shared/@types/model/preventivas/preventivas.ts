export interface IPreventiva {
  id?: string;

  data: string;
  localId: string;
  localDesc?: string;

  tarefas: ITarefaPM[];

  observacoes: string;
}

export interface ITarefaPM {
  andar: number;
  ambiente: string;

  comofazer: string;
  imagesLink: { path: string }[];
}