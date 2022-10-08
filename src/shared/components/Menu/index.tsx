import React from 'react';
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  VirtualizedList,
} from 'react-native';
import Animated, {
  SlideOutDown,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Style from '../../../commons/Style';
import { useOrientation } from '../../../shared/utils/CustomHooks/useOrientation';
import { Styled } from '../../../shared/utils/LayoutUtils/BaseStyle';
import RenderIf from '../../../shared/utils/RenderIf';
import { Text, Title } from '../commons/Text';

interface IMenuProps {
  show: boolean;
  title?: string;
  subtitle?: string;
  onDismiss: () => void;
  noOptionText?: string;
  animatedOnOpen?: boolean;

  data: any[];
  renderItem: (value: any) => React.ReactFragment;
}

const Menu: React.FC<IMenuProps> = ({
  show,
  title,
  subtitle,
  onDismiss,
  data,
  renderItem,
  noOptionText,
  animatedOnOpen = true,
}) => {
  const orientation = useOrientation();
  const isPortrait = orientation === 'PORTRAIT';

  const offset = useSharedValue(-150);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: -offset.value }],
    };
  });

  if (show) {
    offset.value = -1000;
    offset.value = withTiming(0, {
      duration: 500,
    });
  } else {
    offset.value = withTiming(-1000, {
      duration: 500,
    });
  }

  return (
    <Modal
      visible={show}
      onDismiss={onDismiss}
      transparent={true}
      statusBarTranslucent={true}>
      <TouchableWithoutFeedback onPress={onDismiss}>
        <View style={styles.container}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                animatedOnOpen && animatedStyles,
                styles.contentContainer,
                {
                  maxHeight: isPortrait ? '50%' : '90%',
                  width: isPortrait ? '100%' : '60%',
                },
              ]}
              exiting={SlideOutDown.duration(350)}>
              <RenderIf condition={!!title}>
                <Title variance="primary" fontSize={30} fontWeight="400">
                  {title}
                </Title>
              </RenderIf>
              <RenderIf condition={!!subtitle}>
                <Text variance="secondary" marginBottom={25} fontWeight="300">
                  {subtitle}
                </Text>
              </RenderIf>

              <RenderIf condition={data.length <= 0}>
                <Text
                  variance="secondary"
                  flex={1}
                  alignText="center"
                  alignTextVertical="center">
                  {noOptionText ?? 'Sem opções para selecionar'}
                </Text>
              </RenderIf>
              <VirtualizedList
                initialNumToRender={4}
                data={data}
                getItem={(values, index) => values[index]}
                getItemCount={values => values.length}
                renderItem={({ item }) => <>{renderItem(item)}</> ?? <></>}
              />
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export interface IMenuItem {
  onClick: () => void;
}
export const MenuItem: React.FC<IMenuItem> = ({ onClick, children }) => {
  return (
    <TouchableOpacity onPress={onClick}>
      <Styled css="padding: 10px 15px; border-radius: 40; margin-bottom: 10px; background-color: white;">
        {children}
      </Styled>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0, 0.3)',
  },
  contentContainer: {
    width: '100%',

    backgroundColor: Style.cleanColorDarker,

    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,

    paddingVertical: 22,
    paddingHorizontal: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,

    elevation: 24,
  },
});

export default Menu;
