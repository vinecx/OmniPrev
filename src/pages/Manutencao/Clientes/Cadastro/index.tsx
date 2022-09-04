import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Keyboard, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Entypo';
import { ICliente, IEndereco } from 'shared/@types/model/clientes/clientes';
import { boolean, InferType, number, object, SchemaOf, string } from 'yup';
import { cadastrarCliente } from '../../../../shared/@types/model/clientes/clientes.actions';
import { Button } from '../../../../shared/components/commons/Button';
import { Text, Title } from '../../../../shared/components/commons/Text';
import Input, { InputLabel } from '../../../../shared/components/Input';
import Menu, { MenuItem } from '../../../../shared/components/Menu';
import { Styled } from '../../../../shared/utils/LayoutUtils/BaseStyle';

import DateTimePicker from 'react-native-modal-datetime-picker';

export const StackProps = {
  headerTitle: '',
  headerTransparent: true,
};

const schema: SchemaOf<ICliente> = object().shape({
  id: string(),
  CNPJ: string().required('Campo obrigatório'),
  nomeFantasia: string().required('Campo obrigatório'),
  razaoSocial: string().required('Campo obrigatório'),
  ativo: boolean().required('Campo obrigatório'),
  telefone: string().required('Campo obrigatório'),
  endereco: object().shape({
    bairro: string().required('Campo obrigatório'),
    cep: string().required('Campo obrigatório'),
    cidade: string().required('Campo obrigatório'),
    numero: number().required('Campo obrigatório'),
    rua: string().required('Campo obrigatório'),
    uf: string().required('Campo obrigatório'),
  }),
  estrutura: object().shape({
    andares: number().required('Campo obrigatório.'),
    blocos: number().required('Campo obrigatório.'),
    torres: number().required('Campo obrigatório.'),
    numeroUnidades: number().required('Campo obrigatório.'),
    inventario: string().required('Campo obrigatório.'),
    dataAssinatura: string().required('Campo obrigatório'),
    dataConstrucao: string().required('Campo obrigatório'),
  }),
});

const defaultValues = {
  endereco: {
    cidade: '',
  } as IEndereco,
} as InferType<typeof schema>;

