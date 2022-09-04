import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { Keyboard, ToastAndroid, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/AntDesign';
import { ILocal } from 'shared/@types/model/locais/locais';
import * as Yup from 'yup';
import Style from '../../../../commons/Style';
import { cadastrar } from '../../../../shared/@types/model/locais/locais.actions';
import {
  Button,
  ButtonText,
} from '../../../../shared/components/commons/Button';
import { Text } from '../../../../shared/components/commons/Text';
import Input from '../../../../shared/components/Input';
import { Styled } from '../../../../shared/utils/LayoutUtils/BaseStyle';
import ModalLocais from './index.cadastro.locais';

interface ILocalCadastro extends ILocal {
  cadastroSubSessoes?: {
    nome?: string;
  };
}

const schema: Yup.SchemaOf<ILocalCadastro> = Yup.object({
  id: Yup.string(),
  nome: Yup.string().required('Campo obrigatório'),
  descricao: Yup.string().required('Campo obrigatório'),
  sessoes: Yup.array()
    .of(
      Yup.object({
        nome: Yup.string().required('Campo obrigatório'),
      }).required('Campo obrigatório'),
    )
    .min(1, 'Insira ao menos uma subsessão')
    .required('Campo obrigatório'),

  cadastroSubSessoes: Yup.object()
    .shape({
      nome: Yup.string(),
    })
    .strip(),
});

const defaultValues: Yup.InferType<typeof schema> = {} as Yup.InferType<
  typeof schema
>;

const Create = () => {
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const { goBack } = useNavigation();

  const { params: locais } = useRoute();
  const isEditScreen = !!locais;

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    setError,
  } = useForm({
    defaultValues: (locais as ILocalCadastro) ?? defaultValues,
    resolver: yupResolver(schema),
    mode: 'all',
  });

  const { append, remove, fields } = useFieldArray({
    name: 'sessoes',
    control,
  });

  const submit = async (values: ILocalCadastro) => {
    setLoading(true);
    Keyboard.dismiss();

    const { error, errorMessage } = await cadastrar(values);

    if (!error) {
      ToastAndroid.show(
        `Local ${isEditScreen ? 'salvo' : 'cadastrado'} com sucesso`,
        ToastAndroid.SHORT,
      );
    } else {
      ToastAndroid.show(
        String(errorMessage || 'Houve um erro na solicitação'),
        ToastAndroid.SHORT,
      );
    }

    setLoading(false);
  };

  const cadastrarSubsessao = () => {
    const { cadastroSubSessoes } = getValues();

    if (!cadastroSubSessoes || !cadastroSubSessoes.nome) {
      setError('cadastroSubSessoes.nome', {
        message: 'Cadastre ao menos 1 opção',
      });

      return;
    }

    if (
      cadastroSubSessoes &&
      !fields.some(x => x.nome === cadastroSubSessoes.nome)
    ) {
      append({
        nome: cadastroSubSessoes.nome,
      });
      setValue('cadastroSubSessoes.nome', '');
    } else {
      setError('cadastroSubSessoes.nome', {
        message: 'Já existe essa opção cadastrada',
      });
    }
  };

  return (
    <Styled
      type="container"
      lg="display: flex;"
      css="flex: 1; background-color: white; height: 100%;"
      borderRadius={30}>
      <ScrollView
        keyboardDismissMode="on-drag"
        contentContainerStyle={{ flex: 1, height: '100%' }}>
        <Styled
          sm="width: 100%; flex: 1;"
          lg="width: 50%;"
          css="align-self: center;  height: 100%;">
          {/* Modal cadastro de subsessoes */}
          <ModalLocais
            onAddClick={cadastrarSubsessao}
            openModal={openModal}
            handleCloseModal={() => setOpenModal(false)}>
            <Controller
              control={control}
              name="cadastroSubSessoes.nome"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Nome da subsessão"
                  value={value}
                  placeholder="Informe o nome da subsessão..."
                  autoCompleteType={'name'}
                  autoCapitalize={'sentences'}
                  autoCorrect={true}
                  returnKeyType={'go'}
                  blurOnSubmit={false}
                  onBlur={onBlur}
                  enablesReturnKeyAutomatically={true}
                  onSubmitEditing={cadastrarSubsessao}
                  onChangeText={onChange}
                  helperText={errors.cadastroSubSessoes?.nome?.message}
                  error={!!errors.cadastroSubSessoes?.nome?.message}
                />
              )}
            />
          </ModalLocais>

          <Controller
            control={control}
            name="nome"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Nome do item"
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
                helperText={errors.nome?.message}
                error={!!errors.nome?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="descricao"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Descrição"
                value={value}
                placeholder="Informe a descrição..."
                autoCompleteType={'name'}
                autoCapitalize={'sentences'}
                autoCorrect={true}
                returnKeyType={'next'}
                blurOnSubmit={false}
                onBlur={onBlur}
                enablesReturnKeyAutomatically={true}
                onChangeText={onChange}
                helperText={errors.descricao?.message}
                error={!!errors.descricao?.message}
              />
            )}
          />

          <Styled
            type="row"
            justifyContent="space-between"
            alignItems="center"
            css="margin: 0px 20px;">
            <Text variance="darkenPrimary" fontWeight="900" size="md">
              Lista de subsessões
            </Text>
            <ButtonText
              leftIcon={
                <Icon
                  size={15}
                  name="pluscircle"
                  color={Style.theme.darkenSecondary}
                />
              }
              title="Adicionar"
              variance="darkenSecondary"
              size="sm"
              onPress={() => setOpenModal(true)}
            />
          </Styled>
          <Text variance="danger" fontWeight="bold">
            {errors.sessoes?.message}
          </Text>

          <ScrollView>
            {fields.map((x, index) => (
              <Styled
                type="row"
                borderRadius="15"
                justifyContent="space-between"
                border="3px"
                marginBottom={5}
                borderColor={Style.theme.darkenSecondary}
                css="padding: 10px 15px; margin: 0px 10px;">
                <Styled css="margin: auto 0;" width="80%">
                  <Text variance="darkenPrimary" fontWeight="bold">
                    {x.nome}
                  </Text>
                </Styled>

                <TouchableOpacity onPress={() => remove(index)}>
                  <Styled css="margin: auto;">
                    <Icon
                      size={35}
                      name="closecircleo"
                      color={Style.theme.darkenSecondary}
                    />
                  </Styled>
                </TouchableOpacity>
              </Styled>
            ))}
          </ScrollView>

          <Styled type="row" css="margin-top: auto; width: 100%;">
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
