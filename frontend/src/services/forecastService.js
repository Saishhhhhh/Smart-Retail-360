// Mock Forecast Service
// This will be replaced with actual API calls later

export const getForecast = async (stockCode = '10080') => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));

  // Generate mock 7-day forecast data
  const today = new Date();
  const dates = [];
  const forecast = [];
  const historical = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
    historical.push(Math.random() * 10 + 2);
  }

  for (let i = 1; i <= 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    forecast.push(Math.random() * 15 + 3);
  }

  return {
    stockCode,
    productName: 'WHITE METAL LANTERN',
    historical: dates.map((date, idx) => ({
      date,
      value: historical[idx]
    })),
    forecast: dates.slice(-7).map((date, idx) => ({
      date,
      value: forecast[idx]
    }))
  };
};

export const getAvailableStockCodes = async () => {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return [
    { code: '10080', name: 'WHITE METAL LANTERN' },
    { code: '10120', name: 'RED WOOLLY HOTTIE WHITE HEART' },
    { code: '10125', name: 'MINI PAINT SET VINTAGE' },
    { code: '10133', name: 'COFFEE MUG CAT + HAVEN DESIGN' },
    { code: '10135', name: 'BLUE COAT RACK PARIS FASHION' },
    { code: '15036', name: 'MINI PAINT SET VINTAGE' },
    { code: '15039', name: 'ALARM CLOCK BAKELIKE PINK' }
  ];
};
