import Style from '../../../commons/Style';

export type VarianceColorsType =
  | 'primary'
  | 'secondary'
  | 'warning'
  | 'info'
  | 'danger'
  | 'darkenPrimary'
  | 'darkenSecondary'
  | 'lighterPrimary'
  | 'lighterSecondary';
export const VarianceColor: Record<VarianceColorsType, string> = {
  primary: Style.theme.primary,
  secondary: Style.theme.secondary,
  warning: Style.warning,
  danger: Style.danger,
  info: Style.info,
  darkenPrimary: Style.theme.darkenPrimary,
  darkenSecondary: Style.theme.darkenSecondary,
  lighterPrimary: Style.theme.lighterPrimary,
  lighterSecondary: Style.theme.lighterSecondary,
};

export const VarianceColors = (variance: VarianceColorsType) =>
  VarianceColor[variance];
