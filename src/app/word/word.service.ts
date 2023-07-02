import { Injectable } from '@nestjs/common';

export const DI_WORD_SERVICE = 'WORD_SERVICE';

export interface IWordService {
  generateRandomWord(): Promise<string>;
}

const words = [
  'rossa',
  'jetty',
  'wizzo',
  'cuppa',
  'cohoe',
  'gurks',
  'squad',
  'beisa',
  'shrug',
  'fossa',
  'fluyt',
  'camus',
  'speed',
  'mamil',
  'array',
  'polio',
  'barns',
  'panes',
  'souts',
  'limas',
];

@Injectable()
export class HardcodedWordService implements IWordService {
  generateRandomWord(): Promise<string> {
    const randomIndex = Math.floor(Math.random() * words.length);
    return Promise.resolve(words[randomIndex]);
  }
}
