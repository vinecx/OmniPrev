import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect } from 'react';
import {
  Controller,
  useFieldArray,
  useForm,
  useFormContext,
} from 'react-hook-form';
import { ScrollView } from 'react-native-gesture-handler';
import { launchCamera } from 'react-native-image-picker';
import { Modal } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

import * as Yup from 'yup';
import Style from '../../../../commons/Style';
import {
  IPreventiva,
  ITarefaPM,
} from '../../../../shared/@types/model/preventivas/preventivas';
import {
  Button,
  ButtonOutline,
} from '../../../../shared/components/commons/Button';
import { Text } from '../../../../shared/components/commons/Text';
import Input from '../../../../shared/components/Input';
import { Styled } from '../../../../shared/utils/LayoutUtils/BaseStyle';
import ImageCard from './ImageCard';

interface IModalLocaisProps {
  openModal: boolean;
  handleCloseModal: () => void;
  cadastro?: {
    tarefa: ITarefaPM;
    idxToUpdate: number;
  };
}

const schemaTarefa: Yup.SchemaOf<ITarefaPM> = Yup.object({
  andar: Yup.number()
    .required('Campo obrigatório')
    .typeError('Formato inválido')
    .default(1),
  ambiente: Yup.string().required('Campo obrigatório').default('Cloud Storage'),
  comofazer: Yup.string()
    .required('Campo obrigatório')
    .default('Teste cloud Storage'),
  imagesLink: Yup.array()
    .of(
      Yup.object().shape({
        path: Yup.string().required('obrigatório'),
        fileName: Yup.string().required('obrigatório'),
        fileSize: Yup.number().required('obrigatório'),
      }),
    )
    .default([])
    .defined()
    .required('Imagens do ambiente são obrigatório'),
});

const ModalLocais: React.FC<IModalLocaisProps> = ({
  openModal,
  handleCloseModal,
  cadastro,
}) => {
  const { control } = useFormContext<IPreventiva>();
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

  const { append, update } = useFieldArray({
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

  const cadastrarTarefa = (
    cadastroTarefa: Yup.InferType<typeof schemaTarefa>,
  ) => {
    if (!cadastroTarefa) {
      setErrorTarefa('andar', {
        message: 'Cadastre ao menos 1 opção',
      });

      return;
    }

    if (cadastroTarefa.imagesLink && cadastroTarefa.imagesLink?.length === 0) {
      setErrorTarefa('imagesLink', {
        message: 'Cadastre ao menos 1 foto',
      });

      return;
    }

    if (cadastro) {
      if (Number.isInteger(cadastro.idxToUpdate)) {
        update(cadastro.idxToUpdate, {
          ambiente: cadastroTarefa.ambiente,
          andar: cadastroTarefa.andar,
          comofazer: cadastroTarefa.comofazer,
          imagesLink: cadastroTarefa.imagesLink ?? [],
        });
      }
    } else {
      append({
        ambiente: cadastroTarefa.ambiente,
        andar: cadastroTarefa.andar,
        comofazer: cadastroTarefa.comofazer,
        imagesLink: cadastroTarefa.imagesLink ?? [],
      });
    }

    setValueTarefa('andar', 0);
    setValueTarefa('ambiente', '');
    setValueTarefa('comofazer', '');
    setValueTarefa('imagesLink', []);
  };

  useEffect(() => {
    if (cadastro && cadastro.tarefa) {
      resetTarefa(cadastro.tarefa);
    } else {
      // resetTarefa({
      //   andar: undefined,
      //   ambiente: undefined,
      //   comofazer: undefined,
      //   imagesLink: [],
      // });
    }
  }, [cadastro]);

  return (
    <Modal visible={openModal}>
      <ScrollView
        contentContainerStyle={{
          minHeight: '100%',
        }}>
        <Styled flex={1} css="padding: 10px 15px;">
          {/* Forms */}

          <Controller
            control={controlTarefa}
            name="andar"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Andar"
                value={value?.toString()}
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
                value={String(value || '')}
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
                value={String(value || '')}
                placeholder="Descreva como realizar a tarefa..."
                autoCompleteType={'name'}
                autoCapitalize={'sentences'}
                autoCorrect={true}
                inputStyle={{
                  minHeight: 120,
                  maxHeight: 150,
                }}
                textAlignVertical="top"
                multiline
                returnKeyType={'none'}
                blurOnSubmit={false}
                onBlur={onBlur}
                onChangeText={onChange}
                helperText={errorsTarefa.comofazer?.message}
                error={!!errorsTarefa.comofazer?.message}
              />
            )}
          />

          <Styled type="row" alignItems="center" marginTop={15} marginLeft={12}>
            <Icon name="picture" size={25} color={Style.theme.secondary[40]} />
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
              contentContainerStyle={{
                paddingHorizontal: 10,
              }}>
              {images.length > 0 ? (
                images.map((image, idxImage) => (
                  <ImageCard
                    image={image.path as never}
                    onDelete={() => removeImage(idxImage)}
                  />
                ))
              ) : (
                <Text
                  alignText="center"
                  marginTop={30}
                  marginBottom={30}
                  textColor={Style.inputPlaceholderColor}
                  fontWeight={Style.inputFontWeight}>
                  Adicione imagens do ambiente...
                </Text>
              )}
            </ScrollView>
          </Styled>
          <Text textColor="red">{errorsTarefa.imagesLink?.message}</Text>

          <ButtonOutline
            marginTop={20}
            variance="darkenPrimary"
            leftIcon={
              <Icon name="camera" color={Style.theme.secondary[30]} size={30} />
            }
            title="Adicionar fotos"
            size={'md'}
            onPress={async () => {
              launchCamera(
                {
                  mediaType: 'photo',
                  cameraType: 'back',
                  presentationStyle: 'overFullScreen',
                },
                callback => {
                  if (callback.assets && callback.assets.length > 0) {
                    const imageLocation = callback.assets[0];

                    if (
                      imageLocation &&
                      imageLocation.fileName &&
                      imageLocation.fileSize
                    ) {
                      appendImage({
                        fileName: imageLocation.fileName,
                        fileSize: imageLocation.fileSize,
                        path: imageLocation.uri,
                      });
                    }
                  }
                },
              );
            }}
          />

          <Styled type="row" css=" width: 100%;" marginTop="auto">
            <Button
              title="Voltar"
              size="md"
              flex={1}
              variance="secondary"
              marginRight={10}
              onPress={() => handleCloseModal()}
            />
            <Button
              title="Adicionar"
              size="md"
              width="70%"
              variance="primary"
              onPress={() => submitTarefa(cadastrarTarefa)()}
            />
          </Styled>
        </Styled>
      </ScrollView>
    </Modal>
  );
};

export default ModalLocais;
