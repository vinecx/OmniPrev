export interface IPreventiva {
  id?: string;

  data: string;
  localId: string;
  localDesc?: string;

  tarefas: ITarefaPM[];

  observacoes: string;
}

export interface ITarefaPMImage {
  path: string;
  fileName: string;
  fileSize: number;
}

export interface ITarefaRealizada {
  observacao: string;
  data: Date;
}

export interface ITarefaPM {
  andar: number;
  ambiente: string;

  comofazer: string;
  imagesLink: ITarefaPMImage[];

  concluida?: ITarefaRealizada;
}
