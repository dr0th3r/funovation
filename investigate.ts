import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './src/lib/server/db/schema';
import fs from 'fs';

const queryClient = postgres('postgres://root:mysecretpassword@localhost:5432/local');
const db = drizzle(queryClient, { schema });

async function check() {
  const users = await db.query.user.findMany();
  const profiles = await db.query.userProfile.findMany();
  fs.writeFileSync('C:\\tmp\\out.json', JSON.stringify({ users, profiles }, null, 2));
  process.exit(0);
}
check();
