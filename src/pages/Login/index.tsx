import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Keyboard } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import LogoOmniPrev from '../../assets/logo/full_logo.png';
import { AuthState, LoginVO } from '../../shared/@types/auth/types';
import { Button } from '../../shared/components/commons/Button';
import { TextError } from '../../shared/components/commons/Text';
import Input, { InputPassword } from '../../shared/components/Input';
import { Styled } from '../../shared/utils/LayoutUtils/BaseStyle';
import RenderIf from '../../shared/utils/RenderIf';
import { IAppDispatch, IRootState } from '../../store/index';
import { logIn } from '../../store/modules/auth/authSlice';
import { CardContainer, Logo } from './styles';

export const StackProps = {
  headerTitle: '',
  headerTransparent: true,
};

const schema = Yup.object().shape({
  email: Yup.string()
    .required('Campo obrigatório')
    .default('administrador@omniprev.com.br'),
  password: Yup.string()
    .required('Campo obrigatório')
    .min(6, 'A senha deve conter mais de 6 caracteres')
    .default('OmniPrev456'),
});

const Login = () => {
  const dispatch = useDispatch<IAppDispatch>();
  const { loading, errors } = useSelector<IRootState, AuthState>(
    state => state.auth,
  );

  const {
    control,
    handleSubmit,
    formState: { errors: errorSchema },
    getValues,
  } = useForm({
    defaultValues: schema.getDefault(),
    resolver: yupResolver(schema),
  });

  const handleLogin = async () => {
    Keyboard.dismiss();

    const login = getValues();

    await dispatch(logIn(login as LoginVO)); // Validação de usuário e senha feita na action
  };

  return (
    <ScrollView
      keyboardDismissMode="on-drag"
      contentContainerStyle={{ flex: 1 }}>
      <Styled lg="display: flex;" flex={1}>
        <Styled type="row" sm={''} lg={''}>
          {/* Logo for landscape mode */}
          <Styled
            type="row"
            sm="display: none;"
            css="justify-content: center; width: 40%;">
            <Logo height={190} source={LogoOmniPrev} />
          </Styled>

          <Styled
            sm="width: 100%; height: 100%; margin-bottom: 20%; flex: 1;"
            lg="width: 50%;"
            css="align-self: center;">
            <CardContainer>
              {/* Logo for portrait mode */}
              <Styled
                type="row"
                lg="display: none;"
                css="justify-content: center;">
                <Logo height={170} source={LogoOmniPrev} />
              </Styled>

              <RenderIf condition={!!errors}>
                <TextError>{errors}</TextError>
              </RenderIf>

              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Email"
                    value={value}
                    placeholder="Informe seu email..."
                    autoCompleteType={'email'}
                    autoCapitalize={'words'}
                    autoCorrect={true}
                    returnKeyType={'next'}
                    blurOnSubmit={false}
                    onBlur={onBlur}
                    enablesReturnKeyAutomatically={true}
                    onChangeText={onChange}
                    helperText={errorSchema.email?.message}
                    error={!!errorSchema.email?.message}
                  />
                )}
              />

              <Styled marginBottom={15}>
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <InputPassword
                      label="Senha"
                      value={value}
                      placeholder="Informe sua senha..."
                      autoCapitalize={'none'}
                      autoCorrect={false}
                      onBlur={onBlur}
                      returnKeyType={'send'}
                      enablesReturnKeyAutomatically={true}
                      onSubmitEditing={handleLogin}
                      onChangeText={onChange}
                      helperText={errorSchema.password?.message}
                      error={!!errorSchema.password?.message}
                    />
                  )}
                />
              </Styled>

              <Button
                width="100%"
                alignSelf="center"
                title="Entrar"
                size="md"
                variance="primary"
                loading={loading}
                onPress={handleSubmit(handleLogin)}
              />
            </CardContainer>
          </Styled>
        </Styled>
      </Styled>
    </ScrollView>
  );
};

export default Login;
