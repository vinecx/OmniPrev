import { VarianceSizesType } from '../config.sizes';

export const VarianceButtonSizes: Record<VarianceSizesType, string> = {
  xxsm: 'padding: 0px 5px;',
  sm: 'padding: 0px 10px;',
  md: 'padding: 0px 10px;',
  lg: 'padding: 0px 12px;',
  xxlg: 'padding: 0px 16px;',
};

export const VariancesSizes = (variance: VarianceSizesType) =>
  VarianceButtonSizes[variance];
