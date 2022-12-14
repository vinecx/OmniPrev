import { differenceInDays, format, formatDistance } from 'date-fns';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, ImageBackground } from 'react-native';
import { IPreventiva } from '../../../shared/@types/model/preventivas/preventivas';
import PreventivaActions from '../../../shared/@types/model/preventivas/preventivas.actions';
import { Text } from '../../../shared/components/commons/Text';
import { Styled } from '../../../shared/utils/LayoutUtils/BaseStyle';
import Icon from 'react-native-vector-icons/FontAwesome5';

import storage from '@react-native-firebase/storage';
import Style from '../../../commons/Style';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { ScreenName } from '../../../routes/screens.enum';
import { ptBR } from 'date-fns/locale';
import ListLoader from '../../../shared/components/loaders/list.loader';

const Index: React.FC = () => {
  const [preventivas, setPreventivas] = useState<IPreventiva[]>([]);
  const [loading, setLoading] = useState(false);
  const { navigate } = useNavigation();

  const preventivaActions = new PreventivaActions();

  const buscarPreventivas = async () => {
    setLoading(true);
    const { data } = await preventivaActions.buscarTodos();

    if (data && Array.isArray(data)) {
      setPreventivas(data);
    } else {
      setPreventivas([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    buscarPreventivas();
  }, []);

  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (preventivas.length > 0) {
      Animated.timing(animation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [preventivas]);

  if (loading) {
    return <ListLoader qtdItems={15} />;
  }

  return (
    <Animated.View style={[{ opacity: animation }]}>
      {preventivas.map(preventiva => {
        let firstImage: string = '';
        const { tarefas } = preventiva;
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

        const estaAtrasada =
          Math.sign(differenceInDays(new Date(preventiva.data), new Date())) <
          0;

        return (
          <TouchableOpacity
            onPress={() =>
              navigate('root.preventivas', {
                screen: ScreenName.Main_preventivas,
                params: preventiva,
              })
            }>
            <Styled
              type="row"
              backgroundColor={Style.cleanColor}
              borderRadius={30}
              height={150}
              css="margin: 15px 0px; padding: 0;">
              <ImageBackground
                source={{
                  uri: firstImage,
                  cache: 'force-cache',
                }}
                imageStyle={{
                  borderRadius: 30,
                  backgroundColor: 'lightgrey',
                  height: '100%',
                }}
                style={{
                  flex: 1,

                  marginTop: -15,
                  borderRadius: 30,
                }}
              />
              <Styled width="60%">
                <Styled type="container" marginTop="auto" marginBottom="auto">
                  <Text
                    textColor="black"
                    fontSize={16}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    fontFamily="Poppins Medium">
                    {preventiva.localDesc}
                  </Text>
                  {estaAtrasada && (
                    <>
                      <Text
                        width={'70%'}
                        textColor={Style.theme.error[40]}
                        fontSize={10}
                        borderRadius={15}
                        fontWeight="600"
                        alignText="center"
                        border="1px solid"
                        borderColor={Style.theme.error[50]}>
                        Atrasada{' h?? '}
                        {formatDistance(new Date(), new Date(preventiva.data), {
                          locale: ptBR,
                        })}
                      </Text>
                    </>
                  )}

                  <Text
                    variance="secondary"
                    alignItems="center"
                    fontSize={11}
                    fontFamily="Poppins Regular">
                    <Icon
                      name="tasks"
                      color={Style.theme.secondary[60]}
                      size={10}
                    />{' '}
                    {qtdTarefas} {qtdTarefas > 1 ? 'tarefas' : 'tarefa'}
                  </Text>
                  <Text
                    textColor="white"
                    variance="darkenPrimary"
                    fontSize={11}
                    numberOfLines={estaAtrasada ? 2 : 3}
                    ellipsizeMode="tail"
                    fontFamily="Poppins Medium">
                    {preventiva.observacoes}
                  </Text>
                </Styled>
              </Styled>

              <Styled css="position: absolute; right: 20px; top: -8px;">
                <Text
                  backgroundColor={Style.cleanColorLighter}
                  border="1px solid"
                  borderColor={Style.cleanColorDarker}
                  borderRadius={14}
                  paddingLeft={10}
                  paddingRight={10}
                  paddingBottom={5}
                  paddingTop={5}
                  fontWeight="700"
                  variance="darkenPrimary"
                  fontSize={10}>
                  {format(new Date(preventiva.data), 'dd/MM/yyyy')}
                </Text>
              </Styled>
            </Styled>
          </TouchableOpacity>
        );
      })}
    </Animated.View>
  );
};

export default Index;
