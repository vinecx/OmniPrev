import React, { useState } from 'react';
import {
  Platform,
  StyleSheet,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';
import { Styled } from '../../../shared/utils/LayoutUtils/BaseStyle';

import styled from 'styled-components/native';

import Style from '../../../commons/Style';
import { ICommonPropsStyle, PropsStyle } from '../commons/interface';
import Icon from 'react-native-vector-icons/Ionicons';

export interface InputProps extends ICommonPropsStyle {
  hasError?: boolean;
  focus: boolean;
}

export const InputGroup = styled.View<InputProps>`
  flex-direction: column;
  position: relative;
  ${props => PropsStyle(props)}
`;

export const Row = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const styles = (
  hasError: boolean,
  focus: boolean,
  editable?: boolean = true,
) => {
  let inputBorderColor;

  if (hasError) {
    inputBorderColor = Style.textError;
  } else {
    if (focus) {
      inputBorderColor = Style.inputFocusBorderColor;
    } else {
      inputBorderColor = Style.inputBorderColor;
    }
  }

  return StyleSheet.create({
    input: {
      paddingHorizontal: 25,
      paddingVertical: 12,
      flex: 1,
      borderColor: inputBorderColor,
      borderRadius: Style.inputBorderRadius,
      backgroundColor: Style.inputBackgroundColor,
      fontSize: Style.inputFontSize,
      fontWeight: Style.inputFontWeight,
      color: editable ? Style.inputFontColor : Style.inputFontColorDisabled,
      borderWidth: Style.inputBorderWidth,
    },
  });
};

export const InputLabel = styled.Text<InputProps>`
  margin-top: 15px;
  margin-left: 20px;
  margin-bottom: 2px;

  font-size: ${Style.inputLabelFontSize};
  font-weight: ${Style.inputLabelFontWeight};
  color: ${props =>
    props.focus ? Style.inputLabelFocusColor : Style.inputLabelColor};
  font-family: ${Style.fontFamilyMulish};

  ${props => PropsStyle(props)}
`;

export const HelperText = styled.Text.attrs({
  enabled: Platform.OS === 'ios',
  behavior: 'padding',
  keyboardVerticalOffset: Platform.OS === 'ios' ? 40 : 0,
})<InputProps>`
  margin-left: 10px;
  font-weight: 400;
  font-size: 12px;
  color: ${props =>
    props.hasError ? Style.textError : Style.fontColorDarkGrey};
`;

export interface IInputProps extends ICommonPropsStyle, TextInputProps {
  label: string;
  placeholder?: string;
  onChangeText: (value: string) => void;
  error?: boolean;
  helperText?: string;
}

const Input: React.FC<IInputProps> = props => {
  const {
    label,
    onChangeText,
    value,
    placeholder,
    error,
    helperText,
    editable,
  } = props;
  const [focused, setIsfocused] = useState(false);

  return (
    <InputGroup hasError={error ?? false} focus={focused} {...props}>
      <InputLabel focus={focused} hasError={error ?? false} fontSize={12}>
        {label}
      </InputLabel>

      <Row>
        <TextInput
          {...props}
          style={styles(error ?? false, focused, editable).input}
          value={value?.toString()}
          placeholder={placeholder}
          placeholderTextColor={Style.inputPlaceholderColor}
          onChange={e => {
            onChangeText(e.nativeEvent.text);

            e.preventDefault();
            e.stopPropagation();
          }}
          onFocus={() => setIsfocused(true)}
          onBlur={() => setIsfocused(false)}
        />
      </Row>
      {!!helperText && (
        <HelperText focus={focused} hasError={error ?? false}>
          {helperText}
        </HelperText>
      )}
    </InputGroup>
  );
};

export const InputPassword: React.FC<IInputProps> = props => {
  const [showPassword, setShowPassword] = useState(true);
  return (
    <>
      <Input {...props} secureTextEntry={showPassword} />
      <Styled css="position: absolute; right: 20; top: 50;">
        <TouchableOpacity
          onPress={() => setShowPassword(curr => !curr)}
          hitSlop={{
            bottom: 15,
            top: 15,
            left: 20,
            right: 50,
          }}>
          <Icon
            name={showPassword ? 'eye' : 'eye-off'}
            size={25}
            color={Style.inputPlaceholderColor}
          />
        </TouchableOpacity>
      </Styled>
    </>
  );
};
export default Input;
