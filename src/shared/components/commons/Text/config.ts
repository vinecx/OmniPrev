import { VarianceSizesType } from '../config.sizes';

const VarianceTextSizesRecord: Record<VarianceSizesType, string> = {
  xxsm: 'font-size: 12px;',
  sm: 'font-size: 10px;',
  md: 'font-size: 18px;',
  lg: 'font-size: 25px;',
  xxlg: 'font-size: 30px;',
};

export const VariancesTextSizes = (size: VarianceSizesType) =>
  VarianceTextSizesRecord[size];
