import { differenceInDays, format, isAfter } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { ImageBackground } from 'react-native';
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

const Index: React.FC = () => {
  const [preventivas, setPreventivas] = useState<IPreventiva[]>([]);

  const { navigate } = useNavigation();

  const preventivaActions = new PreventivaActions();

  const buscarPreventivas = async () => {
    const { data } = await preventivaActions.buscarTodos();

    if (data && Array.isArray(data)) {
      setPreventivas(data);
    } else {
      setPreventivas([]);
    }
  };

  useEffect(() => {
    buscarPreventivas();
  }, []);

  return (
    <Styled>
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
              backgroundColor={Style.theme.secondary[95]}
              borderRadius={30}
              height={150}
              css="margin: 10px 0px; padding: 0;">
              <ImageBackground
                source={{
                  uri: firstImage,
                  cache: 'force-cache',
                }}
                imageStyle={{
                  borderRadius: 30,
                  backgroundColor: 'grey',
                  height: '100%',
                }}
                style={{
                  flex: 1,

                  marginTop: -10,
                  borderRadius: 30,
                }}
              />
              <Styled width="60%">
                <Styled type="container" marginTop="auto">
                  <Text
                    textColor="black"
                    fontSize={18}
                    fontFamily="Poppins Medium">
                    {preventiva.localDesc}
                  </Text>
                  {estaAtrasada && (
                    <>
                      <Text
                        width={'35%'}
                        textColor="white"
                        fontSize={10}
                        borderRadius={15}
                        alignText="center"
                        backgroundColor={Style.theme.error[50]}>
                        Atrasada
                      </Text>
                    </>
                  )}

                  <Text
                    variance="secondary"
                    alignItems="center"
                    fontFamily="Poppins Regular">
                    <Icon
                      name="tasks"
                      color={Style.theme.secondary[30]}
                      size={13}
                    />{' '}
                    {qtdTarefas} {qtdTarefas > 1 ? 'tarefas' : 'tarefa'}
                  </Text>
                  <Text
                    textColor="white"
                    variance="darkenPrimary"
                    fontSize={12}
                    numberOfLines={estaAtrasada ? 2 : 3}
                    ellipsizeMode="tail"
                    fontFamily="Poppins Medium">
                    {preventiva.observacoes}
                  </Text>
                </Styled>
              </Styled>

              <Styled css="position: absolute; right: 20px; top: -8px;">
                <Text
                  backgroundColor={Style.theme.secondary[90]}
                  borderRadius={14}
                  paddingLeft={10}
                  paddingRight={10}
                  paddingBottom={5}
                  paddingTop={5}
                  fontWeight="700"
                  variance="darkenPrimary"
                  fontSize={12}>
                  {format(new Date(preventiva.data), 'dd/MM/yyyy')}
                </Text>
              </Styled>
            </Styled>
          </TouchableOpacity>
        );
      })}
    </Styled>
  );
};

export default Index;
