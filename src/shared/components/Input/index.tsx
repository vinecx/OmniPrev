import React, { useState } from 'react';
import { Platform, TextInputProps } from 'react-native';
import styled from 'styled-components/native';

import Style from '../../../commons/Style';
import { ICommonPropsStyle, PropsStyle } from '../commons/interface';

export interface InputProps extends ICommonPropsStyle {
  hasError?: boolean;
  focus: boolean;
}

export const InputGroup = styled.View<InputProps>`
  flex-direction: column;
  ${props => PropsStyle(props)}
`;

export const Row = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

export const TextInput = styled.TextInput<InputProps>`
  border: 2px solid
    ${props =>
    props.hasError
      ? `${Style.textError}`
      : `${props.focus ? Style.primary : Style.mainDisabledColor}`};
  border-radius: 15;
  padding: 10px 12px;
  flex: 1%;
  font-size: 16px;

  color: black;

  ${props => PropsStyle(props)}
`;

export const InputLabel = styled.Text<InputProps>`
  margin-top: 15px;
  margin-left: 10px;
  margin-bottom: 2px;
  font-size: 16px;
  font-weight: bold;
  color: ${Style.mainColor}
  font-family: ${Style.fontFamilyMulish};

   ${props => PropsStyle(props)}
`;

const HelperText = styled.Text.attrs({
  enabled: Platform.OS === 'ios',
  behavior: 'padding',
  keyboardVerticalOffset: Platform.OS === 'ios' ? 40 : 0,
}) <InputProps>`
  margin-left: 10px;
  font-weight: 400;
  font-size: 12px;
  color: ${props =>
    props.hasError ? Style.textError : Style.fontColorDarkGrey};
`;

export interface IInputProps extends ICommonPropsStyle {
  label: string;
  value?: string;
  placeholder?: string;
  onChangeText: (value: string) => void;
  error?: boolean;
  disabled?: boolean;
  helperText?: string;
  inputProps?: TextInputProps;
}

const Input: React.FC<IInputProps> = props => {
  const {
    label,
    onChangeText,
    value,
    placeholder,
    error,
    helperText,
    inputProps,
  } = props;
  const [focused, setIsfocused] = useState(false);
  return (
    <InputGroup hasError={error ?? false} focus={focused} {...props}>
      <InputLabel focus={focused} hasError={error ?? false} fontSize={12}>
        {label}
      </InputLabel>

      <Row>
        <TextInput
          {...inputProps}
          focus={focused}
          value={value || ''}
          returnKeyType="next"
          placeholder={placeholder}
          hasError={error ?? false}
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

export default Input;
