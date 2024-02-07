import bodyParser from 'body-parser';
import { Router } from 'express';

import { getAllBooks, getAllBooksByCategory, getAllCategories, getAllOrders, saveOrderToCart } from '../db';

export function apiRouter(): Router {
  const router = Router();
  router.use(bodyParser.json());

  // GET /api/books
  router.get('/api/books', async (req, res) => {
    try {
      const books = await getAllBooks();
      res.json(books);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'An error occurred while fetching books.' });
    }
  });

  // GET /api/books/categories
  router.get('/api/books/categories', async (req, res) => {
    try {
      const categories = await getAllCategories();
      res.json(categories);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'An error occurred while fetching books.' });
    }
  });

  // GET /api/books/:category
  router.get('/api/books/:category', async (req, res) => {
    try {
      const { category } = req.params;
      const { searchQuery } = req.query;
      const page = parseInt(req.query.page as string) || 1;

      // 10 books per page
      const limit = 10;

      const { books, totalCount } = await getAllBooksByCategory(category, searchQuery as string, page, limit);
      res.json({ books, totalCount });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'An error occurred while fetching books.' });
    }
  });

  // GET /api/orders
  router.get('/api/orders', async (req, res) => {
    try {
      const orders = await getAllOrders();
      res.json(orders);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'An error occurred while fetching orders.' });
    }
  });
  // POST /api/orders
  router.post('/api/orders', async (req, res) => {
    try {
      const order = req.body;
      await saveOrderToCart(order);
      res.json({ message: 'Order saved successfully.' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'An error occurred while saving the order.' });
    }
  });

  return router;
}
