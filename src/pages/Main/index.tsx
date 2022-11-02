import { useNavigation } from '@react-navigation/native';
import React, { useRef, useState } from 'react';
import {
  Animated,
  ImageBackground,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
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

import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthState } from '../../shared/@types/auth/types';
import Corretivas from './Corretivas';

const Main: React.FC = () => {
  const { navigate } = useNavigation();
  const { user } = useSelector<IRootState, AuthState>(state => state.auth);

  const [showList, setShowList] = useState<'preventivas' | 'corretivas'>(
    'preventivas',
  );

  const [loading, setLoading] = useState(false);
  const shortcuts = [
    {
      name: 'Preventivas',
      screen: ScreenName.Preventivas,
      icon: 'tools',
      hasAccess: hasPermissionToAcess(ScreenName.Preventivas, user?.tipUsuario),
    },
    {
      name: 'Corretivas',
      screen: ScreenName.Corretivas,
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

  const load = () => {
    setLoading(true);
  };
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
        transform: [{ rotate: '180deg' }],
      }}>
      <SafeAreaView>
        <RenderIf condition={hasShortcutsToShow}>
          <Styled css="margin-bottom: 30px; marginTop: 30px;">
            <Styled
              type="row"
              marginBottom={-10}
              marginLeft={25}
              alignItems="center">
              <Icon name="star" size={11} color={Style.theme.secondary[70]} />
              <Text
                fontSize={13}
                textColor={Style.theme.secondary[80]}
                marginLeft={8}
                fontWeight="400">
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
            refreshControl={
              <RefreshControl onRefresh={() => load()} refreshing={loading} />
            }
            contentContainerStyle={{
              minHeight: '100%',
              paddingHorizontal: 28,
              paddingVertical: 20,
            }}>
            <Title
              textColor={Style.theme.secondary[30]}
              fontSize={20}
              fontFamily="Poppins Medium">
              Olá, {user?.nome}
            </Title>
            <Text
              fontSize={12}
              fontWeight="300"
              fontFamily="Poppins Light"
              textColor={Style.theme.secondary[60]}>
              Acesse o menu lateral para acessar as demais funcionalidades!
            </Text>
            <Styled marginTop={25}>
              <Styled
                type="row"
                border="1px solid;"
                borderColor={Style.cleanColorDarker}
                borderRadius={50}
                css="padding: 0px;"
                marginBottom={25}
                style={{
                  justifyContent: 'space-between',
                }}>
                <TouchableOpacity
                  onPress={() => setShowList('preventivas')}
                  style={{
                    backgroundColor:
                      showList === 'preventivas'
                        ? Style.cleanColorDarker
                        : 'transparent',
                    flex: 1,
                    borderRadius: 50,
                  }}>
                  <Text
                    fontSize={18}
                    alignText="center"
                    fontFamily={
                      showList === 'preventivas'
                        ? 'Poppins Medium'
                        : 'Poppins Light'
                    }
                    textColor={
                      showList === 'preventivas'
                        ? Style.theme.mainColor
                        : Style.theme.secondary[50]
                    }>
                    Preventivas
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setShowList('corretivas')}
                  style={{
                    backgroundColor:
                      showList === 'corretivas'
                        ? Style.cleanColorDarker
                        : 'transparent',
                    flex: 1,
                    borderRadius: 50,
                    height: '100%',
                  }}>
                  <Text
                    fontSize={18}
                    alignText="center"
                    fontFamily={
                      showList === 'corretivas'
                        ? 'Poppins Medium'
                        : 'Poppins Light'
                    }
                    textColor={
                      showList === 'corretivas'
                        ? Style.theme.mainColor
                        : Style.theme.secondary[50]
                    }>
                    Corretivas
                  </Text>
                </TouchableOpacity>
              </Styled>
              {showList === 'preventivas' ? (
                <Styled>
                  <Preventivas />
                </Styled>
              ) : (
                <Styled>
                  <Corretivas />
                </Styled>
              )}
            </Styled>
          </ScrollView>
        </Styled>
      </Animated.View>
    </ImageBackground>
  );
};

export default Main;
