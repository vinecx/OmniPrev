import { FlexAlignType } from 'react-native';

export interface ICommonPropsStyle {
  flex?: number;
  backgroundColor?: string;

  textColor?: string;
  fontSize?: number;
  fontWeight?: string;
  alignText?: string;

  alignSelf?: FlexAlignType;
  alignTextVertical?: string;
  alignItems?: FlexAlignType;
  justifyContent?: FlexAlignType;

  border?: string;
  borderRadius?: string | number;
  borderColor?: string;

  height?: string | number;
  width?: string | number;

  marginTop?: string | number;
  marginBottom?: string | number;
  marginRight?: string | number;
  marginLeft?: string | number;

  paddingTop?: string | number;
  paddingBottom?: string | number;
  paddingRight?: string | number;
  paddingLeft?: string | number;
}

export const PropsStyle = (style: ICommonPropsStyle) => `
  ${style.flex ? 'flex: ' + style.flex : ''};
  ${style.backgroundColor ? 'background-color: ' + style.backgroundColor : ''};

  ${style.border ? 'border: ' + style.border : ''};
  ${style.borderRadius ? 'border-radius: ' + style.borderRadius : ''};
  ${style.borderColor ? 'border-color: ' + style.borderColor : ''};
  
  
  ${style.textColor ? 'color: ' + style.textColor : ''};
  ${style.fontSize ? 'font-size: ' + style.fontSize : ''};
  ${style.fontWeight ? 'font-weight: ' + style.fontWeight : ''};
  ${style.alignText ? 'text-align: ' + style.alignText : ''};
  ${
    style.alignTextVertical
      ? 'text-align-vertical: ' + style.alignTextVertical
      : ''
  };


  ${style.alignItems ? 'align-items: ' + style.alignItems : ''};
  ${style.alignSelf ? 'align-self: ' + style.alignSelf : ''};
  ${style.justifyContent ? 'justify-content: ' + style.justifyContent : ''};
  

  ${style.height ? 'height: ' + style.height : ''};
  ${style.width ? 'width: ' + style.width : ''};

  ${style.marginTop ? 'margin-top: ' + style.marginTop : ''};
  ${style.marginBottom ? 'margin-bottom: ' + style.marginBottom : ''};
  ${style.marginRight ? 'margin-right: ' + style.marginRight : ''};
  ${style.marginLeft ? 'margin-left: ' + style.marginLeft : ''};


  ${style.paddingTop ? 'padding-top: ' + style.paddingTop : ''};
  ${style.paddingBottom ? 'padding-bottom: ' + style.paddingBottom : ''};
  ${style.paddingRight ? 'padding-right: ' + style.paddingRight : ''};
  ${style.paddingLeft ? 'padding-left: ' + style.paddingLeft : ''};
  `;
