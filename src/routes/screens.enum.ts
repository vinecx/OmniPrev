import { TIP_USUARIOS } from 'shared/enum';
export enum ScreenName {
  SelectClient = 'app.select_client',

  Login = 'app.login',
  InitialPage = 'app.initial_app',

  Relatorios = 'app.relatorios',

  Usuarios = 'manut.usuarios',
  Cadastro_Usuarios = 'manut.cad_usuarios',

  Clientes = 'manut.clientes',
  Cadastro_Clientes = 'manut.cad_clientes',

  Itens = 'manut.itens',
  Cadastro_Items = 'manut.cad_itens',

  Locais = 'manut.locais',
  Cadastro_Locais = 'manut.cad_locais',

  // Preventivas
  Main_preventivas = 'hidden.preventivas',
  Main_preventivas_tarefas = 'hidden.preventivas_tarefas',

  Preventivas = 'plan_manut.preventivas',
  Cadastro_Preventivas = 'plan_manut.cad_preventivas',

  // Corretivas
  Main_Corretivas = 'hidden.corretivas',
  Main_Corretivas_tarefas = 'hidden.corretivas_tarefas',

  Corretivas = 'plan_manut.corretivas',
  Cadastro_Corretivas = 'plan_manut.cad_corretivas',
}

const essenciais = [
  ScreenName.Login,
  ScreenName.InitialPage,

  // preventivas
  ScreenName.Main_preventivas,
  ScreenName.Main_preventivas_tarefas,

  ScreenName.Preventivas,
  ScreenName.Cadastro_Preventivas,

  // Corretivas
  ScreenName.Corretivas,
  ScreenName.Cadastro_Corretivas,
];

const cadastrosAdm = [
  ScreenName.Relatorios,
  ScreenName.Usuarios,
  ScreenName.Cadastro_Usuarios,
  ScreenName.Clientes,
  ScreenName.Cadastro_Clientes,
];

const cadastros = [
  ScreenName.Itens,
  ScreenName.Cadastro_Items,
  ScreenName.Locais,
  ScreenName.Cadastro_Locais,
];

export const userScreenWhiteListPermissions: Record<
  TIP_USUARIOS,
  ScreenName[]
> = {
  '0': [...essenciais, ...cadastrosAdm, ...cadastros], // Administrador
  '1': [...cadastros, ...essenciais], // Síndico
  '2': [...essenciais], // Zelador
  '3': [...essenciais, ...cadastros], // Engenheiro
};

export const hasPermissionToAcess = (screen: ScreenName, tip?: any) => {
  return userScreenWhiteListPermissions[tip as TIP_USUARIOS].find(
    nameScreen => nameScreen === screen,
  );
};
