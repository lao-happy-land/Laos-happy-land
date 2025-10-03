import { Injectable } from '@nestjs/common';
import { Translate } from '@google-cloud/translate/build/src/v2';

@Injectable()
export class TranslateService {
  private translate: Translate;

  constructor() {
    this.translate = new Translate({
      keyFilename: 'service-account.json', // hoặc GOOGLE_APPLICATION_CREDENTIALS
    });
  }

  async translateText(
    text: string | null | undefined,
    targetLang: string,
  ): Promise<string> {
    if (!text) return '';

    const input = typeof text === 'string' ? text : String(text);

    try {
      const [translation] = await this.translate.translate(input, targetLang);
      return translation || input;
    } catch (error) {
      console.error('Translate API error:', error);
      return input;
    }
  }
}
