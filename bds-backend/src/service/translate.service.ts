import { Injectable } from '@nestjs/common';
import { Translate } from '@google-cloud/translate/build/src/v2';

@Injectable()
export class TranslateService {
  private translate: Translate;

  constructor() {
    this.translate = new Translate({
      key: process.env.GOOGLE_TRANSLATE_API_KEY,
    });
  }

  async translateText(text: string, targetLang: string) {
    const [translation] = await this.translate.translate(text, targetLang);
    return translation;
  }
}
