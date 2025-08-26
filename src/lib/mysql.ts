
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
    // If the pool isn't initialized, return null to signal
    // that the calling function should use mock data.
    return null;
  }
  try {
    const [rows, fields] = await pool.execute(sql, params);
    return rows;
  } catch (error) {
    // If there's an actual error with the query or connection during execution
    console.error("Database query failed:", error);
    // Return null to fall back to mock data
    return null;
  }
}
