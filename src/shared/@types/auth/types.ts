import { ICliente } from '../model/clientes/clientes';
import { IUsuario } from './../model/usuario/usuario';
export interface AuthState {
  user?: IUsuario;
  clienteLogado?: ICliente;
  errors?: string;
  loading: boolean;
}

export interface LoginVO {
  email: string;
  password: string;
}
