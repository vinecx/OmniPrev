import { yupResolver } from '@hookform/resolvers/yup';
import React, { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Keyboard, TextInput } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { AuthState, LoginVO } from '../../../shared/@types/auth/types';
import { Button, ButtonText } from '../../../shared/components/commons/Button';
import { Paragraph, Subtitle, TextError, Title } from '../../../shared/components/commons/Text';
import Input from '../../../shared/components/Input';
import { Styled } from '../../../shared/utils/LayoutUtils/BaseStyle';
import RenderIf from '../../../shared/utils/RenderIf';
import { IAppDispatch, IRootState } from '../../../store/index';
import {
    createUser,
    getPermissions,
    getUser,
    hasPermission,
    logIn,
} from '../../../store/modules/auth/authSlice';
import LogoOmniPrev from '../../../assets/logo/full_logo.png';
import { CardContainer, Logo } from '../styles';

export const StackProps = {
    headerTitle: '',
    headerTransparent: true,
};

const schema = Yup.object().shape({
    name: Yup.string().required('Campo obrigatório').max(120, 'Máximo de 120 caracteres'),
    username: Yup.string().email('Informe um email válido').required('Campo obrigatório'),
    password: Yup.string()
        .required('Campo obrigatório')
        .min(6, 'A senha deve conter mais de 6 caracteres'),
    confirmpassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Senhas não conferem')
        .required('Campo obrigatório'),
});

const CreateAccount = () => {
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
            name: 'Vinicius de Almeida',
            username: 'cc.vinicius.almeida@gmail.com',
            password: 'teste',
            confirmpassword: '',
        },
        resolver: yupResolver(schema),
    });

    const [passwordVisibility, setPasswordVisibility] = useState(false);

    const handleLogin = async () => {
        Keyboard.dismiss();

        const { username, password, name } = getValues();

        const login: LoginVO = { username: username.trim(), password, name };
        const response = await dispatch(createUser(login)); // Validação de usuário e senha feita na action

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

            <Styled
                sm="width: 100%; margin-top: 20%; margin-bottom: 20%; flex: 1;"
                lg="width: 50%;"
                css="align-self: center;">
                <CardContainer>

                    <Styled sm="" lg="" marginBottom={65}>
                        <Title variance="secondary">Cadastro</Title>
                        <Subtitle variance="secondary" fontSize={15}>
                            Preencha suas informação para prosseguirmos com o cadastro
                        </Subtitle>
                    </Styled>





                    <RenderIf condition={!!errors}>
                        <TextError>{errors}</TextError>
                    </RenderIf>

                    <Controller
                        control={control}
                        name="name"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <Input
                                label="Nome completo"
                                value={value}
                                placeholder="Informe seu nome..."
                                inputProps={{
                                    autoCompleteType: 'name',
                                    autoCapitalize: 'words',
                                    autoCorrect: false,
                                    returnKeyType: 'next',
                                    blurOnSubmit: false,
                                    onBlur: onBlur,
                                    enablesReturnKeyAutomatically: true,
                                    onSubmitEditing: () => passwordRef.current?.focus(),
                                }}
                                onChangeText={onChange}
                                helperText={errorSchema.name?.message}
                                error={!!errorSchema.name?.message}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="username"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <Input
                                label="Email"
                                value={value}
                                placeholder="Informe seu email..."
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

                        <Styled sm="" lg="" marginBottom={15}>
                            <Controller
                                control={control}
                                name="confirmpassword"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <Input
                                        label="Confirme a senha"
                                        value={value}
                                        placeholder="Confirme sua senha..."
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
                                        helperText={errorSchema.confirmpassword?.message}
                                        error={!!errorSchema.confirmpassword?.message}
                                    />
                                )}
                            />
                        </Styled>

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
                        title="Criar"
                        size="md"
                        variance="primary"
                        loading={loading}
                        onPress={handleSubmit(handleLogin)}
                    />
                </CardContainer>
            </Styled>
        </Styled>
    );
};

export default CreateAccount;
