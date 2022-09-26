import { yupResolver } from '@hookform/resolvers/yup';
import RnDatePicker from '@react-native-community/datetimepicker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import {
  ImageBackground,
  Keyboard,
  ToastAndroid,
  TouchableOpacity,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { launchCamera } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/AntDesign';
import * as Yup from 'yup';
import { formatISOwithTimezone } from '../../../../commons/masks/masks';
import Style from '../../../../commons/Style';
import { ILocal } from '../../../../shared/@types/model/locais/locais';
import { buscarTodos } from '../../../../shared/@types/model/locais/locais.actions';
import { IPreventiva } from '../../../../shared/@types/model/preventivas/preventivas';
import { cadastrar } from '../../../../shared/@types/model/preventivas/preventivas.actions';
import {
  Button,
  ButtonOutline,
  ButtonText,
} from '../../../../shared/components/commons/Button';
import { Text, Title } from '../../../../shared/components/commons/Text';
import Input from '../../../../shared/components/Input';
import ListLoader from '../../../../shared/components/loaders/list.loader';
import Menu, { MenuItem } from '../../../../shared/components/Menu';
import { Styled } from '../../../../shared/utils/LayoutUtils/BaseStyle';
import ModalLocais from './index.cadastro.locais';

import storage from '@react-native-firebase/storage';

const schema: Yup.SchemaOf<IPreventiva> = Yup.object({
  id: Yup.string(),
  data: Yup.string()
    .required('obrigatório')
    .default(formatISOwithTimezone(new Date())),
  localId: Yup.string().required('Campo obrigatório'),
  localDesc: Yup.string(),

  tarefas: Yup.array()
    .of(
      Yup.object({
        andar: Yup.number()
          .required('Campo obrigatório')
          .typeError('Formato inválido'),
        ambiente: Yup.string().required('Campo obrigatório'),
        comofazer: Yup.string().required('Campo obrigatório'),
        imagesLink: Yup.array().of(
          Yup.object().shape({
            path: Yup.string(),
          }),
        ),
      }).required('Campo obrigatório'),
    )
    .min(1, 'Insira ao menos uma tarefa')
    .required('Campo obrigatório'),

  observacoes: Yup.string()
    .required('Campo obrigatório')
    .default('Teste de observação'),
});

const schemaTarefa = Yup.object({
  andar: Yup.number()
    .required('Campo obrigatório')
    .typeError('Formato inválido'),
  ambiente: Yup.string().required('Campo obrigatório'),
  comofazer: Yup.string().required('Campo obrigatório'),
  imagesLink: Yup.array()
    .of(
      Yup.object().shape({
        path: Yup.string(),
      }),
    )
    .default([]),
});

type TypeSchemaTarefa = Yup.InferType<typeof schemaTarefa>;

