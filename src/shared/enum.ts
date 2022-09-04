export enum TIP_USUARIOS {
  ADMINISTRADOR = 0,
  SINDICO = 1,
  ZELADOR = 2,
  ENGENHEIRO = 3,
}

export const TIP_USUARIOS_DESCRIPTIONS: Record<TIP_USUARIOS, string> = {
  '0': 'Administrador',
  '1': 'Síndico',
  '2': 'Zelador',
  '3': 'Engenheiro',
};

export enum TIP_ACTIONS {
  CREATE = 0,
  READ = 1,
  UPDATE = 2,
  DELETE = 3,
}
