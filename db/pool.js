const { Pool, Client } = require("pg");
require("dotenv").config({ path: "./.env" });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

exports.pool = pool;
