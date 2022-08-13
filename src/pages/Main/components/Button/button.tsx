import React from 'react';
import * as Components from './styles';

type ButtonProps = {
  label: string;
  icon: any;
  onPress?: () => void;
};

export const Button: React.FC<ButtonProps> = (props, rest) => {
  return (
    <Components.Button {...rest} onPress={props.onPress}>
      <Components.Logo source={props.icon} />
      <Components.Title>{props.label}</Components.Title>
    </Components.Button>
  );
};
