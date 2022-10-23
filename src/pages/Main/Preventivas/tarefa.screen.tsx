import React, { useState } from 'react';
import { ImageBackground, ToastAndroid } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

import AntIcon from 'react-native-vector-icons/AntDesign';
import { ITarefaPM } from '../../../shared/@types/model/preventivas/preventivas';
import { Text } from '../../../shared/components/commons/Text';
import { Styled } from '../../../shared/utils/LayoutUtils/BaseStyle';

import { useNavigation, useRoute } from '@react-navigation/native';
import { Modal, TouchableOpacity } from 'react-native';
import { heightPercentageToDP } from '../../../commons/Dimensions';
import Style from '../../../commons/Style';
import { Button } from '../../../shared/components/commons/Button';
import Input from '../../../shared/components/Input';
import { ScrollView } from 'react-native-gesture-handler';
import { object, string } from 'yup';
import { Controller, FieldValue, FieldValues, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import PreventivaActions from '../../../shared/@types/model/preventivas/preventivas.actions';
import RenderIf from '../../../shared/utils/RenderIf';
import { format } from 'date-fns';

interface IParamsTarefa {
  idPreventiva: string;
  idTarefa: number;
  tarefa: ITarefaPM;
}

const schema = object({
  observacoes: string().required('Campo obrigatório'),
});

const Index: React.FC = () => {
  const { idPreventiva, idTarefa, tarefa } = useRoute().params as IParamsTarefa;

  const preventivaRepo = new PreventivaActions();

  const { goBack } = useNavigation();

  const { control, handleSubmit } = useForm({
    resolver: yupResolver(schema),
  });

  const [modalImage, setModalImage] = useState({
    show: false,
    imageUri: '',
  });

  if (!tarefa) {
    return <Text>Nada para carregar</Text>;
  }

  const submit = async (observacoes: FieldValues) => {
    const { error, errorMessage } = await preventivaRepo.concluirTarefa(
      idPreventiva,
      idTarefa,
      observacoes.observacoes,
    );

    if (error) {
      ToastAndroid.show(
        'Ocorreu um erro: ' + JSON.stringify(errorMessage),
        ToastAndroid.LONG,
      );
    } else {
      tarefa.concluida = {
        data: new Date(),
        observacao: observacoes.observacoes,
      };
    }
    goBack();
  };

  return (
    <ScrollView
      contentContainerStyle={{
        minHeight: '100%',
        backgroundColor: 'white',
        borderTopRightRadius: 25,
        borderTopLeftRadius: 25,
        justifyContent: 'space-evenly',
      }}>
      <Styled css="padding: 20px 28px;">
        <Styled>
          <Text variance="primary" fontSize={32} fontFamily="Poppins Medium">
            {tarefa?.ambiente}
          </Text>

          <RenderIf condition={!!tarefa.concluida}>
            <Styled
              type="row"
              marginTop={-10}
              marginBottom={25}
              alignItems="center"
              css="padding: 0;">
              <Icon name="check-circle" size={12} color="green" />
              <Text
                textColor="green"
                fontSize={12}
                alignTextVertical="center"
                fontWeight="500"
                marginLeft={5}>
                Concluída em:{' '}
                {format(
                  new Date(tarefa.concluida?.data || new Date()),
                  'dd/MM/yyyy hh:mm',
                )}
              </Text>
            </Styled>
          </RenderIf>

          <Styled>
            <Text
              textColor="white"
              fontSize={12}
              variance="secondary"
              fontFamily="Poppins Bold">
              <Icon name="tasks" color={Style.theme.secondary[30]} size={10} />
              {'  '}Como fazer:
            </Text>
            <Text
              textColor="white"
              fontSize={12}
              variance="secondary"
              fontFamily="Poppins Medium">
              {tarefa.comofazer}
            </Text>
          </Styled>
        </Styled>
      </Styled>

      <Text
        marginTop={25}
        marginLeft={28}
        textColor="white"
        fontSize={20}
        variance="secondary"
        fontFamily="Poppins Medium">
        Fotos do ambiente
      </Text>

      {/* Imagens da tarefa */}
      <ScrollView horizontal contentContainerStyle={{ paddingHorizontal: 28 }}>
        {tarefa.imagesLink.map(image => (
          <TouchableOpacity
            onPress={() => setModalImage({ imageUri: image.path, show: true })}>
            <ImageBackground
              resizeMode="cover"
              source={{
                uri: image.path,
                cache: 'force-cache',
              }}
              imageStyle={{
                backgroundColor: Style.theme.secondary[90],
                height: 150,
                width: 150,
                borderRadius: 20,
              }}
              style={{ height: 150, width: 150, marginRight: 15 }}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Formulário de descrição da realização da tarefa */}

      <RenderIf condition={!tarefa.concluida}>
        <Styled style={{ paddingHorizontal: 28, marginBottom: 25 }}>
          <Controller
            control={control}
            name="observacoes"
            render={({ field, fieldState, formState }) => (
              <Input
                label="Observações (Obrigatório)"
                multiline={true}
                inputStyle={{
                  minHeight: 120,
                  maxHeight: 150,
                }}
                value={field.value}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                numberOfLines={5}
                textAlignVertical="top"
                onChangeText={field.onChange}
              />
            )}
          />
          <Button
            marginTop={15}
            leftIcon={<Icon name="check" color="white" size={20} />}
            variance={'primary'}
            onPress={() => handleSubmit(submit)()}
            size={'md'}
            title="Concluir a tarefa"
          />
        </Styled>
      </RenderIf>
      <RenderIf condition={!!tarefa.concluida}>
        <Text
          marginLeft={28}
          textColor="white"
          marginBottom={25}
          fontSize={15}
          variance="secondary"
          fontFamily="Poppins Medium">
          Observações:{'\n'}
          {tarefa.concluida?.observacao}
        </Text>
      </RenderIf>

      <Modal
        onRequestClose={() => setModalImage(curr => ({ ...curr, show: false }))}
        visible={modalImage.show}
        onDismiss={() => setModalImage(curr => ({ ...curr, show: false }))}
        style={{
          flex: 1,
          backgroundColor: 'green',
        }}>
        <>
          <Styled flex={1}>
            <ImageBackground
              source={{
                uri: modalImage.imageUri,
              }}
              imageStyle={{
                flex: 1,
              }}
              style={{ flex: 1 }}>
              <Styled css="margin-left: auto; padding: 20px 28px;">
                <TouchableOpacity
                  onPress={() => {
                    setModalImage(curr => ({ ...curr, show: false }));
                  }}>
                  <AntIcon name="closecircle" size={30} />
                </TouchableOpacity>
              </Styled>
            </ImageBackground>
          </Styled>
        </>
      </Modal>
    </ScrollView>
  );
};

export default Index;
