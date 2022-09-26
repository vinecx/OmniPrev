import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Keyboard, ToastAndroid, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { IItem } from 'shared/@types/model/item/item';
import { ILocal } from 'shared/@types/model/locais/locais';
import * as Yup from 'yup';
import { cadastrar } from '../../../../shared/@types/model/item/item.actions';

import { buscarTodos } from '../../../../shared/@types/model/locais/locais.actions';
import { Button } from '../../../../shared/components/commons/Button';
import { Text, Title } from '../../../../shared/components/commons/Text';
import Input from '../../../../shared/components/Input';
import ListLoader from '../../../../shared/components/loaders/list.loader';
import Menu, { MenuItem } from '../../../../shared/components/Menu';
import { Styled } from '../../../../shared/utils/LayoutUtils/BaseStyle';

const schema: Yup.SchemaOf<IItem> = Yup.object().shape({
  id: Yup.string().strip(),
  codigo: Yup.number()
    .required('Campo obrigatório')
    .typeError('Campo obrigatório'),
  nome: Yup.string().required('Campo obrigatório'),
  descricao: Yup.string(),
  quantidade: Yup.number().default(0).optional(),
  periodicidade: Yup.number().typeError('Campo obrigatório').default(0),
  elemento: Yup.string().required('Campo obrigatório'),
  elementoDesc: Yup.string().strip(),

  elementoLabel: Yup.string(),
  fabricante: Yup.string(),
  tempoEstimado: Yup.string().typeError('Campo obrigatório').default('0'),
});

