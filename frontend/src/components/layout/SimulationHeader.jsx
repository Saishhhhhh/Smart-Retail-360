import React, { useState, useEffect } from 'react';
import { Calendar, Play } from 'lucide-react';
import { getSimulatedDate, runNextDay } from '../../services/simulationService';
import Button from '../common/Button';

const SimulationHeader = ({ onSimulationRun }) => {
  const [simulatedDate, setSimulatedDate] = useState(getSimulatedDate());
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    setSimulatedDate(getSimulatedDate());
  }, []);

  const handleRunNextDay = async () => {
    setIsRunning(true);
    try {
      const result = await runNextDay();
      setSimulatedDate(result.newDate);
      if (onSimulationRun) {
        onSimulationRun();
      }
    } catch (error) {
      console.error('Simulation error:', error);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Calendar color="#4b5563" size={20} />
          <div>
            <span className="text-sm text-gray-600">Simulated Date:</span>
            <span className="ml-2 text-lg font-semibold text-gray-900">{simulatedDate}</span>
          </div>
        </div>
        <Button
          onClick={handleRunNextDay}
          disabled={isRunning}
          icon={Play}
          className="ml-4"
        >
          {isRunning ? 'Running...' : 'Run Next Day'}
        </Button>
      </div>
    </div>
  );
};

export default SimulationHeader;
