import React from 'react';
import { cn } from '@ui-core/lib/utils';
import { Button } from './Button';
import { Badge } from './badge';

export interface SidebarMenuItem {
  icon: React.ElementType;
  label: string;
  id?: string;
  badge?: string;
  active?: boolean;
  onClick?: () => void;
}

export interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
  menuItems: SidebarMenuItem[];
  header?: React.ReactNode;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  menuItems,
  header,
  className = '',
}) => {
  return (
    <div
      className={cn(
        'fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-slate-900 to-slate-800 transform transition-transform duration-300 ease-in-out',
        isOpen ? 'translate-x-0' : '-translate-x-full',
        className
      )}
    >
      <div className="flex flex-col h-full">
        {header && <div className="p-6 border-b border-slate-700">{header}</div>}
        <div className="flex-1 p-4 space-y-2">
          {menuItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id || item.label}
                variant={item.active ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full justify-start text-left flex items-center gap-3',
                  item.active
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                )}
                onClick={item.onClick}
              >
                <Icon className="h-5 w-5" />
                <span className="flex-1">{item.label}</span>
                {item.badge && <Badge>{item.badge}</Badge>}
              </Button>
            );
          })}
        </div>
        {onClose && (
          <div className="p-4 border-t border-slate-700">
            <Button variant="outline" onClick={onClose} className="w-full">
              Fermer
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
