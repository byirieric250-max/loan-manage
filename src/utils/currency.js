const USD_TO_RWF_RATE = Number(process.env.REACT_APP_USD_TO_RWF_RATE || 1463);

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

  return amount * USD_TO_RWF_RATE;
};

export const convertRwfToUsd = (value) => {
  const amount = Number(value);
  if (!Number.isFinite(amount) || USD_TO_RWF_RATE === 0) {
    return 0;
  }

  return amount / USD_TO_RWF_RATE;
};

export const formatRwf = (value) => rwfFormatter.format(Math.round(Number(value) || 0));

export const formatUsdAsRwf = (value) => formatRwf(convertUsdToRwf(value));

export const usdToRwfRate = USD_TO_RWF_RATE;
