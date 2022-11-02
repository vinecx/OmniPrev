import { yupResolver } from '@hookform/resolvers/yup';
import RnDatePicker from '@react-native-community/datetimepicker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
} from 'react-hook-form';
import { Keyboard, ToastAndroid, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/AntDesign';
import * as Yup from 'yup';
import { formatISOwithTimezone } from '../../../../commons/masks/masks';
import Style from '../../../../commons/Style';
import { ILocal } from '../../../../shared/@types/model/locais/locais';
import LocaisActions from '../../../../shared/@types/model/locais/locais.actions';
import {
  ICorretiva,
  ITarefaPM,
} from '../../../../shared/@types/model/corretivas/corretivas';
import CorretivasActions from '../../../../shared/@types/model/corretivas/corretivas.actions';
import {
  Button,
  ButtonText,
} from '../../../../shared/components/commons/Button';
import { Text, Title } from '../../../../shared/components/commons/Text';
import Input from '../../../../shared/components/Input';
import ListLoader from '../../../../shared/components/loaders/list.loader';
import BottomSheet, { MenuItem } from '../../../../shared/components/Menu';
import { Styled } from '../../../../shared/utils/LayoutUtils/BaseStyle';
import ModalSubCadastro from './index.subcadastro';

import storage from '@react-native-firebase/storage';
import { ProgressBar } from 'react-native-paper';

const schema = Yup.object({
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
        imagesLink: Yup.array()
          .of(
            Yup.object().shape({
              path: Yup.string().required('Obrigatório'),
              fileName: Yup.string().required('Obrigatório'),
              fileSize: Yup.number().required('Obrigatório'),
            }),
          )
          .min(1, 'Insira ao menos uma imagem')
          .required('Imagens são obrigatórias'),
      }).required('Campo obrigatório'),
    )
    .min(1, 'Insira ao menos uma tarefa')
    .required('Campo obrigatório'),

  observacoes: Yup.string()
    .required('Campo obrigatório')
    .default('Teste de observação'),
});

