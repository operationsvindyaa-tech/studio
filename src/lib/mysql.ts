'use server';

import mysql from 'mysql2/promise';

// Function to check if all required environment variables are set
const areDbCredentialsSet = () => {
  return process.env.MYSQL_HOST &&
         process.env.MYSQL_USER &&
         process.env.MYSQL_PASSWORD &&
         process.env.MYSQL_DATABASE;
};

// Create a connection pool only if credentials are provided
const pool = areDbCredentialsSet()
  ? mysql.createPool({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    })
  : null;

// A helper function to execute queries
export async function query(sql: string, params?: any[]) {
  if (!pool) {
    // If the pool isn't initialized, there are no credentials.
    // Throw an error to allow the calling function to fall back to mock data.
    throw new Error("Database credentials are not configured. Falling back to mock data.");
  }
  const [rows, fields] = await pool.execute(sql, params);
  return rows;
}
