import { TIP_USUARIOS } from 'shared/enum';
export enum ScreenName {
  Login = 'app.login',
  InitialPage = 'app.initial_app',

  Usuarios = 'manut.usuarios',
  Cadastro_Usuarios = 'manut.cad_usuarios',

  Clientes = 'manut.clientes',
  Cadastro_Clientes = 'manut.cad_clientes',

  Items = 'manut.items',
  Cadastro_Items = 'manut.cad_clientes',

  Locais = 'manut.locais',
  Cadastro_Locais = 'manut.cad_locais',

  Preventivas = 'manut.preventivas',
  Cadastro_Preventivas = 'manut.cad_preventivas',

  Corretivas = 'manut.corretivas',
  Cadastro_Corretivas = 'manut.cad_corretivas',
}

const essenciais = [ScreenName.Login, ScreenName.InitialPage];

const cadastros = [
  ScreenName.Usuarios,
  ScreenName.Cadastro_Usuarios,
  ScreenName.Clientes,
  ScreenName.Cadastro_Clientes,
  ScreenName.Items,
  ScreenName.Cadastro_Items,
  ScreenName.Locais,
  ScreenName.Cadastro_Locais,
];

export const userScreenBlackListPermissions: Record<
  TIP_USUARIOS,
  ScreenName[]
> = {
  '0': [],
  '1': cadastros,
  '2': cadastros,
  '3': [],
};

export const hasPermissionToAcess = (screen: ScreenName, tip?: any) =>
  !userScreenBlackListPermissions[tip as TIP_USUARIOS].includes(screen);
