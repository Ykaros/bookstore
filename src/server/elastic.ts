import { Client } from '@elastic/elasticsearch';
import * as dotenv from 'dotenv';

dotenv.config();

export const esClient = new Client({
  node: process.env.ES_URL,
});