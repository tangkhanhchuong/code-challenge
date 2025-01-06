import { Pool, PoolClient } from 'pg';
import { dbConfig } from './db.config';

let dbClient: PoolClient | undefined;

const pool = new Pool(dbConfig);

export const getDbClient = () => {
  if (!dbClient) {
    throw new Error('Failed to get Db client');
  }
  return dbClient;
}

export const connectToDb = async () => {
  try {
      dbClient = await pool.connect();
      console.log('Connected to the database');
  } catch (error) {
      console.error('Database connection error:', error);
      throw error;
  }
};