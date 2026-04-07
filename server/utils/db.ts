import 'dotenv/config';

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const runtimeConfig = useRuntimeConfig();
const connectionString = process.env.DATABASE_URL || runtimeConfig.databaseUrl;

const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client, { schema });
