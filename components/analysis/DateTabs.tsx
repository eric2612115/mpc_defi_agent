// components/analysis/DateTab.tsx
import React from 'react';

export interface DateTabItem {
  date: string; // YYYY-MM-DD format
  label: string;
}

interface DateTabProps {
  tabs: DateTabItem[];
  selectedIndex: number;
  onChange: (index: number) => void;
}

export const DateTabs: React.FC<DateTabProps> = ({ tabs, selectedIndex, onChange }) => {
  return (
    <div className="flex overflow-x-auto pb-2">
      {tabs.map((tab, index) => (
        <button
          className={`mr-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
            selectedIndex === index
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-blue-50'
          }`}
          key={tab.date}
          onClick={() => onChange(index)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};