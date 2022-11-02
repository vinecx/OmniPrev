import { ITarefaPMImage, ITarefaRealizada } from '../preventivas/preventivas';

export interface ICorretiva {
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
  imagesLink: ITarefaPMImage[];

  concluida?: ITarefaRealizada;
}
