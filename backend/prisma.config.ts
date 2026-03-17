import { config } from 'dotenv';
import { join } from 'path';
import { defineConfig, env } from 'prisma/config';
config({ path: join(__dirname, '../.env') });
export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: env('DATABASE_URL'),
  },
});
