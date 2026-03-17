import pkg from "pg";

const { Pool } = pkg;

const pool = new Pool({
  user: process.env.PGUSER || "postgres",
  host: process.env.PGHOST || "localhost",
  database: process.env.PGDATABASE || "restaurant_db",
  password: process.env.PGPASSWORD || "123456",
  port: Number(process.env.PGPORT || 5432),
});

export default pool;
