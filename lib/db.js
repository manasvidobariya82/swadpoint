import pkg from "pg";

const { Pool } = pkg;

let poolInstance = null;

const toBool = (value, fallback = false) => {
  if (value === undefined || value === null || value === "") return fallback;
  return String(value).trim().toLowerCase() === "true";
};

const createPool = () => {
  const appTimezone = process.env.APP_TIMEZONE || "Asia/Kolkata";
  const pgOptions = `-c TimeZone=${appTimezone}`;
  const databaseUrl = process.env.DATABASE_URL;
  const isProduction = process.env.NODE_ENV === "production";
  const ssl = toBool(process.env.POSTGRES_SSL, false)
    ? {
        rejectUnauthorized: toBool(
          process.env.POSTGRES_SSL_REJECT_UNAUTHORIZED,
          false
        ),
      }
    : undefined;

  if (databaseUrl) {
    return new Pool({
      connectionString: databaseUrl,
      options: pgOptions,
      ssl,
    });
  }

  if (isProduction) {
    throw new Error(
      "DATABASE_URL is required in production. Set it in Vercel Project Environment Variables."
    );
  }

  return new Pool({
    user: process.env.PGUSER || "postgres",
    host: process.env.PGHOST || "localhost",
    database: process.env.PGDATABASE || "swadpoint_db",
    password: process.env.PGPASSWORD || "123456",
    port: Number(process.env.PGPORT || 5432),
    options: pgOptions,
    ssl,
  });
};

const getPool = () => {
  if (!poolInstance) {
    poolInstance = createPool();
  }

  return poolInstance;
};

const pool = {
  query(...args) {
    return getPool().query(...args);
  },

  connect(...args) {
    return getPool().connect(...args);
  },

  end(...args) {
    if (!poolInstance) {
      return Promise.resolve();
    }

    return poolInstance.end(...args);
  },
};

export default pool;
