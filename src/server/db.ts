import { Book } from '@shared/book';

import { MongoClient } from 'mongodb';

import { esClient } from './elastic';

const url = process.env.MONGODB_URL;
const dbName = process.env.MONGODB_NAME;
const client = new MongoClient(url);

// database connection
async function connect() {
  try {
    await client.connect();
    return client.db(dbName);
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    throw err;
  }
}

// all books
export async function getAllBooks() {
  const db = await connect();
  const collection = db.collection<Book>('books');
  return await collection.find({}).toArray();
}

// all categories
export async function getAllCategories() {
  const db = await connect();
  const collection = db.collection<Book>('books');
  return await collection.distinct('category');
}

// books by category and elastic search
export async function getAllBooksByCategory(category: string, searchQuery: string, page: number, limit: number) {
  const from = (page - 1) * limit;

  // Elasticsearch connection
  try {
    await esClient.ping({}, { requestTimeout: 1000 });
  } catch (err) {
    console.error('Error connecting to Elasticsearch', { error: err });
  }

  // query limit
  const MAX_LENGTH = 40;
  if (searchQuery.length > MAX_LENGTH) {
    throw new Error('Input too long');
  }

  // query
  let query;
  if (searchQuery) {
    query = {
      bool: {
        must: [
          { match: { category: category } },
          {
            multi_match: {
              query: searchQuery,
              fields: ['name', 'author'],
              fuzziness: 'AUTO',
              prefix_length: 1,
            },
          },
        ],
      },
    };
  } else {
    query = {
      match: {
        category: category,
      },
    };
  }

  const response = await esClient.search({
    index: 'books',
    from: from,
    size: limit,
    query: query,
  });

  const books = response.hits.hits.map((hit) => ({
    _id: hit._id,
    name: (hit._source as Book).name,
    author: (hit._source as Book).author,
    category: (hit._source as Book).category,
    price: (hit._source as Book).price,
    img_paths: (hit._source as Book).img_paths,
  }));

  const totalCount = response.hits.total;

  return { books, totalCount };
}

// all orders
export async function getAllOrders() {
  const db = await connect();
  const collection = db.collection('cart');
  return await collection.find({}).toArray();
}

// save order
export async function saveOrderToCart(order: any) {
  const db = await connect();
  const collection = db.collection('cart');
  return await collection.insertOne(order);
}

process.on('exit', () => {
  client.close().then((r) => console.log('MongoDB connection closed'));
});
