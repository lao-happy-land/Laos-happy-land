// scripts/migrate-all-translations.ts
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

import { Property } from '../entities/property.entity';
import { PropertyService } from '../modules/property/property.service';

import { Bank } from '../entities/bank.entity';
import { LocationInfo } from '../entities/location-info.entity';
import { News } from '../entities/news.entity';
import { NewsType } from '../entities/news-type.entity';
import { PropertyType } from '../entities/property-type.entity';

import { TranslateService } from '../service/translate.service';

dotenv.config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_DATABASE,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  entities: [__dirname + '/../**/*.entity.{ts,js}'],
  synchronize: false,
  ssl: { rejectUnauthorized: false },
});

async function migrateAll() {
  await AppDataSource.initialize();
  console.log('DataSource initialized');

  const translateService = new TranslateService();

  // REPOSITORIES
  const propertyRepo = AppDataSource.getRepository(Property);
  const bankRepo = AppDataSource.getRepository(Bank);
  const locationRepo = AppDataSource.getRepository(LocationInfo);
  const newsRepo = AppDataSource.getRepository(News);
  const newsTypeRepo = AppDataSource.getRepository(NewsType);
  const propertyTypeRepo = AppDataSource.getRepository(PropertyType);

  // PROPERTY SERVICE (dùng lại logic gốc)
  const propertyService = new PropertyService(
    propertyRepo,
    null as any,
    null as any,
    translateService,
    null as any,
  );

  const langs = ['vi', 'en', 'lo'];

  // ===============================
  // 1️⃣ MIGRATE PROPERTY
  // ===============================
  // const properties = await propertyRepo.find({
  //   relations: ['type', 'locationInfo', 'owner', 'owner.role'],
  // });

  // console.log(`\n--- PROPERTY: ${properties.length}`);

  // for (const p of properties) {
  //   try {
  //     await propertyService.saveTranslations(p);
  //     console.log(`✔ Property: ${p.id}`);
  //   } catch (err) {
  //     console.error(`❌ Property failed: ${p.id}`, err);
  //   }
  // }

  // ===============================
  // 2️⃣ MIGRATE BANK
  // ===============================
  const banks = await bankRepo.find();

  console.log(`\n--- BANK: ${banks.length}`);

  for (const bank of banks) {
    try {
      const translated: Record<string, any> = {};

      for (const lang of langs) {
        translated[lang] = {
          name: bank.name
            ? await translateService.translateText(bank.name, lang)
            : null,
          termRates: bank.termRates
            ? await Promise.all(
                bank.termRates.map(async (t) => ({
                  ...t,
                  term: t.term
                    ? await translateService.translateText(t.term, lang)
                    : t.term,
                })),
              )
            : [],
        };
      }

      bank.translatedContent = translated;
      await bankRepo.save(bank);

      console.log(`✔ Bank: ${bank.id}`);
    } catch (err) {
      console.error(`❌ Bank failed: ${bank.id}`, err);
    }
  }

  // ===============================
  // 3️⃣ MIGRATE LOCATION INFO
  // ===============================
  const locations = await locationRepo.find();

  console.log(`\n--- LOCATION INFO: ${locations.length}`);

  for (const loc of locations) {
    try {
      const translated: Record<string, any> = {};

      for (const lang of langs) {
        translated[lang] = {
          name: loc.name
            ? await translateService.translateText(loc.name, lang)
            : null,
        };
      }

      loc.translatedContent = translated;
      await locationRepo.save(loc);

      console.log(`✔ Location: ${loc.id}`);
    } catch (err) {
      console.error(`❌ Location failed: ${loc.id}`, err);
    }
  }

  // ===============================
  // 4️⃣ MIGRATE NEWS
  // ===============================
  const newsList = await newsRepo.find({ relations: ['type'] });

  console.log(`\n--- NEWS: ${newsList.length}`);

  for (const news of newsList) {
    try {
      const translated: Record<string, any> = {};

      for (const lang of langs) {
        const details = Array.isArray(news.details)
          ? await Promise.all(
              news.details.map(async (item) => {
                if (item?.value && item.type !== 'image') {
                  return {
                    ...item,
                    value: await translateService.translateText(item.value, lang),
                  };
                }
                return item;
              }),
            )
          : null;

        translated[lang] = {
          title: await translateService.translateText(news.title, lang),
          typeName: news.type?.name
            ? await translateService.translateText(news.type.name, lang)
            : null,
          details,
        };
      }

      news.translatedContent = translated;
      await newsRepo.save(news);

      console.log(`✔ News: ${news.id}`);
    } catch (err) {
      console.error(`❌ News failed: ${news.id}`, err);
    }
  }

  // ===============================
  // 5️⃣ MIGRATE NEWS TYPE
  // ===============================
  const newsTypes = await newsTypeRepo.find();

  console.log(`\n--- NEWS TYPE: ${newsTypes.length}`);

  for (const t of newsTypes) {
    try {
      const translated: Record<string, any> = {};

      for (const lang of langs) {
        translated[lang] = {
          name: t.name
            ? await translateService.translateText(t.name, lang)
            : null,
        };
      }

      t.translatedContent = translated;
      await newsTypeRepo.save(t);

      console.log(`✔ NewsType: ${t.id}`);
    } catch (err) {
      console.error(`❌ NewsType failed: ${t.id}`, err);
    }
  }

  // ===============================
  // 6️⃣ MIGRATE PROPERTY TYPE
  // ===============================
  const propertyTypes = await propertyTypeRepo.find();

  console.log(`\n--- PROPERTY TYPE: ${propertyTypes.length}`);

  for (const t of propertyTypes) {
    try {
      const translated: Record<string, any> = {};

      for (const lang of langs) {
        translated[lang] = {
          name: t.name
            ? await translateService.translateText(t.name, lang)
            : null,
        };
      }

      t.translatedContent = translated;
      await propertyTypeRepo.save(t);

      console.log(`✔ PropertyType: ${t.id}`);
    } catch (err) {
      console.error(`❌ PropertyType failed: ${t.id}`, err);
    }
  }

  console.log('\n🎉 ALL TRANSLATIONS MIGRATED!');
  await AppDataSource.destroy();
}

migrateAll().catch((err) => {
  console.error('Migration error:', err);
});
