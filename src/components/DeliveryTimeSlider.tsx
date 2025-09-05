import React from 'react';

interface DeliveryTimeSliderProps {
  value: number;
  onChange: (value: number) => void;
}

const DeliveryTimeSlider: React.FC<DeliveryTimeSliderProps> = ({ value, onChange }) => {
  const timeOptions = [
    { value: 1, label: '< 1 month' },
    { value: 3, label: '3 months' },
    { value: 6, label: '6 months' },
    { value: 12, label: '1 year' },
    { value: 18, label: '1.5 years' },
    { value: 24, label: '2 years' },
    { value: 25, label: '24+ months' }
  ];

  const getPercentage = (val: number) => {
    const maxIndex = timeOptions.length - 1;
    const index = timeOptions.findIndex(option => option.value === val);
    return (index / maxIndex) * 100;
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const percentage = parseFloat(e.target.value);
    const maxIndex = timeOptions.length - 1;
    const index = Math.round((percentage / 100) * maxIndex);
    onChange(timeOptions[index].value);
  };

  const currentOption = timeOptions.find(option => option.value === value) || timeOptions[0];

  return (
    <div className="w-full space-y-4">
      <div className="relative">
        <input
          type="range"
          min="0"
          max="100"
          step={100 / (timeOptions.length - 1)}
          value={getPercentage(value)}
          onChange={handleSliderChange}
          className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer slider-thumb"
        />
        <div 
          className="absolute top-0 left-0 h-2 bg-gradient-primary rounded-lg pointer-events-none transition-all duration-200"
          style={{ width: `${getPercentage(value)}%` }}
        />
      </div>
      
      <div className="flex justify-center">
        <div className="bg-primary/10 px-4 py-2 rounded-lg">
          <span className="text-sm font-medium text-primary">
            {currentOption.label}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DeliveryTimeSlider;