import { config } from 'dotenv';
import { join } from 'path';
import { defineConfig, env } from 'prisma/config';
import { existsSync } from 'fs';
const envPath = join(__dirname, '../.env');
if (existsSync(envPath)) {
  config({ path: envPath });
}
export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: env('DATABASE_URL'),
  },
});
