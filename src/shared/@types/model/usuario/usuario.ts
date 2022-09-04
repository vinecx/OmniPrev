import { TIP_USUARIOS } from '../../../enum';
export interface IUsuario {
  id?: string;
  nome: string;
  email: string;
  funcao?: string;
  cpf: string;
  dataNascimento: string;
  idPredio?: string | null;
  tipUsuario: TIP_USUARIOS;
}

export interface Engenheiro extends IUsuario {
  especialidadeEng: number;
  regiaoDeAtuacao: string;
  nDeClientesResponsavel: string;
}
