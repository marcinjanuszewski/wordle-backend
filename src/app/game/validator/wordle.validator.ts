import { LetterGuessDto } from '../dtos/letter-guess.dto';
import { GameGuessResult } from '../types/game-guess-result.enum';

export default class WordleValidator {
  public validate(word: string, guess: string): LetterGuessDto[] {
    if (word.length !== guess.length) {
      throw new Error('Word and guess length mismatch');
    }

    const matchMap = new Map();
    const guessChars = guess.toLocaleLowerCase().split('');
    const wordChars = word.toLocaleLowerCase().split('');
    const solutionTaken = wordChars.map(() => false);

    for (let i = 0; i < guessChars.length; i++) {
      if (guessChars[i] === word[i]) {
        matchMap.set(i, GameGuessResult.MATCH);
        solutionTaken[i] = true;
      }
    }

    for (let i = 0; i < guessChars.length; i++) {
      if (matchMap.has(i)) {
        continue;
      }

      if (!wordChars.includes(guessChars[i])) {
        matchMap.set(i, GameGuessResult.ABSENT);
        continue;
      }

      const presentCharIndex = wordChars.findIndex(
        (x, index) => x === guessChars[i] && !solutionTaken[index],
      );

      if (presentCharIndex >= 0) {
        matchMap.set(i, GameGuessResult.PRESENT);
        solutionTaken[presentCharIndex] = true;
      } else {
        matchMap.set(i, GameGuessResult.ABSENT);
      }
    }

    return [...matchMap.keys()].sort().map((guessCharIndex) => ({
      letterIndex: guessCharIndex,
      letter: guessChars[guessCharIndex],
      result: matchMap.get(guessCharIndex),
    }));
  }
}
