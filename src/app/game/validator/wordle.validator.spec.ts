import WordleValidator from './wordle.validator';

import { GameGuessResult } from '../types/game-guess-result.enum';

type WordleValidateTestCase = {
  word: string;
  guess: string;
  description?: string;
  expectedResult: GameGuessResult[];
};

describe('wordle validator', () => {
  let wordleValidator: WordleValidator;

  beforeAll(() => {
    wordleValidator = new WordleValidator();
  });

  describe('validate', () => {
    const testCases: WordleValidateTestCase[] = [
      {
        word: 'apple',
        guess: 'apoop',
        expectedResult: [
          GameGuessResult.MATCH,
          GameGuessResult.MATCH,
          GameGuessResult.ABSENT,
          GameGuessResult.ABSENT,
          GameGuessResult.PRESENT,
        ],
        description: 'Should be PRESENT for second P',
      },
      {
        word: 'pilot',
        guess: 'apple',
        expectedResult: [
          GameGuessResult.ABSENT,
          GameGuessResult.PRESENT,
          GameGuessResult.ABSENT,
          GameGuessResult.PRESENT,
          GameGuessResult.ABSENT,
        ],
        description: 'Should be ABSENT for second P is there is only 1 P',
      },
      {
        word: 'pilot',
        guess: 'pivot',
        expectedResult: [
          GameGuessResult.MATCH,
          GameGuessResult.MATCH,
          GameGuessResult.ABSENT,
          GameGuessResult.MATCH,
          GameGuessResult.MATCH,
        ],
      },
      {
        word: 'pilot',
        guess: 'pilot',
        expectedResult: [
          GameGuessResult.MATCH,
          GameGuessResult.MATCH,
          GameGuessResult.MATCH,
          GameGuessResult.MATCH,
          GameGuessResult.MATCH,
        ],
      },
      {
        word: 'pilot',
        guess: 'PILOT',
        expectedResult: [
          GameGuessResult.MATCH,
          GameGuessResult.MATCH,
          GameGuessResult.MATCH,
          GameGuessResult.MATCH,
          GameGuessResult.MATCH,
        ],
        description: 'Should find matches even when it has different case',
      },
    ];
    testCases.forEach(({ word, guess, expectedResult }) => {
      it(`should properly validate guess=${guess} for the word=${word}`, () => {
        const result = wordleValidator.validate(word, guess);

        const indexes = result.map((value) => value.letterIndex);
        expect(indexes).toEqual([...indexes].sort());
        expect(result.map((value) => value.letter)).toEqual(
          [...guess].map((e) => e.toLocaleLowerCase()),
        );
        expect(result.map((value) => value.result)).toEqual(expectedResult);
      });
    });
  });
});
