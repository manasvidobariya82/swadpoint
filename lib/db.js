import pkg from "pg";

const { Pool } = pkg;

const APP_TIMEZONE = process.env.APP_TIMEZONE || "Asia/Kolkata";
const PG_OPTIONS = `-c TimeZone=${APP_TIMEZONE}`;

const toBool = (value, fallback = false) => {
  if (value === undefined || value === null || value === "") return fallback;
  return String(value).trim().toLowerCase() === "true";
};

const databaseUrl = process.env.DATABASE_URL;
const isProduction = process.env.NODE_ENV === "production";

if (isProduction && !databaseUrl) {
  throw new Error(
    "DATABASE_URL is required in production. Set it in Vercel Project Environment Variables."
  );
}

const pool = databaseUrl
  ? new Pool({
      connectionString: databaseUrl,
      options: PG_OPTIONS,
      ssl: toBool(process.env.POSTGRES_SSL, false)
        ? {
            rejectUnauthorized: toBool(
              process.env.POSTGRES_SSL_REJECT_UNAUTHORIZED,
              false
            ),
          }
        : undefined,
    })
  : new Pool({
      user: process.env.PGUSER || "postgres",
      host: process.env.PGHOST || "localhost",
      database: process.env.PGDATABASE || "swadpoint_db",
      password: process.env.PGPASSWORD || "123456",
      port: Number(process.env.PGPORT || 5432),
      options: PG_OPTIONS,
      ssl: toBool(process.env.POSTGRES_SSL, false)
        ? {
            rejectUnauthorized: toBool(
              process.env.POSTGRES_SSL_REJECT_UNAUTHORIZED,
              false
            ),
          }
        : undefined,
    });

export default pool;
