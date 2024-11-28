export const DATABASE_CONFIG = {
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  database: process.env.DATABASE_NAME,
  waitForConnections: true,
  connectionLimit: 20,
  maxIdle: 20, // max idle connections, the value is the same as `connectionLimit`
  idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  password: process.env.DATABASE_PASSWORD,
};
