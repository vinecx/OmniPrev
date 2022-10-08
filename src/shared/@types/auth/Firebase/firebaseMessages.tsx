export type FirebaseCode =
  | 'auth/too-many-requests'
  | 'auth/user-not-found'
  | 'auth/wrong-password'
  | 'auth/email-already-in-use'
  | 'auth/invalid-email';

const FirebaseErrorMessageByCodeHandler: Record<FirebaseCode, string> = {
  'auth/too-many-requests':
    'Acesso temporariamente bloqueado, tente novamente mais tarde',
  'auth/user-not-found': 'Usuário não encontrado',
  'auth/wrong-password': 'Senha incorreta, informe novamente.',
  'auth/email-already-in-use': 'Usuário já registrado',
  'auth/invalid-email': 'Email informado inválido',
};

export const FirebaseErrorMessageByCode = (code: string) => {
  return (
    FirebaseErrorMessageByCodeHandler[code as FirebaseCode] ??
    'Erro desconhecido, contato o suporte técnico.'
  );
};
