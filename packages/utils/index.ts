// General utility functions for use across apps

export * from './auth';

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}