const rwfFormatter = new Intl.NumberFormat('en-RW', {
  style: 'currency',
  currency: 'RWF',
  maximumFractionDigits: 0,
});

export const convertUsdToRwf = (value) => {
  const amount = Number(value);
  if (!Number.isFinite(amount)) {
    return 0;
  }
  return amount;
};

export const convertRwfToUsd = (value) => {
  const amount = Number(value);
  if (!Number.isFinite(amount)) {
    return 0;
  }
  return amount;
};

export const formatRwf = (value) => rwfFormatter.format(Math.round(Number(value) || 0));

export const formatUsdAsRwf = (value) => formatRwf(value);
