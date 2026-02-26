import dotenv from 'dotenv';

dotenv.config();

export const env = {
  PORT: parseInt(process.env['PORT'] ?? '3000', 10),
  MONGO_URI: process.env['MONGO_URI'] ?? 'mongodb://localhost:27017/myapp',
  LOG_LEVEL: process.env['LOG_LEVEL'] ?? 'info',
};
