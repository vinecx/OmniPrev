import { TipAcesso } from './enum';
export interface AuthState {
  user?: User;
  errors?: string;
  loading: boolean;
  permission: IPermission;
}

export interface User {
  idUsuario: number;
  desPessoa: string;
  email: string;
  indBloqueado: number;
}

export interface LoginVO {
  username: string;
  password: string;
}

export interface IPermission {
  tipAcesso?: TipAcesso;
}
