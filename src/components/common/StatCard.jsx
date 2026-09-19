import React from 'react';
import { Card } from './Card';
import { Icon } from './Icon';

export const StatCard = ({ title, value, subtitle, iconName, progress }) => {
  return (
    <Card className="relative bg-white border border-black text-black">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-bold text-black tracking-widest">{title}</p>
          <h3 className="text-xl font-bold text-black mt-1 tracking-tight">{value}</h3>
          {subtitle && <p className="text-xs text-black font-medium mt-1">{subtitle}</p>}
        </div>
        {iconName && (
          <div className="p-2 bg-black text-white border border-black" style={{ borderRadius: '4px' }}>
            <Icon name={iconName} className="text-xl text-white" />
          </div>
        )}
      </div>
      {typeof progress === 'number' && (
        <div className="mt-3">
          <div className="w-full bg-white h-1.5 overflow-hidden border border-black" style={{ borderRadius: '2px' }}>
            <div className="bg-black h-1.5" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}
    </Card>
  );
};
