import { useState, useEffect } from 'react';

const RATES = {
  GBP: { rate: 1.0, symbol: '£', prefix: true },
  USD: { rate: 1.28, symbol: '$', prefix: true },
  EUR: { rate: 1.18, symbol: '€', prefix: true },
};

export function formatPrice(amountInGbp, currency = 'GBP') {
  const num = Number(amountInGbp || 0);
  const gbpFormatted = `£${num.toFixed(2)}`;

  if (!currency || currency === 'GBP') {
    return gbpFormatted;
  }

  const info = RATES[currency] || RATES.USD;
  const converted = (num * info.rate).toFixed(2);
  const secondary = info.prefix ? `${info.symbol}${converted}` : `${converted}${info.symbol}`;

  return `${gbpFormatted} (${secondary})`;
}

export function useCurrency() {
  const [currency, setCurrency] = useState(
    () => localStorage.getItem('navsa_currency') || 'GBP'
  );

  useEffect(() => {
    function handleCurrencyChange(e) {
      if (e.detail?.currency) {
        setCurrency(e.detail.currency);
      }
    }

    window.addEventListener('navsa-currency-change', handleCurrencyChange);
    return () => window.removeEventListener('navsa-currency-change', handleCurrencyChange);
  }, []);

  return {
    currency,
    formatPrice: (amount) => formatPrice(amount, currency),
  };
}
