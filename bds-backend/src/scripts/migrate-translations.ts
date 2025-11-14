// scripts/migrate-translations.ts
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Property } from '../entities/property.entity';
import { PropertyService } from '../modules/property/property.service';
import { TranslateService } from '../service/translate.service';
dotenv.config(); // Load .env

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_DATABASE,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  entities: [__dirname + '/../**/*.entity.{ts,js}'],
  synchronize: false,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function migrateTranslations() {
  await AppDataSource.initialize();
  console.log('DataSource initialized');

  const translateService = new TranslateService();
  const propertyRepository = AppDataSource.getRepository(Property);
  const entityManager = AppDataSource.manager;

  const propertyService = new PropertyService(
    propertyRepository,
    null as any,
    null as any,
    translateService,
    null as any,
  );

  const properties = await propertyRepository.find({
    relations: ['type', 'locationInfo', 'owner', 'owner.role'],
  });

  console.log(`Found ${properties.length} properties. Start translating...`);

  for (const property of properties) {
    try {
      await propertyService.saveTranslations(property);
      console.log(`Translated property id=${property.id}`);
    } catch (err) {
      console.error(`Failed to translate property id=${property.id}`, err);
    }
  }

  console.log('Migration finished!');
  await AppDataSource.destroy();
}

migrateTranslations().catch((err) => {
  console.error('Migration failed:', err);
});
