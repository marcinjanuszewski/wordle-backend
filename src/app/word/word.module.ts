import { Module, Provider } from '@nestjs/common';

import { DI_WORD_SERVICE, HardcodedWordService } from './word.service';

const WordServiceProvider: Provider = {
  useClass: HardcodedWordService,
  provide: DI_WORD_SERVICE,
};

@Module({
  providers: [WordServiceProvider],
  exports: [WordServiceProvider],
})
export class WordModule {}
