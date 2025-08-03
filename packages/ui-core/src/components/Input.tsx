// Shared UI Input component
import React from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input: React.FC<InputProps> = (props) => (
  <input {...props} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
);
