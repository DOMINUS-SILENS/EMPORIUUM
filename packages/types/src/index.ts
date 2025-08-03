// Shared TypeScript types and interfaces
export * from './auth.types';
export * from './auth';
export * from './order';
export * from './product';
export * from './products';
export * from './user';
export * from './user.zod';

export interface User {
  id: string;
  name: string;
  email: string;
} 