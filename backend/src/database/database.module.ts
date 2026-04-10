import { Module, Global } from '@nestjs/common';
import { Pool } from 'pg';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  providers: [
    {
      provide: 'DATABASE_POOL',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return new Pool({
          connectionString: configService.get<string>('DATABASE_URL'),
          ssl: { rejectUnauthorized: false },
        });
      },
    },
  ],
  exports: ['DATABASE_POOL'],
})
export class DatabaseModule {}