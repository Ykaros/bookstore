import path from 'path';

import express, { Router } from 'express';

// access static files from the dist folder
export function staticsRouter(): Router {
  const router = Router();

  const staticsPath = path.join(process.cwd(), 'assets/book-covers');
  router.use('/covers', express.static(staticsPath));
  const assetsPath = path.join(process.cwd(), 'dist', 'client', 'assets');
  router.use('/assets', express.static(assetsPath));
  return router;
}