const Create = () => {
  const [loading, setLoading] = useState({
    elementosSearch: false,
    save: false,
  });
  const [elementosToSelect, setElementosToSelect] = useState<ILocal[]>([]);
  const [openModal, setOpenModal] = useState(false);

  const { goBack } = useNavigation();
  const { params: itemToEdit } = useRoute();

  const isEditScreen = !!itemToEdit;

  const {
    control,
    handleSubmit,
    formState: { errors: errorSchema },
    getValues,
    setValue,
    reset,
  } = useForm({
    defaultValues: schema.getDefaultFromShape(),
    resolver: yupResolver(schema),
  });

  // Carrega valores para edição
  useEffect(() => {
    if (isEditScreen) {
      reset(itemToEdit);
    }
  }, []);

  const submit = async () => {
    Keyboard.dismiss();

    const values = getValues();

    delete values.elementoDesc;
    const { error, errorMessage } = await cadastrar(values);

    if (!error) {
      ToastAndroid.show(
        `Item ${isEditScreen ? 'salvo' : 'cadastrado'} com sucesso`,
        ToastAndroid.SHORT,
      );

      goBack();
      reset();
    } else {
      ToastAndroid.show(
        String(errorMessage || 'Houve um erro na solicitação'),
        ToastAndroid.SHORT,
      );
    }
  };

  const buscarElementos = async () => {
    setLoading(curr => ({ ...curr, elementosSearch: true }));

    const { error, errorMessage, data } = await buscarTodos();

    if (!error && data) {
      setElementosToSelect(data);
    } else {
      ToastAndroid.show(
        String(errorMessage || 'Houve um erro na solicitação'),
        ToastAndroid.SHORT,
      );
    }

    setLoading(curr => ({ ...curr, elementosSearch: false }));
  };

  return (
    <Styled
      type="container"
      lg="display: flex;"
      css="flex: 1; background-color: white; padding: 0px 20px;"
      borderTopRadius={30}>
      <ScrollView keyboardDismissMode="on-drag">
        <Styled
          sm="width: 100%; flex: 1;"
          lg="width: 50%;"
          css="align-self: center;">
          <Title variance="primary" size="lg" marginTop={20} width="65%">
            Informação gerais
          </Title>

          <Menu
            show={openModal}
            onDismiss={() => setOpenModal(false)}
            data={elementosToSelect}
            title="Local de manutenção"
            subtitle="Selecione um local de manutenção"
            renderItem={(item: ILocal) =>
              loading.elementosSearch ? (
                <ListLoader qtdItems={5} />
              ) : (
                <MenuItem
                  onClick={() => {
                    if (item.id) {
                      setValue('elementoDesc', item.nome);
                      setValue('elemento', item.id);
                    }
                    setOpenModal(false);
                  }}>
                  <Styled justifyContent="center" css="padding: 0px 12px;">
                    <Title fontSize={20} variance="primary">
                      {item.nome}
                    </Title>

                    <Text size="sm" textColor="grey" fontWeight="600">
                      {item.descricao}
                    </Text>
                  </Styled>
                </MenuItem>
              )
            }
          />

          <Controller
            control={control}
            name="codigo"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Código"
                value={String(value || '')}
                placeholder="Informe seu nome o código do item..."
                autoCapitalize={'words'}
                autoCorrect={true}
                keyboardType="number-pad"
                returnKeyType={'next'}
                blurOnSubmit={false}
                onBlur={onBlur}
                enablesReturnKeyAutomatically={true}
                onChangeText={val => {
                  const formatValue = val.replace(/\D/g, '');

                  onChange(formatValue);
                }}
                helperText={errorSchema.codigo?.message}
                error={!!errorSchema.codigo?.message}
              />
            )}
          />

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
                helperText={errorSchema.nome?.message}
                error={!!errorSchema.nome?.message}
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
                helperText={errorSchema.descricao?.message}
                error={!!errorSchema.descricao?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="quantidade"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Quantidade"
                value={String(value)}
                placeholder="Informe a quantidade..."
                returnKeyType={'send'}
                blurOnSubmit={false}
                keyboardType={'numeric'}
                onBlur={onBlur}
                maxLength={10}
                enablesReturnKeyAutomatically={true}
                onChangeText={val => {
                  const formatValue = val.replace(/\D/g, '');

                  onChange(Number(formatValue || 0));
                }}
                helperText={errorSchema.quantidade?.message}
                error={!!errorSchema.quantidade?.message}
              />
            )}
          />
        </Styled>

        <Styled css="margin-bottom: 25px;">
          <Controller
            control={control}
            name="elementoDesc"
            render={({ field: { onChange, onBlur, value } }) => (
              <TouchableOpacity
                onPress={() => {
                  setOpenModal(true);
                  buscarElementos();
                }}>
                <Input
                  label="Selecione o elemento"
                  value={value}
                  placeholder="Selecione o elemento..."
                  autoCapitalize={'none'}
                  autoCorrect={false}
                  editable={false}
                  onBlur={onBlur}
                  returnKeyType={'send'}
                  enablesReturnKeyAutomatically={true}
                  onChangeText={onChange}
                  helperText={errorSchema.elemento?.message}
                  error={!!errorSchema.elemento?.message}
                />
              </TouchableOpacity>
            )}
          />

          <Controller
            control={control}
            name="periodicidade"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Periodicidade"
                value={String(value)}
                placeholder="Informe a periodicidade..."
                autoCapitalize={'none'}
                autoCorrect={false}
                keyboardType="numeric"
                onBlur={onBlur}
                returnKeyType={'send'}
                enablesReturnKeyAutomatically={true}
                onChangeText={val => {
                  const formatValue = val.replace(/\D/g, '');

                  onChange(Number(formatValue || 0));
                }}
                helperText={errorSchema.periodicidade?.message}
                error={!!errorSchema.periodicidade?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="fabricante"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Fabricante"
                value={String(value || '')}
                placeholder="Informe o(a) Fabricante do Item..."
                autoCapitalize={'none'}
                autoCorrect={false}
                onBlur={onBlur}
                returnKeyType={'send'}
                enablesReturnKeyAutomatically={true}
                onChangeText={onChange}
                helperText={errorSchema.fabricante?.message}
                error={!!errorSchema.fabricante?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="tempoEstimado"
            render={({ field }) => (
              <Input
                {...field}
                label="Tempo estimado"
                placeholder="Informe o tempo estimado..."
                autoCapitalize={'none'}
                value={String(field.value ?? '')}
                autoCorrect={false}
                returnKeyType={'send'}
                enablesReturnKeyAutomatically={true}
                onChangeText={val => field.onChange(val)}
                helperText={errorSchema.tempoEstimado?.message}
                error={!!errorSchema.tempoEstimado?.message}
              />
            )}
          />
          <Styled type="row" css="margin-bottom: 100px; width: 100%;">
            <Button
              title="Voltar"
              size="md"
              flex={1}
              variance="secondary"
              marginRight={10}
              onPress={goBack}
            />
            <Button
              title="Criar"
              size="md"
              width="70%"
              variance="primary"
              loading={loading.save}
              onPress={handleSubmit(submit)}
            />
          </Styled>
        </Styled>
      </ScrollView>
    </Styled>
  );
};

export default Create;
