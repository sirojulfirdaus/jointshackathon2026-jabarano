import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/client.js';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL must be set before importing @siapsapa/database.');
}

export const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
