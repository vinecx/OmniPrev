import { format } from 'date-fns';
import React, { useRef } from 'react';
import {
  Animated,
  ImageBackground,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { ICorretiva } from '../../../shared/@types/model/corretivas/corretivas';
import { Text } from '../../../shared/components/commons/Text';
import { Styled } from '../../../shared/utils/LayoutUtils/BaseStyle';

import storage from '@react-native-firebase/storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { heightPercentageToDP } from '../../../commons/Dimensions';
import Style from '../../../commons/Style';
import { ScreenName } from '../../../routes/screens.enum';

const headerHeight = 350;

let scrollValue = 0;
let headerVisible = true;

const Index: React.FC = () => {
  const corretiva = useRoute().params as ICorretiva | undefined;

  // #region Animations
  const animation = useRef(new Animated.Value(1)).current;
  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, headerHeight / 2 - 70],
  });

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = e.nativeEvent.contentOffset.y;

    if (y > scrollValue && headerVisible && y > headerHeight / 2 - 70) {
      Animated.spring(animation, {
        toValue: 0,
        useNativeDriver: true,
        bounciness: 0,
      }).start();
      headerVisible = false;
    }
    if (y < scrollValue && !headerVisible) {
      Animated.spring(animation, {
        toValue: 1,
        useNativeDriver: true,
        bounciness: 0,
      }).start();
      headerVisible = true;
    }
    scrollValue = y;
  };
  // #endregion

  const { navigate } = useNavigation();

  if (!corretiva) {
    return <Text>Nada para carregar</Text>;
  }

  // Get first task image
  let firstImage: string = '';
  const { tarefas } = corretiva;
  const qtdTarefas = tarefas ? tarefas.length : 0;

  if (tarefas && tarefas.length > 0) {
    if (tarefas[0].imagesLink.length > 0) {
      firstImage = tarefas[0].imagesLink[0].path;
      storage()
        .ref(firstImage)
        .getDownloadURL()
        .then(link => {
          firstImage = link;
        })
        .catch(() => {});
    }
  }

  return (
    <ScrollView contentContainerStyle={{ flex: 1 }}>
      <Styled height={heightPercentageToDP('40')}>
        <ImageBackground
          blurRadius={10}
          source={{
            uri: firstImage,
          }}
          imageStyle={{
            flex: 1,
            backgroundColor: Style.theme.darkenPrimary,
            height: headerHeight,
          }}
          style={{
            flex: 1,
            opacity: 0.7,
            height: headerHeight,
          }}
        />
      </Styled>
      <Animated.View
        pointerEvents="auto"
        style={[styles.header, { transform: [{ translateY }] }]}>
        <ScrollView
          onScroll={onScroll}
          style={{
            flex: 1,
            marginTop: -headerHeight / 2 - 50,
            borderTopRightRadius: 30,
            borderTopLeftRadius: 30,
            backgroundColor: 'white',
          }}>
          <Styled
            flex={1}
            marginBottom={70}
            borderTopRadius={40}
            css="padding: 20px 28px;">
            <Text
              variance="primary"
              fontSize={32}
              fontFamily="Poppins Medium"
              marginBottom={-22}>
              {corretiva?.localDesc}
            </Text>
            <Styled type="row" marginLeft={5}>
              <Text
                variance="secondary"
                fontFamily="Poppins Medium"
                fontSize={12}>
                <Icon
                  name="calendar"
                  color={Style.theme.secondary[30]}
                  size={10}
                />
                {'  '}
                {format(new Date(corretiva?.data ?? new Date()), 'dd/MM/yyyy')}
              </Text>
              <Text
                marginLeft={15}
                textColor="white"
                fontSize={12}
                variance="secondary"
                fontFamily="Poppins Medium">
                <Icon
                  name="tasks"
                  color={Style.theme.secondary[30]}
                  size={10}
                />
                {'  '}
                {qtdTarefas} {qtdTarefas > 1 ? 'tarefas' : 'tarefa'}
              </Text>
            </Styled>
            <Text
              textColor="white"
              variance="darkenPrimary"
              fontSize={13}
              fontFamily="Poppins Medium">
              {corretiva?.observacoes}
            </Text>

            <Text
              textColor="white"
              variance="darkenPrimary"
              fontSize={20}
              numberOfLines={3}
              marginTop={25}
              ellipsizeMode="tail"
              fontFamily="Poppins Medium">
              Tarefas:
            </Text>
            {corretiva.tarefas.map((tarefa, idxTarefa) => (
              <TouchableOpacity
                onPress={() =>
                  navigate(
                    ScreenName.Main_Corretivas_tarefas as never,
                    {
                      idCorretiva: corretiva.id,
                      idTarefa: idxTarefa,
                      tarefa: tarefa,
                    } as never,
                  )
                }>
                <Styled
                  type="row"
                  borderColor={Style.theme.secondary[80]}
                  css="border: 1px; border-radius: 20; margin-bottom: 10px; padding: 10px 15px">
                  <Styled width="80%">
                    <Text fontFamily="Poppins SemiBold">{tarefa.ambiente}</Text>
                    <Text variance="darkenPrimary" fontFamily="Poppins Medium">
                      {tarefa.comofazer}
                    </Text>
                  </Styled>
                  {tarefa.concluida && (
                    <Styled marginLeft="auto">
                      <Text
                        textColor="white"
                        fontSize={10}
                        backgroundColor="green"
                        fontWeight="500"
                        style={{ paddingHorizontal: 10, borderRadius: 15 }}>
                        {tarefa.concluida ? 'Concluida' : 'A fazer'}
                      </Text>
                    </Styled>
                  )}
                </Styled>
              </TouchableOpacity>
            ))}
          </Styled>
        </ScrollView>
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    minHeight: '100%',
    paddingBottom: headerHeight / 2 + 100,
  },
});

export default Index;
