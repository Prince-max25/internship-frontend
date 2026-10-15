const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

// =========================================
// SSL CONFIG
// =========================================
// Aiven's certificate is signed by Aiven's own CA,
// which Node doesn't trust by default. Passing just
// { rejectUnauthorized: true } causes a
// "self-signed certificate in certificate chain" error.
// We need to explicitly hand Node the CA cert to verify
// against, via ssl.ca below.

const getSSLConfig = () => {
  if (process.env.DB_SSL !== "true") {
    return undefined;
  }

  const caPath = path.join(
    __dirname,
    "..",
    "certs",
    "aiven-ca.pem"
  );

  if (!fs.existsSync(caPath)) {
    console.error(
      `SSL is enabled (DB_SSL=true) but no CA certificate was found at ${caPath}. ` +
      "Download it from your Aiven service's Overview tab and save it there."
    );
    return { rejectUnauthorized: true };
  }

  return {
    ca: fs.readFileSync(caPath),
    rejectUnauthorized: true,
  };
};

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,

  // Kept low on purpose: on Vercel, each serverless
  // function instance creates its own pool. Many
  // instances x a high connectionLimit can quickly
  // exceed your database's max_connections under
  // concurrent traffic. 1-3 per instance is safer;
  // raise it only if your DB plan can comfortably
  // support (limit x expected concurrent instances).
  connectionLimit: 3,

  queueLimit: 0,

  // Aiven requires SSL for connections. Set DB_SSL=true
  // in your env vars once you move to Aiven; leave it
  // unset for local XAMPP (which doesn't use SSL).
  ssl: getSSLConfig(),
});

const testDatabaseConnection = async () => {
  try {
    const connection = await pool.getConnection();

    console.log("MySQL connected successfully ✅");

    connection.release();
  } catch (error) {
    console.error("MySQL connection failed ❌");
    console.error(error.message);
  }
};

module.exports = {
  pool,
  testDatabaseConnection,
};