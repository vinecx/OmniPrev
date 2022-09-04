const mainColor = '#322d5c';

const theme = {
  mainColor: mainColor,
  primary: '#534bae',
  secondary: '#8889cf',
  darkenPrimary: '#3E3B63',
  darkenSecondary: '#8079C9',

  lighterPrimary: '#966edf',
  lighterSecondary: '#eeedff',
};

const InputStyles = {
  inputLabelColor: theme.darkenPrimary,
  inputLabelFocusColor: theme.primary,
  inputLabelFontSize: '10px',
  inputLabelFontWeight: 'bold',

  inputBorderRadius: 30,
  inputBorderWidth: 3,
  inputFontColor: theme.primary,
  inputFontColorDisabled: '#a0a0a0',
  inputPlaceholderColor: '#a0a0a0',
  inputFontSize: 13,
  inputFontWeight: 'bold',
  inputBorderColor: 'transparent',
  inputHoverBorderColor: theme.primary,
  inputFocusBorderColor: theme.primary,
  inputBackgroundColor: '#e7e8eb',
};

const drawerStyle = {
  itemFontColor: theme.primary,
  itemBackgroundColor: theme.secondary,
};

const Style = {
  theme: theme,
  danger: '#dc3545',
  warning: '#ffc107',
  info: '#17a2b8',

  mainColor: mainColor,
  cleanColor: '#f5f5f5',
  cleanColorDarker: '#eeeeee',
  cleanColorLighter: '#ffffff',

  textError: '#E12',
  fontColorDark: '#212121',
  fontSizeSmall: '12px',
  backgroundColorGrey: '#F8F8F8',
  fontSizeDefault: '16px',

  fontFamilyMulish: 'Mulish',
  fontColorDarkGrey: 'grey',
  fontColorLightGrey: 'hsl(0, 0%, 90%)',
  textSuccess: 'hls(120, 50%, 45%)',

  ...InputStyles,
  drawer: drawerStyle,
};

export default Style;
