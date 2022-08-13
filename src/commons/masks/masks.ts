import { MaskService } from 'react-native-masked-text';

export function maskMoney(numberToMask: string) {
  return MaskService.toMask('money', numberToMask, {
    unit: 'R$ ',
    separator: ',',
    delimiter: '.',
    precision: 0,
  });
}
export function unmaskMoney(numberToMask: string) {
  return MaskService.toRawValue('money', numberToMask, {
    unit: 'R$ ',
    separator: ',',
    delimiter: '.',
    precision: 0,
  });
}

export function maskDecimal(
  numberToMask: string,
  unit: string = '',
  precision: number = 2,
  maxDigits = 6,
) {
  return MaskService.toMask(
    'money',
    numberToMask.replace(',', '.').replace('.', '').substring(0, maxDigits),
    {
      unit: unit,
      separator: ',',
      precision: precision,
    },
  );
}
export function unmaskDecimal(numberToMask: string, precision: number = 2) {
  return MaskService.toRawValue('money', numberToMask, {
    precision: precision,
  });
}

export const formatISOwithTimezone = (date: Date) => {
  var tzoffset = new Date().getTimezoneOffset() * 60000; //offset in milliseconds
  return new Date(date.getTime() - tzoffset).toISOString().slice(0, -1);
};
