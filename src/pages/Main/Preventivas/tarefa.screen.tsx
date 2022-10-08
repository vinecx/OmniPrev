import React, { useState } from 'react';
import { ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

import AntIcon from 'react-native-vector-icons/AntDesign';
import { ITarefaPM } from '../../../shared/@types/model/preventivas/preventivas';
import { Text } from '../../../shared/components/commons/Text';
import { Styled } from '../../../shared/utils/LayoutUtils/BaseStyle';

import { useRoute } from '@react-navigation/native';
import { Modal, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { heightPercentageToDP } from '../../../commons/Dimensions';
import Style from '../../../commons/Style';
import { SafeAreaView } from 'react-native-safe-area-context';

const Index: React.FC = () => {
  const tarefas = useRoute().params as ITarefaPM | undefined;
  const [modalImage, setModalImage] = useState({
    show: false,
    imageUri: '',
  });

  if (!tarefas) {
    return <Text>Nada para carregar</Text>;
  }

  return (
    <>
      <Styled flex={1} backgroundColor="white" css="padding: 20px 28px;">
        <Styled>
          <Text variance="primary" fontSize={32} fontFamily="Poppins Medium">
            {tarefas?.ambiente}
          </Text>
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
              {tarefas.comofazer}
            </Text>
          </Styled>
          <Text
            textColor="white"
            fontSize={20}
            variance="secondary"
            fontFamily="Poppins Medium">
            Fotos do ambiente
          </Text>
        </Styled>

        <Styled
          type="row"
          css={`
            height: ${heightPercentageToDP('40')};
          `}>
          {tarefas.imagesLink.map(image => (
            <TouchableOpacity
              onPress={() =>
                setModalImage({ imageUri: image.path, show: true })
              }>
              <ImageBackground
                resizeMode="cover"
                source={{
                  uri: image.path,
                  cache: 'force-cache',
                }}
                imageStyle={{
                  backgroundColor: Style.theme.secondary[90],
                  height: 120,
                  width: 120,
                }}
                style={{ height: 120, width: 120, marginRight: 15 }}
              />
            </TouchableOpacity>
          ))}
        </Styled>
      </Styled>
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
    </>
  );
};

export default Index;
