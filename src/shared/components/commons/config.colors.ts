import Style from '../../../commons/Style';

export type VarianceColorsType =
  | 'primary'
  | 'secondary'
  | 'warning'
  | 'info'
  | 'danger';
export const VarianceColor: Record<VarianceColorsType, string> = {
  primary: Style.primary,
  secondary: Style.secondary,
  warning: Style.warning,
  danger: Style.danger,
  info: Style.info,
};

export const VarianceColors = (variance: VarianceColorsType) =>
  VarianceColor[variance];
