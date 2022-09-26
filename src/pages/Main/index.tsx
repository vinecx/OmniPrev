import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ImageBackground, ToastAndroid, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useSelector } from 'react-redux';
import { TIP_USUARIOS } from '../../shared/enum';
import RenderIf from '../../shared/utils/RenderIf';
import { IRootState } from 'store';
import Image from '../../assets/images/login.jpeg';
import Style from '../../commons/Style';
import { hasPermissionToAcess, ScreenName } from '../../routes/screens.enum';
import { Text, Title } from '../../shared/components/commons/Text';
import { Styled } from '../../shared/utils/LayoutUtils/BaseStyle';
import { CardContainer, CardTitle } from './styles';
import { buscarTodos } from '../../shared/@types/model/preventivas/preventivas.actions';
import { IPreventiva } from '../../shared/@types/model/preventivas/preventivas';
import { format } from 'date-fns';
const Main: React.FC = () => {
  const { navigate } = useNavigation();
  const tipUsuario = useSelector<IRootState, TIP_USUARIOS | undefined>(
    state => state.auth.user?.tipUsuario,
  );

  const [preventivas, setPreventivas] = useState<IPreventiva[]>([]);

  const shortcuts = [
    {
      name: 'Preventivas',
      screen: ScreenName.Preventivas,
      icon: 'tools',
      hasAccess: hasPermissionToAcess(ScreenName.Preventivas, tipUsuario),
    },
    {
      name: 'Usuários',
      screen: ScreenName.Usuarios,
      icon: 'user-friends',
      hasAccess: hasPermissionToAcess(ScreenName.Usuarios, tipUsuario),
    },
    {
      name: 'Clientes',
      screen: ScreenName.Clientes,
      icon: 'user-tag',
      hasAccess: hasPermissionToAcess(ScreenName.Clientes, tipUsuario),
    },
    {
      name: 'Items',
      screen: ScreenName.Items,
      icon: 'archive',
      hasAccess: hasPermissionToAcess(ScreenName.Items, tipUsuario),
    },
    {
      name: 'Locais',
      screen: ScreenName.Locais,
      icon: 'map-marked',
      hasAccess: hasPermissionToAcess(ScreenName.Items, tipUsuario),
    },
  ];

  const hasShortcutsToShow = shortcuts.some(x => x.hasAccess);

  const buscarPreventivas = async () => {
    const { data, error, errorMessage } = await buscarTodos();

    if (!error) {
      setPreventivas(data);
    } else {
      ToastAndroid.show(
        'Erro ao buscar preventivas. ' + errorMessage,
        ToastAndroid.SHORT,
      );
    }
  };

  useEffect(() => {
    buscarPreventivas();
  }, []);

  return (
    <ScrollView contentContainerStyle={{ minHeight: '100%' }}>
      <ImageBackground
        source={Image}
        resizeMode="cover"
        style={{
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          paddingVertical: 20,
        }}
        imageStyle={{
          opacity: 0.6,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
        }}>
        <RenderIf condition={hasShortcutsToShow}>
          <Styled css="margin-bottom: 30px;">
            <Styled
              type="row"
              marginBottom={-10}
              marginLeft={25}
              alignItems="center">
              <Icon name="star" size={15} color={Style.theme.secondary[99]} />
              <Text
                textColor={Style.theme.secondary[99]}
                marginLeft={8}
                fontWeight="700">
                Acesso rápido
              </Text>
            </Styled>

            <ScrollView
              horizontal
              centerContent
              contentContainerStyle={{
                paddingHorizontal: 10,
                marginBottom: 8,
              }}>
              {shortcuts.map(shortcut => (
                <CardContainer>
                  <TouchableOpacity
                    onPress={() => navigate(shortcut.screen as never)}>
                    <Styled type="row" alignItems="center">
                      <Icon
                        name={shortcut.icon}
                        size={18}
                        color={Style.theme.secondary[30]}
                      />
                      <CardTitle>{shortcut.name}</CardTitle>
                    </Styled>
                  </TouchableOpacity>
                </CardContainer>
              ))}
            </ScrollView>
          </Styled>
        </RenderIf>
      </ImageBackground>

      <Styled
        flex={1}
        backgroundColor="white"
        css="margin-top: -40px; padding: 25px 20px;"
        borderTopRadius={30}>
        <Title textColor={Style.theme.secondary[30]} fontSize={25}>
          Bem vindo ao OmniPrev
        </Title>
        <Text
          fontSize={15}
          fontWeight="300"
          textColor={Style.theme.secondary[60]}>
          Acesse o menu lateral para acessar as demais funcionalidades!
        </Text>

        <Styled marginTop={25}>
          <Text
            fontSize={27}
            fontWeight="500"
            textColor={Style.theme.mainColor}>
            Preventivas
          </Text>

          <Styled>
            {preventivas.map(preventiva => {
              let firstImage: string;
              const { tarefas } = preventiva;
              if (tarefas.length > 0) {
                if (tarefas[0].imagesLink.length > 0) {
                  firstImage = tarefas[0].imagesLink[0].path;
                }
              }

              return (
                <ImageBackground
                  blurRadius={10}
                  source={{
                    uri: firstImage,
                  }}
                  imageStyle={{
                    borderRadius: 30,
                    backgroundColor: 'grey',
                    opacity: 0.7,
                  }}
                  style={{
                    height: 250,
                    width: '100%',
                    backgroundColor: 'black',
                    borderRadius: 30,
                    marginTop: 15,
                    elevation: 10,
                  }}>
                  <Styled type="container" marginTop="auto">
                    <Text fontWeight="800" textColor="white" fontSize={25}>
                      {format(new Date(preventiva.data), 'dd/MM/yyyy')}
                    </Text>
                    <Text textColor="white" fontSize={20} fontWeight="300">
                      {preventiva.localDesc}
                    </Text>
                  </Styled>
                </ImageBackground>
              );
            })}
          </Styled>
        </Styled>
      </Styled>
    </ScrollView>
  );
};

export default Main;
