import { v4 as uuidv4 } from 'uuid';

export function Id<T extends string>(id?: string): T {
  return (id || uuidv4()) as T;
}