const Create = () => {
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { goBack } = useNavigation();
  const { params: cliente } = useRoute();

  const isEditScreen = !!cliente;

  const [openModal, setOpenModal] = useState(false);

  const { control, handleSubmit, formState, setValue } = useForm({
    defaultValues: (cliente as ICliente) ?? defaultValues,
    resolver: yupResolver(schema),
  });

  const { errors: errorSchema } = formState;

  //#region Menu data e suas funções

  const data = [
    { label: 'Ativo', value: true },
    { label: 'Desativado', value: false },
  ];

  type Flatten<T> = T extends any[] ? T[number] : T;
  // Extracts out the element type.
  type TypeItems = Flatten<typeof data>;

  //#endregion

  const submit = async (values: ICliente) => {
    setLoading(true);
    Keyboard.dismiss();

    const { error, errorMessage } = await cadastrarCliente(values); // Validações e cadastro

    if (!error) {
      ToastAndroid.show(
        `Cliente ${isEditScreen ? 'atualizado' : 'cadastrado'} com sucesso`,
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

  return (
    <ScrollView keyboardDismissMode="on-drag">
      <Styled
        type="container"
        lg="display: flex;"
        css="flex: 1; background-color: white;"
        borderRadius={30}>
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
            title="Usuário ativo?"
            data={data}
            subtitle="Selecione uma opção"
            renderItem={(item: TypeItems) => (
              <MenuItem
                onClick={() => {
                  setValue('ativo', item.value);
                  setOpenModal(false);
                }}>
                <View
                  style={{
                    height: 40,
                    display: 'flex',
                    paddingHorizontal: 12,
                    justifyContent: 'center',
                  }}>
                  <Title fontSize={20} variance="primary">
                    {item.label}
                  </Title>
                </View>
              </MenuItem>
            )}
          />

          <Controller
            control={control}
            name="CNPJ"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="CNPJ"
                value={value}
                placeholder="Informe o CNPJ..."
                autoCompleteType={'name'}
                autoCapitalize={'words'}
                autoCorrect={true}
                returnKeyType={'next'}
                blurOnSubmit={false}
                onBlur={onBlur}
                maxLength={18}
                keyboardType={'numeric'}
                enablesReturnKeyAutomatically={true}
                onChangeText={val => {
                  const formatValue = val
                    .replace(/\D/g, '')
                    .replace(
                      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})+$/,
                      '$1.$2.$3/$4-$5',
                    );

                  onChange(formatValue);
                }}
                helperText={errorSchema.CNPJ?.message}
                error={!!errorSchema.CNPJ?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="razaoSocial"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Razão social"
                value={value}
                placeholder="Informe a razão social..."
                autoCompleteType={'email'}
                autoCapitalize={'none'}
                autoCorrect={false}
                returnKeyType={'next'}
                blurOnSubmit={false}
                onBlur={onBlur}
                enablesReturnKeyAutomatically={true}
                onChangeText={onChange}
                helperText={errorSchema.razaoSocial?.message}
                error={!!errorSchema.razaoSocial?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="nomeFantasia"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Nome fantasia"
                value={value}
                placeholder="Informe o nome fantasia..."
                autoCapitalize={'words'}
                autoCorrect={false}
                returnKeyType={'next'}
                blurOnSubmit={false}
                onBlur={onBlur}
                enablesReturnKeyAutomatically={true}
                onChangeText={onChange}
                helperText={errorSchema.nomeFantasia?.message}
                error={!!errorSchema.nomeFantasia?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="telefone"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Telefone"
                value={value}
                placeholder="Informe o telefone..."
                returnKeyType={'send'}
                blurOnSubmit={false}
                keyboardType={'numeric'}
                onBlur={onBlur}
                enablesReturnKeyAutomatically={true}
                onChangeText={val => {
                  const formatValue = val
                    .replace(/\D/g, '')
                    .replace(
                      /^(\d{2})(\d{1})(\d{4})(\d{4})+$/,
                      '($1) $2 $3-$4',
                    );

                  onChange(formatValue);
                }}
                helperText={errorSchema.telefone?.message}
                error={!!errorSchema.telefone?.message}
              />
            )}
          />

          <Title variance="primary" size="lg" marginTop={40} width="65%">
            Informação sobre a estrutura
          </Title>

          <DateTimePicker
            isVisible={showDatePicker}
            onConfirm={date => setValue('dataConstrucao', new Date(date))}
            onCancel={() => setShowDatePicker(false)}
          />

          <Controller
            control={control}
            name="estrutura.andares"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Andares"
                value={String(value || '')}
                placeholder="Informe o número de andares..."
                autoCapitalize={'words'}
                autoCorrect={true}
                returnKeyType={'next'}
                blurOnSubmit={false}
                keyboardType={'numeric'}
                onBlur={onBlur}
                enablesReturnKeyAutomatically={true}
                onChangeText={onChange}
                helperText={errorSchema.estrutura?.andares?.message}
                error={!!errorSchema.estrutura?.andares?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="estrutura.blocos"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Blocos"
                value={String(value || '')}
                placeholder="Informe o número de blocos..."
                autoCompleteType={'email'}
                autoCapitalize={'none'}
                autoCorrect={false}
                returnKeyType={'next'}
                blurOnSubmit={false}
                keyboardType={'numeric'}
                onBlur={onBlur}
                enablesReturnKeyAutomatically={true}
                onChangeText={onChange}
                helperText={errorSchema.estrutura?.blocos?.message}
                error={!!errorSchema.estrutura?.blocos?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="estrutura.numeroUnidades"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Número de unidades"
                value={String(value || '')}
                placeholder="Informe o número de unidades..."
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
                helperText={errorSchema.estrutura?.numeroUnidades?.message}
                error={!!errorSchema.estrutura?.numeroUnidades?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="estrutura.dataConstrucao"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Data da construção"
                value={value}
                placeholder="Informe a data de construção..."
                returnKeyType={'send'}
                blurOnSubmit={false}
                keyboardType={'numeric'}
                onBlur={onBlur}
                maxLength={10}
                enablesReturnKeyAutomatically={true}
                onChangeText={val => {
                  const formatValue = val
                    .replace(/\D/g, '')
                    .replace(/^(\d{2})(\d{2})(\d{4})+$/, '$1/$2/$3');

                  onChange(formatValue);
                }}
                helperText={errorSchema.estrutura?.dataConstrucao?.message}
                error={!!errorSchema.estrutura?.dataConstrucao?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="estrutura.dataAssinatura"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Data de Assinatura"
                value={value}
                placeholder="Informe a data da construção..."
                returnKeyType={'send'}
                blurOnSubmit={false}
                keyboardType={'numeric'}
                onBlur={onBlur}
                maxLength={10}
                enablesReturnKeyAutomatically={true}
                onChangeText={val => {
                  const formatValue = val
                    .replace(/\D/g, '')
                    .replace(/^(\d{2})(\d{2})(\d{4})+$/, '$1/$2/$3');

                  onChange(formatValue);
                }}
                helperText={errorSchema.estrutura?.dataAssinatura?.message}
                error={!!errorSchema.estrutura?.dataAssinatura?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="estrutura.torres"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Torres"
                value={String(value || '')}
                placeholder="Informe o número de unidades..."
                returnKeyType={'send'}
                blurOnSubmit={false}
                keyboardType={'numeric'}
                onBlur={onBlur}
                enablesReturnKeyAutomatically={true}
                onChangeText={val =>
                  onChange(
                    val
                      .replace(/\D/g, '')
                      .replace(/^(\d{2})(\d{2})(\d{4})+$/, '$1/$2/$3'),
                  )
                }
                helperText={errorSchema.estrutura?.numeroUnidades?.message}
                error={!!errorSchema.estrutura?.numeroUnidades?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="estrutura.inventario"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Inventário"
                value={String(value || '')}
                placeholder="Informe o inventário..."
                returnKeyType={'send'}
                blurOnSubmit={false}
                keyboardType={'numeric'}
                onBlur={onBlur}
                enablesReturnKeyAutomatically={true}
                onChangeText={val =>
                  onChange(
                    val
                      .replace(/\D/g, '')
                      .replace(/^(\d{2})(\d{2})(\d{4})+$/, '$1/$2/$3'),
                  )
                }
                helperText={errorSchema.estrutura?.inventario?.message}
                error={!!errorSchema.estrutura?.inventario?.message}
              />
            )}
          />

          <Title variance="primary" size="lg" marginTop={40} width="65%">
            Informação sobre o endereço
          </Title>

          <Controller
            control={control}
            name="endereco.cidade"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Cidade"
                value={value}
                placeholder="Informe a cidade..."
                autoCapitalize={'words'}
                autoCorrect={false}
                returnKeyType={'next'}
                blurOnSubmit={false}
                onBlur={onBlur}
                enablesReturnKeyAutomatically={true}
                onChangeText={onChange}
                helperText={errorSchema.endereco?.cidade?.message}
                error={!!errorSchema.endereco?.cidade?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="endereco.cep"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="CEP"
                value={value}
                placeholder="Informe o CEP..."
                autoCapitalize={'words'}
                autoCorrect={false}
                returnKeyType={'next'}
                keyboardType="number-pad"
                blurOnSubmit={false}
                onBlur={onBlur}
                maxLength={9}
                enablesReturnKeyAutomatically={true}
                onChangeText={val => {
                  const formatValue = val
                    .replace(/\D/g, '')
                    .replace(/^(\d{5})(\d{3})+/, '$1-$2');

                  onChange(formatValue);
                }}
                helperText={errorSchema.endereco?.cep?.message}
                error={!!errorSchema.endereco?.cep?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="endereco.rua"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Rua"
                value={value}
                placeholder="Informe a rua..."
                autoCapitalize={'words'}
                autoCorrect={false}
                returnKeyType={'next'}
                blurOnSubmit={false}
                onBlur={onBlur}
                enablesReturnKeyAutomatically={true}
                onChangeText={onChange}
                helperText={errorSchema.endereco?.rua?.message}
                error={!!errorSchema.endereco?.rua?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="endereco.bairro"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Bairro"
                value={value}
                placeholder="Informe o bairro..."
                autoCapitalize={'words'}
                autoCorrect={false}
                returnKeyType={'next'}
                blurOnSubmit={false}
                onBlur={onBlur}
                enablesReturnKeyAutomatically={true}
                onChangeText={onChange}
                helperText={errorSchema.endereco?.bairro?.message}
                error={!!errorSchema.endereco?.bairro?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="endereco.numero"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Número"
                value={value ? value.toString() : ''}
                placeholder="Informe o número..."
                autoCapitalize={'words'}
                autoCorrect={false}
                returnKeyType={'next'}
                keyboardType="number-pad"
                blurOnSubmit={false}
                onBlur={onBlur}
                enablesReturnKeyAutomatically={true}
                onChangeText={onChange}
                helperText={errorSchema.endereco?.numero?.message}
                error={!!errorSchema.endereco?.numero?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="endereco.uf"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="UF"
                value={value ? value.toString() : ''}
                placeholder="Informe a UF..."
                autoCapitalize={'words'}
                autoCorrect={false}
                returnKeyType={'next'}
                blurOnSubmit={false}
                onBlur={onBlur}
                enablesReturnKeyAutomatically={true}
                onChangeText={onChange}
                helperText={errorSchema.endereco?.uf?.message}
                error={!!errorSchema.endereco?.uf?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="ativo"
            render={({ field: { value } }) => (
              <TouchableOpacity onPress={() => setOpenModal(true)}>
                <InputLabel fontSize={12} focus={false}>
                  Ativo
                </InputLabel>

                <Styled
                  type="row"
                  flex={1}
                  alignItems="baseline"
                  marginLeft={10}>
                  <Icon name="chevron-down" size={20} />
                  <Text
                    variance="primary"
                    fontSize={15}
                    marginLeft={15}
                    fontWeight="bold">
                    {value ? 'Ativado' : 'Desativado'}
                  </Text>
                </Styled>
              </TouchableOpacity>
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
              title={isEditScreen ? 'Salvar' : 'Criar'}
              size="md"
              width="70%"
              variance="primary"
              loading={loading}
              onPress={handleSubmit(submit, console.log)}
            />
          </Styled>
        </Styled>
      </Styled>
    </ScrollView>
  );
};

export default Create;
