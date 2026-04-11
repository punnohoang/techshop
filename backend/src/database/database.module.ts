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
        const isProduction = configService.get<string>('NODE_ENV') === 'production';
        // ✅ Bỏ hoàn toàn option ssl
        return new Pool({
          connectionString: configService.get<string>('DATABASE_URL'),
        });
      },
    },
  ],
  exports: ['DATABASE_POOL'],
})
export class DatabaseModule { }