const Create = () => {
  const [openModal, setOpenModal] = useState<{
    tarefa: boolean;
    selecaoLocal: boolean;
    uploadingImage: boolean;
  }>({
    tarefa: false,
    selecaoLocal: false,
    uploadingImage: false,
  });

  const corretivasActions = new CorretivasActions();

  const [fileUploadStatus, setFileUploadStatus] = useState<
    'IDLE' | 'UPLOADING'
  >('IDLE');
  const [filesUpload, setUploadFiles] = useState<
    { name: string; progress: number; uri: string; fileSize: number }[]
  >([]);

  const [tarefaToEdit, setTarefaToEdit] = useState<{
    idxToUpdate: number;
    tarefa: ITarefaPM;
  }>();

  const { goBack } = useNavigation();
  const [showModalSelectDate, setShowModalSelectDate] = useState(false);
  const { params: locais } = useRoute();
  const isEditScreen = !!locais;

  const [loading, setLoading] = useState({
    localSearch: false,
    save: false,
  });

  const [lstLocais, setLstLocais] = useState<ILocal[]>([]);

  const methods = useForm({
    defaultValues: (locais as ICorretiva) ?? schema.getDefault(),
    resolver: yupResolver(schema),
    mode: 'all',
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    watch,
    setValue,
  } = methods;

  const { remove } = useFieldArray({
    name: 'tarefas',
    control,
  });

  const fields = watch('tarefas');

  const hasImagesToUpload = filesUpload.length > 0;

  const submit = async () => {
    if (hasImagesToUpload && fileUploadStatus === 'IDLE') {
      setFileUploadStatus('UPLOADING');
      uploadImages();
    } else {
      setLoading({ save: true, localSearch: false });
      Keyboard.dismiss();
      const values = getValues();

      delete values.localDesc;
      const { error, errorMessage } = await corretivasActions.cadastrar(values);

      if (!error) {
        ToastAndroid.show(
          `Corretiva ${isEditScreen ? 'salvo' : 'cadastrado'} com sucesso`,
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
    }
  };

  //#region Locais
  const buscarLocais = async () => {
    setLoading(curr => ({ ...curr, localSearch: true }));

    const locaisActions = new LocaisActions();

    const { error, errorMessage, data } = await locaisActions.buscarTodos();

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
    buscarLocais();
  }, []);

  //#endregion

  const uploadImages = async () => {
    setOpenModal(curr => ({
      ...curr,
      uploadingImage: true,
    }));

    filesUpload.forEach(file => {
      const reference = storage().ref(`${file.name}`);
      const task = reference.putFile(file.uri);

      task.on('state_changed', taskSnapshot => {
        setUploadFiles(curr =>
          curr.map(x => {
            if (x.name === file.name) {
              x.progress =
                (taskSnapshot.bytesTransferred * 100) / (file.fileSize || 0);
            }

            return x;
          }),
        );
      });

      task.then(async () => {
        await reference
          .getDownloadURL()
          .then(link => {
            fields?.forEach((tarefa: ITarefaPM, idxTarefa) => {
              tarefa.imagesLink.forEach((image, idxImage) => {
                if (image.fileName === file.name) {
                  setValue(
                    `tarefas.${idxTarefa}.imagesLink.${idxImage}.path`,
                    link,
                  );
                }
              });

              return;
            });
          })
          .catch(() => {
            return;
          });

        setUploadFiles(curr => curr.filter(x => x.name !== file.name));
      });
    });
  };

  // Atualiza estado dos arquivos que devem ser enviados
  useEffect(() => {
    const imagesToUpload: {
      name: string;
      progress: number;
      uri: string;
      fileSize: number;
    }[] = [];

    fields?.forEach(tarefas => {
      tarefas.imagesLink
        .filter(image => image.path.startsWith('file:'))
        .forEach(image => {
          imagesToUpload.push({
            name: image.fileName,
            uri: image.path,
            progress: 0,
            fileSize: image.fileSize,
          });
        });
    });

    setUploadFiles(imagesToUpload);
  }, [fields]);

  // Close modal when the files already uploaded
  useEffect(() => {
    if (filesUpload.length === 0 && fileUploadStatus !== 'IDLE') {
      setOpenModal(curr => ({ ...curr, uploadingImage: false }));
      setFileUploadStatus('IDLE');
      submit();
    }
  }, [filesUpload]);

  return (
    <FormProvider {...methods}>
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
            <BottomSheet
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

            {/* Modal upload status */}
            <BottomSheet
              show={openModal.uploadingImage}
              animatedOnOpen={false}
              onDismiss={() => {}}
              data={filesUpload}
              title="Fazendo upload das imagens"
              subtitle="Aguarde enquanto o upload está sendo realizado..."
              renderItem={item => (
                <MenuItem onClick={() => {}}>
                  <Styled justifyContent="center" css="padding: 0px 12px;">
                    <Title fontSize={15} variance="primary">
                      {item.name}
                    </Title>

                    <ProgressBar
                      style={{
                        borderRadius: 20,
                        height: 15,
                      }}
                      indeterminate={false}
                      progress={item.progress / 100}
                    />
                    <Text size="sm" textColor="grey" fontWeight="600">
                      {item.progress === 0
                        ? 'Aguardando upload...'
                        : Number(item.progress).toFixed(2) + ' %'}
                    </Text>
                  </Styled>
                </MenuItem>
              )}
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

            {/* Modal cadastro de subsecoes */}

            <ModalSubCadastro
              openModal={openModal.tarefa}
              cadastro={tarefaToEdit}
              handleCloseModal={() => {
                setOpenModal(curr => ({ ...curr, tarefa: false }));
                setTarefaToEdit(undefined);
              }}
            />

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
                  returnKeyType={'next'}
                  inputStyle={{
                    minHeight: 120,
                    maxHeight: 150,
                  }}
                  textAlignVertical="top"
                  multiline
                  onBlur={onBlur}
                  enablesReturnKeyAutomatically={true}
                  onChangeText={onChange}
                  helperText={errors.observacoes?.message}
                  error={!!errors.observacoes?.message}
                />
              )}
            />

            <Styled
              type="row"
              justifyContent="space-between"
              alignItems="center"
              css="margin: 0px 20px;">
              <Text variance="darkenPrimary" fontWeight="900" size="md">
                Tarefas
              </Text>

              <Styled type="row" alignItems="center">
                <Icon
                  size={15}
                  name="pluscircle"
                  color={Style.theme.darkenSecondary}
                />
                <ButtonText
                  title="Adicionar"
                  variance="darkenSecondary"
                  size="sm"
                  onPress={() => {
                    setOpenModal(curr => ({ ...curr, tarefa: true }));
                    setTarefaToEdit(undefined);
                  }}
                />
              </Styled>
            </Styled>

            <Text variance="danger" fontWeight="bold">
              {errors.tarefas?.message}
            </Text>

            <ScrollView>
              {fields?.map((x, index) => (
                <TouchableOpacity
                  onPress={() => {
                    setTarefaToEdit({ tarefa: x, idxToUpdate: index });
                    setOpenModal(curr => ({
                      ...curr,
                      tarefa: true,
                      selecaoLocal: false,
                    }));
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
    </FormProvider>
  );
};

export default Create;
