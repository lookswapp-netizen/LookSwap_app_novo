import React from 'react';
import type { Option } from '../types';
import { Icon } from './Icon';

interface OptionSelectorProps {
  title: string;
  options: Option[];
  selectedValue: string | string[];
  onSelect: (value: string) => void;
  isMultiColumn?: boolean;
}

export const OptionSelector: React.FC<OptionSelectorProps> = ({ title, options, selectedValue, onSelect, isMultiColumn = false }) => {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold mb-4 text-gray-200">{title}</h3>
      <div className={`grid gap-3 ${isMultiColumn ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'}`}>
        {options.map((option) => {
          const isSelected = Array.isArray(selectedValue)
            ? selectedValue.includes(option.id)
            : selectedValue === option.id;

          return (
            <button
              key={option.id}
              onClick={() => onSelect(option.id)}
              className={`relative p-3 text-sm text-center rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-brand-blue
              ${isSelected
                  ? 'bg-brand-blue/20 border-brand-blue text-white'
                  : 'bg-gray-800 border-gray-700 hover:border-gray-500 text-gray-300'
                }`}
            >
              {isSelected && (
                <span className="absolute top-1.5 right-1.5 text-brand-blue">
                  <Icon name="check" className="w-4 h-4" />
                </span>
              )}
              {option.label}
            </button>
          )
        })}
      </div>
    </div>
  );
};