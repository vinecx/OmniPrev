import { IUsuario } from './../model/usuario/usuario';
export interface AuthState {
  user?: IUsuario;
  errors?: string;
  loading: boolean;
}

export interface LoginVO {
  email: string;
  password: string;
}
