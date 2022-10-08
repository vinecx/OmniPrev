import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation, useRoute } from '@react-navigation/native';
import { isAfter, subYears } from 'date-fns';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Keyboard, ToastAndroid, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Entypo';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';
import { AuthState, LoginVO } from '../../../../shared/@types/auth/types';
import { IUsuario } from '../../../../shared/@types/model/usuario/usuario';
import { cadastrar } from '../../../../shared/@types/model/usuario/usuario.actions';
import { Button } from '../../../../shared/components/commons/Button';
import {
  Text,
  TextError,
  Title,
} from '../../../../shared/components/commons/Text';
import Input, {
  HelperText,
  InputLabel,
  InputPassword,
} from '../../../../shared/components/Input';
import BottomSheet, { MenuItem } from '../../../../shared/components/Menu';
import { TIP_USUARIOS } from '../../../../shared/enum';
import { Styled } from '../../../../shared/utils/LayoutUtils/BaseStyle';
import RenderIf from '../../../../shared/utils/RenderIf';
import { IRootState } from '../../../../store/index';

export const StackProps = {
  headerTitle: '',
  headerTransparent: true,
};

interface IUsuarioCrud extends IUsuario, LoginVO {
  confirmpassword?: string;
}

const addSchema: Yup.SchemaOf<IUsuarioCrud> = Yup.object().shape({
  nome: Yup.string()
    .required('Campo obrigatório')
    .max(120, 'Máximo de 120 caracteres'),
  email: Yup.string()
    .email('Informe um email válido')
    .required('Campo obrigatório'),
  password: Yup.string()
    .required('Campo obrigatório')
    .min(6, 'A senha deve conter mais de 6 caracteres'),
  confirmpassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Senhas não conferem')
    .required('Campo obrigatório'),
  cpf: Yup.string().min(12, 'CPF inválido').required('Campo obrigatório'),
  dataNascimento: Yup.string()
    .test({
      test: value => {
        const date = new Date(value || new Date());
        const dateToCompare = subYears(new Date(), 18);
        if (isAfter(date, dateToCompare)) {
          return false;
        } else {
          return true;
        }
      },
      message: 'Usuários devem ser maior de 18 anos',
    })
    .required('Campo obrigatório'),
  funcao: Yup.string(),
  id: Yup.string(),
  idPredio: Yup.string(),
  permissao: Yup.mixed().notRequired(),
  tipUsuario: Yup.number().required('Campo obrigatório'),
});

const editSchema: Yup.SchemaOf<IUsuario> = Yup.object().shape({
  nome: Yup.string()
    .required('Campo obrigatório')
    .max(120, 'Máximo de 120 caracteres'),
  email: Yup.string()
    .email('Informe um email válido')
    .required('Campo obrigatório'),
  cpf: Yup.string().min(12, 'CPF inválido').required('Campo obrigatório'),
  dataNascimento: Yup.string()
    .test({
      test: value => {
        const date = new Date(value || new Date());
        const dateToCompare = subYears(new Date(), 18);
        if (isAfter(date, dateToCompare)) {
          return false;
        } else {
          return true;
        }
      },
      message: 'Usuários devem ser maior de 18 anos',
    })
    .required('Campo obrigatório'),
  funcao: Yup.string(),
  id: Yup.string(),
  idPredio: Yup.string(),
  permissao: Yup.mixed().notRequired(),
  tipUsuario: Yup.number().required('Campo obrigatório'),
});

const defaultValuesAdd: Yup.InferType<typeof addSchema> = {} as Yup.InferType<
  typeof addSchema
>;

