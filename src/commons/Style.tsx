const mainColor = '#322d5c';

const theme = {
  mainColor: mainColor,
  primary: '#534bae',
  secondaryColor: '#8889cf',
  darkenPrimary: '#3E3B63',
  darkenSecondary: '#8079C9',

  lighterPrimary: '#966edf',
  lighterSecondary: '#eeedff',

  secondary: {
    0: '#000000',
    10: '#1D192B',
    20: '#332D41',
    30: '#4A4458',
    40: '#625B71',
    50: '#7A7289',
    60: '#958DA5',
    70: '#B0A7C0',
    80: '#CCC2DC',
    90: '#E8DEF8',
    95: '#F6EDFF',
    99: '#FFFBFE',
  },

  error: {
    0: '#000000',
    10: '#410E0B',
    20: '#601410',
    30: '#8C1D18',
    40: '#B3261E',
    50: '#DC362E',
    60: '#E46962',
    70: '#EC928E',
    80: '#F2B8B5',
    90: '#F9DEDC',
    95: '#FCEEEE',
    99: '#FFFBF9',
  },
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
  itemBackgroundColor: theme.secondary[40],
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
  backgroundColorGrey: 'hsl(0, 0%, 90%)',
  textSuccess: 'hls(120, 50%, 45%)',

  ...InputStyles,
  drawer: drawerStyle,
};

export default Style;
