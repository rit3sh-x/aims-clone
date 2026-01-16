import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

type GlobalDb = {
    pgPool?: Pool;
    drizzleDb?: NodePgDatabase<typeof schema>;
};

const globalForDb = globalThis as unknown as GlobalDb;

export const pool =
    globalForDb.pgPool ??
    new Pool({
        connectionString: process.env.DATABASE_URL,
        max: 5,
        idleTimeoutMillis: 30_000,
    });

export const db: NodePgDatabase<typeof schema> =
    globalForDb.drizzleDb ??
    drizzle(pool, {
        schema,
    });

if (process.env.NODE_ENV !== "production") {
    globalForDb.pgPool = pool;
    globalForDb.drizzleDb = db;
}
