import { yupResolver } from '@hookform/resolvers/yup';
import React, { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Keyboard, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import Style from '../../commons/Style';
import { AuthState, LoginVO } from '../../shared/@types/auth/types';
import { Button, ButtonText } from '../../shared/components/commons/Button';
import { Text, TextError } from '../../shared/components/commons/Text';
import Input from '../../shared/components/Input';
import { useOrientation } from '../../shared/utils/CustomHooks/useOrientation';
import { Styled } from '../../shared/utils/LayoutUtils/BaseStyle';
import RenderIf from '../../shared/utils/RenderIf';
import { IAppDispatch, IRootState } from '../../store/index';
import {
  getPermissions,
  getUser,
  hasPermission,
  logIn,
} from '../../store/modules/auth/authSlice';
import { CardContainer, Logo } from './styles';
import LogoOmniPrev from '../../assets/logo/full_logo.png';
import { useNavigation } from '@react-navigation/native';
import { ScreenName } from '../../routes/screens.enum';

export const StackProps = {
  headerTitle: '',
  headerTransparent: true,
};

const schema = Yup.object().shape({
  username: Yup.string().required('Campo obrigatório'),
  password: Yup.string()
    .required('Campo obrigatório')
    .min(6, 'A senha deve conter mais de 6 caracteres'),
});

const Login = () => {
  const passwordRef = useRef<TextInput>(null);
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
    defaultValues: {
      username: 'cc.vinicius.almeida@gmail.com',
      password: 'teste',
    },
    resolver: yupResolver(schema),
  });

  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const { navigate } = useNavigation();

  const handleLogin = async () => {
    Keyboard.dismiss();

    const { username, password } = getValues();

    const login: LoginVO = { username: username.trim(), password };
    const response = await dispatch(logIn(login)); // Validação de usuário e senha feita na action

    if (logIn.fulfilled.match(response)) {
      await dispatch(getPermissions());
      await dispatch(hasPermission());

      await dispatch(getUser());
    }
  };

  const handlePasswordVisibility = () => {
    if (passwordVisibility) {
      setPasswordVisibility(false);
    } else {
      setPasswordVisibility(true);
    }
  };

  return (
    <Styled type="container" sm="" lg="display: flex;" css="flex: 1;">
      <Styled type="row">

        {/* Logo for landscape mode */}
        <Styled
          type="row"
          sm="display: none;"
          lg=""
          css="justify-content: center; width: 40%;">
          <Logo height={190} source={LogoOmniPrev} />
        </Styled>


        <Styled
          sm="width: 100%; margin-top: 20%; margin-bottom: 20%; flex: 1;"
          lg="width: 50%;"
          css="align-self: center;">
          <CardContainer>

            {/* Logo for portrait mode */}
            <Styled
              type="row"
              sm=""
              lg="display: none;"
              css="justify-content: center;">
              <Logo height={190} source={LogoOmniPrev} />
            </Styled>

            <RenderIf condition={!!errors}>
              <TextError>{errors}</TextError>
            </RenderIf>

            <Controller
              control={control}
              name="username"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Email ou Usuário"
                  value={value}
                  placeholder="Informe seu email ou usuário..."
                  inputProps={{
                    autoCompleteType: 'email',
                    autoCapitalize: 'none',
                    autoCorrect: false,
                    returnKeyType: 'next',
                    blurOnSubmit: false,
                    onBlur: onBlur,
                    enablesReturnKeyAutomatically: true,
                    onSubmitEditing: () => passwordRef.current?.focus(),
                  }}
                  onChangeText={onChange}
                  helperText={errorSchema.username?.message}
                  error={!!errorSchema.username?.message}
                />
              )}
            />

            <Styled sm="" lg="" marginBottom={15}>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Senha"
                    value={value}
                    placeholder="Informe sua senha..."
                    inputProps={{
                      autoCapitalize: 'none',
                      autoCorrect: false,
                      onBlur: onBlur,
                      returnKeyType: 'send',
                      secureTextEntry: !passwordVisibility,
                      enablesReturnKeyAutomatically: true,
                      onSubmitEditing: handleLogin,
                    }}
                    onChangeText={onChange}
                    helperText={errorSchema.password?.message}
                    error={!!errorSchema.password?.message}
                  />
                )}
              />

              <ButtonText
                onPress={handlePasswordVisibility}
                title={passwordVisibility ? 'Esconder senha' : 'Mostrar senha'}
                variance="primary"
                size={'sm'}
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



            <ButtonText
              onPress={() => navigate(ScreenName.CreateAccount)}
              title="Criar conta"
              variance="secondary"
              size={'sm'}
            />
          </CardContainer>
        </Styled>
      </Styled>
    </Styled>
  );
};

export default Login;