const Create = () => {
  const [openModal, setOpenModal] = useState({
    tarefa: false,
    selecaoLocal: false,
  });

  const { goBack } = useNavigation();
  const [showModalSelectDate, setShowModalSelectDate] = useState(false);
  const { params: locais } = useRoute();
  const isEditScreen = !!locais;

  const [loading, setLoading] = useState({
    localSearch: false,
    save: false,
  });

  const [idxTarefaToEdit, setIdxTarefaToEditt] = useState<number>();

  const [lstLocais, setLstLocais] = useState<ILocal[]>([]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    setError,
  } = useForm({
    defaultValues: (locais as IPreventiva) ?? schema.getDefault(),
    resolver: yupResolver(schema),
    mode: 'all',
  });

  const {
    control: controlTarefa,
    handleSubmit: submitTarefa,
    formState: { errors: errorsTarefa },
    setValue: setValueTarefa,
    setError: setErrorTarefa,
    reset: resetTarefa,
  } = useForm({
    defaultValues: schemaTarefa.getDefault(),
    resolver: yupResolver(schemaTarefa),
    mode: 'all',
  });

  const { append, remove, fields, update } = useFieldArray({
    name: 'tarefas',
    control,
  });

  const {
    append: appendImage,
    remove: removeImage,
    fields: images,
  } = useFieldArray({
    control: controlTarefa,
    name: 'imagesLink',
  });

  const submit = async () => {
    setLoading({ save: true, localSearch: false });

    Keyboard.dismiss();
    const values = getValues();

    delete values.localDesc;
    const { error, errorMessage } = await cadastrar(values);

    if (!error) {
      ToastAndroid.show(
        `Local ${isEditScreen ? 'salvo' : 'cadastrado'} com sucesso`,
        ToastAndroid.SHORT,
      );
      goBack();
    } else {
      ToastAndroid.show(
        String(errorMessage || 'Houve um erro na solicitação'),
        ToastAndroid.SHORT,
      );
    }

    setLoading({ save: false, localSearch: false });
  };

  const cadastrarTarefa = (cadastroTarefa: TypeSchemaTarefa) => {
    if (!cadastroTarefa) {
      setErrorTarefa('andar', {
        message: 'Cadastre ao menos 1 opção',
      });

      return;
    }

    setOpenModal({ selecaoLocal: false, tarefa: false });

    if (Number.isInteger(idxTarefaToEdit)) {
      update(idxTarefaToEdit ?? 0, cadastroTarefa);
    } else {
      append(cadastroTarefa);
    }
    setValueTarefa('andar', 0);
    setValueTarefa('ambiente', '');
    setValueTarefa('comofazer', '');
    setValueTarefa('imagesLink', []);
  };

  const buscarElementos = async () => {
    setLoading(curr => ({ ...curr, localSearch: true }));

    const { error, errorMessage, data } = await buscarTodos();

    if (!error && data) {
      setLstLocais(data);
    } else {
      ToastAndroid.show(
        String(errorMessage || 'Houve um erro na solicitação'),
        ToastAndroid.SHORT,
      );
    }

    setLoading(curr => ({ ...curr, localSearch: false }));
  };

  useEffect(() => {
    buscarElementos();
  }, []);

  return (
    <Styled
      type="container"
      lg="display: flex;"
      css="flex: 1; background-color: white; height: 100%;"
      borderTopRadius={30}>
      <ScrollView
        keyboardDismissMode="on-drag"
        contentContainerStyle={{ flex: 1, height: '100%' }}>
        <Styled
          sm="width: 100%; flex: 1;"
          lg="width: 50%;"
          css="align-self: center;  height: 100%;">
          {/* Modal de seleção do local */}
          <Menu
            show={openModal.selecaoLocal}
            onDismiss={() =>
              setOpenModal(curr => ({ ...curr, selecaoLocal: false }))
            }
            data={lstLocais}
            title="Local de manutenção"
            subtitle="Selecione um local de manutenção"
            renderItem={(item: ILocal) =>
              loading.localSearch ? (
                <ListLoader qtdItems={5} />
              ) : (
                <MenuItem
                  onClick={() => {
                    if (item.id) {
                      setValue('localDesc', item.nome);
                      setValue('localId', item.id);
                    }
                    setOpenModal(curr => ({ ...curr, selecaoLocal: false }));
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

          {/* Modal selecao de data */}
          {showModalSelectDate && (
            <RnDatePicker
              value={new Date(getValues('data')) || new Date()}
              mode="date"
              minimumDate={new Date()}
              onChange={(_: Event, date?: Date) => {
                if (date) {
                  const initialDay = date;

                  setValue('data', formatISOwithTimezone(initialDay));
                }

                setShowModalSelectDate(false);
              }}
            />
          )}

          {/* Modal cadastro de subsessoes */}
          <ModalLocais
            onAddClick={submitTarefa(cadastrarTarefa)}
            openModal={openModal.tarefa}
            handleCloseModal={() =>
              setOpenModal(curr => ({ ...curr, tarefa: false }))
            }>
            <Controller
              control={controlTarefa}
              name="andar"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Andar"
                  value={value}
                  placeholder="Informe o andar..."
                  autoCompleteType={'name'}
                  autoCapitalize={'sentences'}
                  autoCorrect={true}
                  returnKeyType={'go'}
                  blurOnSubmit={false}
                  onBlur={onBlur}
                  enablesReturnKeyAutomatically={true}
                  onChangeText={onChange}
                  helperText={errorsTarefa.andar?.message}
                  error={!!errorsTarefa.andar?.message}
                />
              )}
            />
            <Controller
              control={controlTarefa}
              name="ambiente"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Ambiente"
                  value={value}
                  placeholder="Informe o nome do ambiente..."
                  autoCompleteType={'name'}
                  autoCapitalize={'sentences'}
                  autoCorrect={true}
                  returnKeyType={'go'}
                  blurOnSubmit={false}
                  onBlur={onBlur}
                  enablesReturnKeyAutomatically={true}
                  onChangeText={onChange}
                  helperText={errorsTarefa.ambiente?.message}
                  error={!!errorsTarefa.ambiente?.message}
                />
              )}
            />
            <Controller
              control={controlTarefa}
              name="comofazer"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Como fazer"
                  value={value}
                  placeholder="Informe como realizar a tarefa..."
                  autoCompleteType={'name'}
                  autoCapitalize={'sentences'}
                  autoCorrect={true}
                  returnKeyType={'go'}
                  blurOnSubmit={false}
                  onBlur={onBlur}
                  enablesReturnKeyAutomatically={true}
                  onSubmitEditing={handleSubmit(cadastrarTarefa)}
                  onChangeText={onChange}
                  helperText={errorsTarefa.comofazer?.message}
                  error={!!errorsTarefa.comofazer?.message}
                />
              )}
            />

            <Styled
              type="row"
              alignItems="center"
              marginTop={15}
              marginLeft={12}>
              <Icon
                name="picture"
                size={25}
                color={Style.theme.secondary[40]}
              />
              <Text
                marginLeft={8}
                fontSize={20}
                fontWeight="700"
                textColor={Style.theme.secondary[50]}>
                Fotos
              </Text>
            </Styled>
            <Styled
              type="row"
              css=""
              borderRadius={20}
              paddingBottom={20}
              paddingTop={20}
              backgroundColor={Style.inputBackgroundColor}>
              <ScrollView
                horizontal
                contentContainerStyle={{ paddingHorizontal: 10 }}>
                {images.map((image, idxImage) => (
                  <ImageCard
                    image={image.path as never}
                    onDelete={() => removeImage(idxImage)}
                  />
                ))}
              </ScrollView>
            </Styled>
            <ButtonOutline
              marginTop={20}
              variance="darkenPrimary"
              leftIcon={
                <Icon
                  name="camera"
                  color={Style.theme.secondary[30]}
                  size={30}
                />
              }
              title="Adicionar fotos"
              size={'md'}
              onPress={async () => {
                launchCamera(
                  {
                    mediaType: 'photo',
                    cameraType: 'back',
                    includeBase64: true,
                    presentationStyle: 'overFullScreen',
                  },
                  callback => {
                    if (callback.assets && callback.assets.length > 0) {
                      const imageLocation = callback.assets[0].base64;

                      if (imageLocation) {
                        appendImage({
                          path: ('data:image/jpeg;base64,' +
                            imageLocation) as never,
                        });
                      }
                    }
                  },
                );
              }}
            />
          </ModalLocais>

          <Controller
            control={control}
            name="data"
            render={({ field: { onChange, onBlur, value } }) => (
              <TouchableOpacity
                onPress={() => setShowModalSelectDate(!showModalSelectDate)}>
                <Input
                  label="Data"
                  value={format(new Date(value), 'dd/MM/yyyy')}
                  placeholder="Informe a data da manutenção..."
                  autoCompleteType={'name'}
                  autoCapitalize={'words'}
                  autoCorrect={true}
                  editable={false}
                  inputStyle={{
                    color: Style.inputFontColor,
                  }}
                  returnKeyType={'next'}
                  blurOnSubmit={false}
                  onBlur={onBlur}
                  enablesReturnKeyAutomatically={true}
                  onChangeText={onChange}
                  helperText={errors.data?.message}
                  error={!!errors.data?.message}
                />
              </TouchableOpacity>
            )}
          />

          <Controller
            control={control}
            name="localDesc"
            render={({ field: { onChange, onBlur, value } }) => (
              <TouchableOpacity
                onPress={() =>
                  setOpenModal(curr => ({ ...curr, selecaoLocal: true }))
                }>
                <Input
                  label="Local"
                  value={value}
                  placeholder="Selecione o local..."
                  editable={false}
                  inputStyle={{
                    color: Style.inputFontColor,
                  }}
                  autoCompleteType={'name'}
                  autoCapitalize={'sentences'}
                  autoCorrect={true}
                  returnKeyType={'next'}
                  blurOnSubmit={false}
                  onBlur={onBlur}
                  enablesReturnKeyAutomatically={true}
                  onChangeText={onChange}
                  helperText={errors.localId?.message}
                  error={!!errors.localId?.message}
                />
              </TouchableOpacity>
            )}
          />
          <Controller
            control={control}
            name="observacoes"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Observacões"
                value={value}
                placeholder="Informe as observacões..."
                autoCompleteType={'name'}
                autoCapitalize={'sentences'}
                autoCorrect={true}
                returnKeyType={'next'}
                blurOnSubmit={false}
                onBlur={onBlur}
                enablesReturnKeyAutomatically={true}
                onChangeText={onChange}
                helperText={errors.localId?.message}
                error={!!errors.localId?.message}
              />
            )}
          />

          <Styled
            type="row"
            justifyContent="space-between"
            alignItems="center"
            css="margin: 0px 20px;">
            <Text variance="darkenPrimary" fontWeight="900" size="md">
              Lista de tarefas
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
              onPress={() => {
                resetTarefa({ imagesLink: [] });
                setOpenModal(curr => ({ ...curr, tarefa: true }));
              }}
            />
          </Styled>
          <Text variance="danger" fontWeight="bold">
            {errors.tarefas?.message}
          </Text>

          <ScrollView>
            {fields.map((x, index) => (
              <TouchableOpacity
                onPress={() => {
                  setIdxTarefaToEditt(index);

                  resetTarefa(x);
                  setOpenModal({ tarefa: true, selecaoLocal: false });
                }}>
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
                      Andar: {x.andar}
                    </Text>
                    <Text variance="darkenPrimary" fontWeight="bold">
                      Ambiente: {x.ambiente}
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
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Styled type="row" css="margin-top: auto; width: 100%;">
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
              loading={loading.save}
              onPress={handleSubmit(submit)}
            />
          </Styled>
        </Styled>
      </ScrollView>
    </Styled>
  );
};

const ImageCard: React.FC<{ image: string; onDelete: () => void }> = ({
  image,
  onDelete,
}) => (
  <ImageBackground
    source={{
      uri: image,
    }}
    imageStyle={{
      borderRadius: 10,
    }}
    style={{ height: 110, width: 110, marginHorizontal: 5 }}>
    <TouchableOpacity
      style={{
        position: 'absolute',
        top: 6,
        right: 6,
      }}
      onPress={() => onDelete()}>
      <Icon
        name="closecircle"
        color={Style.theme.error[50]}
        size={30}
        style={{
          elevation: 5,
          backgroundColor: 'white',
          borderRadius: 50,
        }}
      />
    </TouchableOpacity>
  </ImageBackground>
);

export default Create;
