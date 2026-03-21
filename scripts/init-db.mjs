import { readFile, access } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import pg from "pg";

const { Pool } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

const toBool = (value, fallback = false) => {
  if (value === undefined || value === null || value === "") return fallback;
  return String(value).trim().toLowerCase() === "true";
};

const stripWrappingQuotes = (value) => {
  const trimmed = String(value || "").trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
};

const loadEnvFile = async (relativeFilePath) => {
  const fullPath = path.join(projectRoot, relativeFilePath);

  try {
    await access(fullPath);
  } catch {
    return;
  }

  const fileContents = await readFile(fullPath, "utf8");
  const lines = fileContents.split(/\r?\n/);

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const separatorIndex = line.indexOf("=");
    if (separatorIndex === -1) continue;

    const key = line.slice(0, separatorIndex).trim();
    const value = stripWrappingQuotes(line.slice(separatorIndex + 1));

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
};

const getLocalConnectionConfig = (databaseOverride) => ({
  user: process.env.PGUSER || "postgres",
  host: process.env.PGHOST || "localhost",
  database: databaseOverride || process.env.PGDATABASE || "swadpoint_db",
  password: process.env.PGPASSWORD || "123456",
  port: Number(process.env.PGPORT || 5432),
});

const buildPool = (databaseOverride) => {
  const appTimezone = process.env.APP_TIMEZONE || "Asia/Kolkata";
  const pgOptions = `-c TimeZone=${appTimezone}`;
  const databaseUrl = process.env.DATABASE_URL;
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

  return new Pool({
    ...getLocalConnectionConfig(databaseOverride),
    options: pgOptions,
    ssl,
  });
};

const quoteIdentifier = (value) => `"${String(value || "").replace(/"/g, '""')}"`;

const ensureLocalDatabaseExists = async () => {
  if (process.env.DATABASE_URL) return false;

  const databaseName = process.env.PGDATABASE || "swadpoint_db";
  const adminPool = buildPool("postgres");

  try {
    await adminPool.query(`CREATE DATABASE ${quoteIdentifier(databaseName)}`);
    console.log(`Created local database ${databaseName}.`);
    return true;
  } catch (error) {
    if (error?.code === "42P04") {
      return true;
    }
    throw error;
  } finally {
    await adminPool.end();
  }
};

const run = async () => {
  await loadEnvFile(".env.local");
  await loadEnvFile(".env");

  const sqlPath = path.join(projectRoot, "documentation", "sql", "postgres-init.sql");
  const sql = await readFile(sqlPath, "utf8");
  let pool = buildPool();

  try {
    await pool.query(sql);
  } catch (error) {
    await pool.end();
    pool = null;

    if (error?.code !== "3D000") {
      throw error;
    }

    await ensureLocalDatabaseExists();
    pool = buildPool();
    await pool.query(sql);
  } finally {
    if (pool) {
      await pool.end();
    }
  }

  console.log("Database setup completed successfully.");
};

run().catch((error) => {
  console.error("Database setup failed.");
  console.error(error.message || error);
  process.exitCode = 1;
});