const Create = () => {
  const { loading, errors } = useSelector<IRootState, AuthState>(
    state => state.auth,
  );
  const { goBack } = useNavigation();
  const { params: usuario } = useRoute();

  const isEditScreen = !!usuario;

  const [openModal, setOpenModal] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors: errorSchema },
    setValue,
  } = useForm({
    defaultValues: (usuario as IUsuarioCrud) ?? defaultValuesAdd,
    resolver: yupResolver(isEditScreen ? editSchema : addSchema),
  });

  const submit = async (values: IUsuarioCrud) => {
    Keyboard.dismiss();

    delete values.confirmpassword;
    const { error, errorMessage } = await cadastrar(values);

    if (!error) {
      ToastAndroid.show(
        `Usuário ${isEditScreen ? 'salvo' : 'cadastrado'} com sucesso`,
        ToastAndroid.SHORT,
      );

      goBack();
    } else {
      ToastAndroid.show(
        String(errorMessage || 'Houve um erro na solicitação'),
        ToastAndroid.SHORT,
      );
    }
  };

  //#region Menu data e suas funções
  const data = [
    { label: 'Síndico', value: TIP_USUARIOS.SINDICO },
    { label: 'Zelador', value: TIP_USUARIOS.ZELADOR },
    { label: 'Administrador', value: TIP_USUARIOS.ADMINISTRADOR },
    { label: 'Engenheiro', value: TIP_USUARIOS.ENGENHEIRO },
  ];

  type Flatten<T> = T extends any[] ? T[number] : T;
  // Extracts out the element type.
  type TypeItems = Flatten<typeof data>;

  //#endregion

  return (
    <Styled
      type="container"
      lg="display: flex;"
      css="flex: 1; background-color: white;"
      borderTopRadius={30}>
      <ScrollView keyboardDismissMode="on-drag">
        <Styled
          sm="width: 100%; flex: 1;"
          lg="width: 50%;"
          css="align-self: center;">
          <Title variance="primary" size="lg" marginTop={20} width="65%">
            Informação gerais
          </Title>

          <RenderIf condition={!!errors}>
            <TextError>{errors}</TextError>
          </RenderIf>

          <BottomSheet
            show={openModal}
            onDismiss={() => setOpenModal(false)}
            title="Tipo de Usuário"
            data={data}
            subtitle="Selecione uma opção"
            renderItem={(item: TypeItems) => (
              <MenuItem
                onClick={() => {
                  setValue('tipUsuario', item.value);
                  setOpenModal(false);
                }}>
                <Styled css="padding: 8px 12px;" justifyContent="center">
                  <Title fontSize={20} variance="primary">
                    {item.label}
                  </Title>
                </Styled>
              </MenuItem>
            )}
          />

          <Controller
            control={control}
            name="nome"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Nome completo"
                value={value}
                placeholder="Informe seu nome..."
                autoCompleteType={'name'}
                autoCapitalize={'words'}
                autoCorrect={true}
                returnKeyType={'next'}
                blurOnSubmit={false}
                onBlur={onBlur}
                enablesReturnKeyAutomatically={true}
                onChangeText={onChange}
                helperText={errorSchema.nome?.message}
                error={!!errorSchema.nome?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Email"
                value={value}
                placeholder="Informe seu email..."
                autoCompleteType={'email'}
                autoCapitalize={'none'}
                autoCorrect={false}
                returnKeyType={'next'}
                blurOnSubmit={false}
                onBlur={onBlur}
                editable={!isEditScreen}
                enablesReturnKeyAutomatically={true}
                onChangeText={onChange}
                helperText={
                  errorSchema.email?.message ??
                  `${isEditScreen ? '(não editável)' : ''}`
                }
                error={!!errorSchema.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="cpf"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="CPF"
                value={value}
                placeholder="Informe seu cpf..."
                autoCompleteType={'email'}
                autoCapitalize={'none'}
                autoCorrect={false}
                returnKeyType={'next'}
                blurOnSubmit={false}
                keyboardType={'number-pad'}
                onBlur={onBlur}
                maxLength={14}
                enablesReturnKeyAutomatically={true}
                onChangeText={val =>
                  onChange(
                    val
                      .replace(/\D/g, '')
                      .replace(
                        /^(\d{3})(\d{3})(\d{3})(\d{2})+?$/,
                        '$1.$2.$3-$4',
                      ),
                  )
                }
                helperText={errorSchema.cpf?.message}
                error={!!errorSchema.cpf?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="dataNascimento"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Data de Nascimento"
                value={value}
                placeholder="Informe sua data de Nascimento..."
                returnKeyType={'send'}
                blurOnSubmit={false}
                keyboardType={'numeric'}
                onBlur={onBlur}
                maxLength={10}
                enablesReturnKeyAutomatically={true}
                onChangeText={val => {
                  const formatValue = val
                    .replace(/\D/g, '')
                    .replace(/^(\d{2})(\d{2})(\d{4})+/, '$1/$2/$3');

                  onChange(formatValue);
                }}
                helperText={errorSchema.dataNascimento?.message}
                error={!!errorSchema.dataNascimento?.message}
              />
            )}
          />

          <Styled css="margin-bottom: 25px;">
            {!isEditScreen && (
              <>
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
                      onChangeText={onChange}
                      helperText={errorSchema.password?.message}
                      error={!!errorSchema.password?.message}
                    />
                  )}
                />

                <Styled marginBottom={15}>
                  <Controller
                    control={control}
                    name="confirmpassword"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <InputPassword
                        label="Confirme a senha"
                        value={value}
                        placeholder="Confirme sua senha..."
                        autoCapitalize={'none'}
                        autoCorrect={false}
                        onBlur={onBlur}
                        returnKeyType={'send'}
                        enablesReturnKeyAutomatically={true}
                        onChangeText={onChange}
                        helperText={errorSchema.confirmpassword?.message}
                        error={!!errorSchema.confirmpassword?.message}
                      />
                    )}
                  />
                </Styled>
              </>
            )}
            <Controller
              control={control}
              name="tipUsuario"
              render={({ field: { value } }) => (
                <TouchableOpacity onPress={() => setOpenModal(true)}>
                  <InputLabel fontSize={12} focus={false}>
                    Tipo de usuário
                  </InputLabel>

                  <Styled
                    type="row"
                    css="flex: 1; align-items: baseline; margin-left: 10px;">
                    <Icon name="chevron-down" size={20} />
                    <Text
                      variance="primary"
                      fontSize={15}
                      marginLeft={15}
                      fontWeight="bold">
                      {data.find(x => x.value === value)?.label ||
                        'Selecione uma opção'}
                    </Text>
                  </Styled>

                  <RenderIf condition={!!errorSchema.tipUsuario}>
                    <HelperText focus={false} hasError={true}>
                      {errorSchema.tipUsuario?.message}
                    </HelperText>
                  </RenderIf>
                </TouchableOpacity>
              )}
            />
          </Styled>

          <Styled type="row" css="margin-bottom: 100px; width: 100%;">
            <Button
              title="Voltar"
              size="md"
              flex={1}
              variance="secondary"
              marginRight={10}
              loading={loading}
              onPress={goBack}
            />
            <Button
              title={isEditScreen ? 'Salvar' : 'Criar'}
              size="md"
              width="70%"
              variance="primary"
              loading={loading}
              onPress={handleSubmit(submit)}
            />
          </Styled>
        </Styled>
      </ScrollView>
    </Styled>
  );
};

export default Create;
