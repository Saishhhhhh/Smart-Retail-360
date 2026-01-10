// Mock Inventory Service
// This will be replaced with actual API calls later

export const getInventory = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));

  // Mock data based on inventory_state.csv structure
  return [
    {
      StockCode: '10080',
      Predicted_7d_Demand: 2.02,
      Current_Stock: 4,
      Inventory_Status: 'OVERSTOCKED',
      ProductName: 'WHITE METAL LANTERN'
    },
    {
      StockCode: '10120',
      Predicted_7d_Demand: 1.97,
      Current_Stock: 3,
      Inventory_Status: 'OVERSTOCKED',
      ProductName: 'RED WOOLLY HOTTIE WHITE HEART'
    },
    {
      StockCode: '10125',
      Predicted_7d_Demand: 4.63,
      Current_Stock: 7,
      Inventory_Status: 'OVERSTOCKED',
      ProductName: 'MINI PAINT SET VINTAGE'
    },
    {
      StockCode: '10133',
      Predicted_7d_Demand: 10.28,
      Current_Stock: 19,
      Inventory_Status: 'OVERSTOCKED',
      ProductName: 'COFFEE MUG CAT + HAVEN DESIGN'
    },
    {
      StockCode: '10135',
      Predicted_7d_Demand: 10.89,
      Current_Stock: 26,
      Inventory_Status: 'OVERSTOCKED',
      ProductName: 'BLUE COAT RACK PARIS FASHION'
    },
    {
      StockCode: '11001',
      Predicted_7d_Demand: 10.75,
      Current_Stock: 9,
      Inventory_Status: 'HEALTHY',
      ProductName: 'SET 2 TEA TOWELS I LOVE LONDON'
    },
    {
      StockCode: '15030',
      Predicted_7d_Demand: 0.88,
      Current_Stock: 0,
      Inventory_Status: 'UNDERSTOCKED',
      ProductName: 'WRAP CHRISTMAS VILLAGE'
    },
    {
      StockCode: '15034',
      Predicted_7d_Demand: 23.70,
      Current_Stock: 20,
      Inventory_Status: 'HEALTHY',
      ProductName: 'DOORSTOP RETROSPOT'
    },
    {
      StockCode: '15036',
      Predicted_7d_Demand: 78.68,
      Current_Stock: 87,
      Inventory_Status: 'HEALTHY',
      ProductName: 'MINI PAINT SET VINTAGE'
    },
    {
      StockCode: '15039',
      Predicted_7d_Demand: 6.78,
      Current_Stock: 10,
      Inventory_Status: 'HEALTHY',
      ProductName: 'ALARM CLOCK BAKELIKE PINK'
    },
    {
      StockCode: '10002',
      Predicted_7d_Demand: 0.41,
      Current_Stock: 0,
      Inventory_Status: 'UNDERSTOCKED',
      ProductName: 'INFLATABLE POLITICAL GLOBE'
    },
    {
      StockCode: '10109',
      Predicted_7d_Demand: 0.03,
      Current_Stock: 0,
      Inventory_Status: 'UNDERSTOCKED',
      ProductName: 'GLASS APOTHECARY BOTTLE PERFUME'
    }
  ];
};

export const getInventoryByStatus = async (status) => {
  const inventory = await getInventory();
  if (!status || status === 'ALL') return inventory;
  return inventory.filter(item => item.Inventory_Status === status);
};
