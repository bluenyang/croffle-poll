import 'dotenv/config';

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as schema from './schema';

const runtimeConfig = useRuntimeConfig();

const connectionString = `postgresql://${runtimeConfig.db.user}:${runtimeConfig.db.password}@${runtimeConfig.db.host}:${runtimeConfig.db.port}/${runtimeConfig.db.database}`;
const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client, { schema });
