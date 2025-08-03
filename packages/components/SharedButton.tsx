import React from 'react';

type SharedButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
};

export const SharedButton: React.FC<SharedButtonProps> = ({ label, ...props }) => (
  <button {...props} style={{ padding: '8px 16px', borderRadius: '4px', background: '#007bff', color: '#fff', border: 'none' }}>
    {label}
  </button>
); 