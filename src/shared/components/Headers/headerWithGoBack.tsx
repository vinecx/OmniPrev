import { DrawerHeaderProps } from '@react-navigation/drawer/lib/typescript/src/types';
import React from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/AntDesign';
import { Styled } from '../../../shared/utils/LayoutUtils/BaseStyle';
import Style from '../../../commons/Style';
import { ScreenName } from '../../../routes/screens.enum';
import { Title } from '../commons/Text';
import { SafeAreaView } from 'react-native-safe-area-context';

const HeaderWithGoBack: React.FC<DrawerHeaderProps> = props => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Styled>
        <Styled>
          <Title fontSize={15}>
            {props.options.headerTitle || props.route.name}
          </Title>

          <TouchableOpacity
            onPress={() => {
              props.navigation.reset({
                index: 0,
                routes: [{ name: ScreenName.InitialPage }],
              });
            }}>
            <Icon name="close" size={15} color={Style.mainColor} />
          </TouchableOpacity>
        </Styled>
      </Styled>
    </SafeAreaView>
  );
};

export default HeaderWithGoBack;
