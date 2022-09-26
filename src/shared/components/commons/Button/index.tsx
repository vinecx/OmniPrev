import React from 'react';
import RenderIf from '../../../../shared/utils/RenderIf';
import Style from '../../../../commons/Style';
import { Text } from '../Text';
import {
  IPropsButtonStyle,
  ButtonOutlineStyle,
  ButtonStyle,
  ButtonTextStyle,
} from './index.styles';
import { ActivityIndicator } from 'react-native';
import { Styled } from '../../../../shared/utils/LayoutUtils/BaseStyle';

interface IButtonProps extends IPropsButtonStyle {
  title?: string;
  loading?: boolean;
  onPress?: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
  onLongPress?: () => void;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<IButtonProps> = props => {
  return (
    <ButtonStyle
      {...props}
      onPress={props.onPress}
      onPressIn={props.onPressIn}
      onPressOut={props.onPressOut}
      onLongPress={props.onLongPress}>
      <Styled type="row" css="align-content: center;">
        <RenderIf condition={!props.loading}>
          <RenderIf condition={!!props.leftIcon}>
            <Styled css="align-content: center; justify-content: center; position: absolute; top: 25%; bottom: 25%; left: 15px;">
              {props.leftIcon}
            </Styled>
          </RenderIf>
          <RenderIf condition={!!props.rightIcon}>
            <Styled />
          </RenderIf>
        </RenderIf>

        <Text
          size={props.size}
          alignText="center"
          marginLeft="auto"
          marginRight="auto"
          alignTextVertical={props.alignTextVertical ?? 'center'}
          fontWeight={props.fontWeight ?? 'bold'}
          textColor={props.textColor ?? Style.cleanColor}>
          <RenderIf condition={!!props.title && !props.loading}>
            {props.title}
          </RenderIf>
          <RenderIf condition={!!props.loading}>
            <Styled
              type="none"
              css="align-content: center; justify-content: center;">
              <ActivityIndicator animating color={Style.cleanColor} />
            </Styled>
          </RenderIf>
        </Text>

        <RenderIf condition={!props.loading}>
          <RenderIf condition={!!props.leftIcon}>
            <Styled />
          </RenderIf>
          <RenderIf condition={!props.loading && !!props.rightIcon}>
            <Styled css="align-content: center; justify-content: center;">
              {props.rightIcon}
            </Styled>
          </RenderIf>
        </RenderIf>
      </Styled>
    </ButtonStyle>
  );
};

export const ButtonOutline: React.FC<IButtonProps> = props => {
  return (
    <ButtonOutlineStyle
      {...props}
      onPress={props.onPress}
      onPressIn={props.onPressIn}
      onPressOut={props.onPressOut}
      onLongPress={props.onLongPress}>
      <Styled type="row" css="align-content: center;">
        <RenderIf condition={!props.loading}>
          <RenderIf condition={!!props.leftIcon}>
            <Styled css="align-content: center; justify-content: center; position: absolute; top: 25%; bottom: 25%; left: 15px;">
              {props.leftIcon}
            </Styled>
          </RenderIf>
          <RenderIf condition={!!props.rightIcon}>
            <Styled />
          </RenderIf>
        </RenderIf>

        <Text
          size={props.size}
          variance={props.variance}
          alignText="center"
          marginLeft="auto"
          marginRight="auto"
          alignTextVertical="center"
          fontWeight="bold"
          textColor={Style.cleanColor}>
          <RenderIf condition={!!props.title && !props.loading}>
            {props.title}
          </RenderIf>
          <RenderIf condition={!!props.loading}>
            <ActivityIndicator animating color={Style.cleanColor} />
          </RenderIf>
        </Text>

        <RenderIf condition={!props.loading}>
          <RenderIf condition={!!props.leftIcon}>
            <Styled />
          </RenderIf>
          <RenderIf condition={!props.loading && !!props.rightIcon}>
            <Styled css="align-content: center; justify-content: center;">
              {props.rightIcon}
            </Styled>
          </RenderIf>
        </RenderIf>
      </Styled>
    </ButtonOutlineStyle>
  );
};

export const ButtonText: React.FC<IButtonProps> = props => {
  return (
    <ButtonTextStyle
      {...props}
      onPress={props.onPress}
      onPressIn={props.onPressIn}
      onPressOut={props.onPressOut}
      onLongPress={props.onLongPress}>
      <Styled type="row" css="align-content: center; justify-content: center;">
        <RenderIf condition={!props.loading}>
          <RenderIf condition={!!props.leftIcon}>
            <Styled css="align-content: center; justify-content: center; position: absolute; top: 25%; bottom: 25%; left: 15px;">
              {props.leftIcon}
            </Styled>
          </RenderIf>
        </RenderIf>

        <Text
          size={props.size}
          variance={props.variance}
          alignText="center"
          alignTextVertical="center"
          fontWeight="bold"
          textColor={Style.cleanColor}>
          <RenderIf condition={!!props.title && !props.loading}>
            {props.title}
          </RenderIf>
          <RenderIf condition={!!props.loading}>
            <ActivityIndicator animating color={Style.cleanColor} />
          </RenderIf>
          <RenderIf condition={!props.loading}>
            <RenderIf condition={!!props.rightIcon}>{props.rightIcon}</RenderIf>
          </RenderIf>
        </Text>
      </Styled>
    </ButtonTextStyle>
  );
};
