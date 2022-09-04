import { IEstrutura } from './estruturas/estrutura';

export interface ICliente {
  id?: string;
  CNPJ: string;
  razaoSocial: string;
  nomeFantasia: string;
  telefone: string;
  ativo: boolean;
  endereco: IEndereco;
  estrutura: IEstrutura;
}

export interface IEndereco {
  rua: string;
  numero: number;
  cep: string;
  cidade: string;
  bairro: string;
  uf: string;
}
