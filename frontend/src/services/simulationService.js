// Mock Simulation Service
// This will be replaced with actual API calls later

let simulatedDate = new Date('2021-12-05');

export const getSimulatedDate = () => {
  return simulatedDate.toISOString().split('T')[0];
};

export const runNextDay = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Advance date by one day
  simulatedDate.setDate(simulatedDate.getDate() + 1);
  
  console.log('Simulation Triggered - Date advanced to:', getSimulatedDate());
  
  // In real implementation, this would call the backend API
  // which would run simulator.py and update inventory_state.csv
  
  return {
    success: true,
    newDate: getSimulatedDate(),
    message: 'Simulation completed successfully'
  };
};
