import React from 'react';
import { ICommonPropsStyle } from 'src/shared/components/commons/interface';
import { useOrientation } from '../CustomHooks/useOrientation';
import { Types, TypesNames } from './StyledLayout';

interface PropsStyledCompontent extends ICommonPropsStyle {
  type?: TypesNames;
  sm: string;
  lg: string;
  css?: string;
}

export const Styled: React.FC<PropsStyledCompontent> = props => {
  const orientation = useOrientation();

  const Component = Types[props.type || 'none'].component;
  return (
    <Component
      {...props}
      styleText={
        (orientation === 'PORTRAIT' ? props.sm : props.lg) + props.css
      }>
      {props.children}
    </Component>
  );
};
