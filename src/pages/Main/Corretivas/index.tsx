import storage from '@react-native-firebase/storage';
import { useNavigation } from '@react-navigation/native';
import { differenceInDays, format, formatDistance } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, ImageBackground } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome5';
import ListLoader from '../../../shared/components/loaders/list.loader';

import Style from '../../../commons/Style';
import { ScreenName } from '../../../routes/screens.enum';
import { ICorretiva } from '../../../shared/@types/model/corretivas/corretivas';
import CorretivaActions from '../../../shared/@types/model/corretivas/corretivas.actions';
import { Text } from '../../../shared/components/commons/Text';
import { Styled } from '../../../shared/utils/LayoutUtils/BaseStyle';

const Index: React.FC = () => {
  const [corretivas, setCorretivas] = useState<ICorretiva[]>([]);
  const [loading, setLoading] = useState(false);
  const { navigate } = useNavigation();

  const corretivaActions = new CorretivaActions();

  const buscarTodas = async () => {
    setLoading(true);
    const { data } = await corretivaActions.buscarTodos();

    if (data && Array.isArray(data)) {
      setCorretivas(data);
    } else {
      setCorretivas([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    buscarTodas();
  }, []);

  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (corretivas.length > 0) {
      Animated.timing(animation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [corretivas]);

  if (loading) {
    return <ListLoader qtdItems={15} />;
  }

  return (
    <Animated.View style={[{ opacity: animation }]}>
      {corretivas.map(corretiva => {
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

        const estaAtrasada =
          Math.sign(differenceInDays(new Date(corretiva.data), new Date())) < 0;

        return (
          <TouchableOpacity
            onPress={() =>
              navigate('root.corretivas', {
                screen: ScreenName.Main_Corretivas,
                params: corretiva,
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
                    {corretiva.localDesc}
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
                        Atrasada{' há '}
                        {formatDistance(new Date(), new Date(corretiva.data), {
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
                    {corretiva.observacoes}
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
                  fontSize={12}>
                  {format(new Date(corretiva.data), 'dd/MM/yyyy')}
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
