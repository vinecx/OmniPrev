import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef } from 'react';
import { ImageBackground, TouchableOpacity, Animated } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useSelector } from 'react-redux';
import { IRootState } from 'store';
import Image from '../../assets/images/login.jpeg';
import Style from '../../commons/Style';
import { hasPermissionToAcess, ScreenName } from '../../routes/screens.enum';
import { Text, Title } from '../../shared/components/commons/Text';
import { Styled } from '../../shared/utils/LayoutUtils/BaseStyle';
import RenderIf from '../../shared/utils/RenderIf';
import { CardContainer, CardTitle } from './styles';

import Preventivas from './Preventivas';
import { AuthState } from '../../shared/@types/auth/types';
import { SafeAreaView } from 'react-native-safe-area-context';

const Main: React.FC = () => {
  const { navigate } = useNavigation();
  const { user } = useSelector<IRootState, AuthState>(state => state.auth);

  const shortcuts = [
    {
      name: 'Preventivas',
      screen: ScreenName.Preventivas,
      icon: 'tools',
      hasAccess: hasPermissionToAcess(ScreenName.Preventivas, user?.tipUsuario),
    },
    {
      name: 'Usuários',
      screen: ScreenName.Usuarios,
      icon: 'user-friends',
      hasAccess: hasPermissionToAcess(ScreenName.Usuarios, user?.tipUsuario),
    },
    {
      name: 'Clientes',
      screen: ScreenName.Clientes,
      icon: 'user-tag',
      hasAccess: hasPermissionToAcess(ScreenName.Clientes, user?.tipUsuario),
    },
    {
      name: 'Itens',
      screen: ScreenName.Itens,
      icon: 'archive',
      hasAccess: hasPermissionToAcess(ScreenName.Itens, user?.tipUsuario),
    },
    {
      name: 'Locais',
      screen: ScreenName.Locais,
      icon: 'map-marked',
      hasAccess: hasPermissionToAcess(ScreenName.Itens, user?.tipUsuario),
    },
  ];

  const hasShortcutsToShow = shortcuts.some(x => x.hasAccess);

  // Animations
  const zoom = useRef(new Animated.Value(100)).current;

  Animated.timing(zoom, {
    toValue: 0,
    delay: 200,
    duration: 500,
    useNativeDriver: true,
  }).start();

  return (
    <ImageBackground
      source={Image}
      resizeMode="cover"
      style={{
        flex: 1,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingTop: 20,
      }}
      imageStyle={{
        flex: 1,
        opacity: 0.5,
      }}>
      <SafeAreaView>
        <RenderIf condition={hasShortcutsToShow}>
          <Styled css="margin-bottom: 30px; marginTop: 30px;">
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

            <Animated.View style={{ transform: [{ translateY: zoom }] }}>
              <ScrollView
                horizontal
                centerContent
                contentContainerStyle={{
                  paddingHorizontal: 10,
                  marginBottom: 8,
                }}>
                {shortcuts.map(
                  shortcut =>
                    shortcut.hasAccess && (
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
                    ),
                )}
              </ScrollView>
            </Animated.View>
          </Styled>
        </RenderIf>
      </SafeAreaView>

      <Animated.View style={{ transform: [{ translateY: zoom }], flex: 1 }}>
        <Styled flex={1} backgroundColor="white" borderTopRadius={30}>
          <ScrollView
            contentContainerStyle={{
              minHeight: '100%',
              paddingHorizontal: 28,
              paddingVertical: 20,
            }}>
            <Title
              textColor={Style.theme.secondary[30]}
              fontSize={25}
              fontFamily="Poppins Medium">
              Olá, {user?.nome}
            </Title>
            <Text
              fontSize={15}
              fontWeight="300"
              fontFamily="Poppins Light"
              textColor={Style.theme.secondary[60]}>
              Acesse o menu lateral para acessar as demais funcionalidades!
            </Text>

            <Styled marginTop={25}>
              <Text
                fontSize={20}
                fontWeight="500"
                fontFamily="Poppins Light"
                textColor={Style.theme.secondary[50]}>
                Preventivas
              </Text>
              <Preventivas />
            </Styled>
          </ScrollView>
        </Styled>
      </Animated.View>
    </ImageBackground>
  );
};

export default Main;
