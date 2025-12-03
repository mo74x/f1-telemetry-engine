import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IngestionService } from './ingestion/ingestion.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const ingestionService = app.get(IngestionService);
  await ingestionService.seedDrivers();
  await ingestionService.seedRaces();
  await ingestionService.streamRaceData();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
