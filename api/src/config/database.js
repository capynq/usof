import mysql from "mysql2/promise";
import {
  DATABASE_DRIVER_TIME_ZONE,
  DATABASE_SESSION_TIME_ZONE,
} from "./constants.js";

export const createDatabasePool = (config) => {
  const pool = mysql.createPool({
    ...config.db,
    connectionLimit: 10,
    timezone: DATABASE_DRIVER_TIME_ZONE,
    dateStrings: true,
    charset: "utf8mb4",
    decimalNumbers: true,
    multipleStatements: false,
  });
  pool.on("connection", (connection) => {
    connection.query(
      `SET time_zone = '${DATABASE_SESSION_TIME_ZONE}'`,
      (error) => {
        if (error) connection.destroy();
      },
    );
  });
  return pool;
};

export const transaction = async (pool, operation) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const result = await operation(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};
