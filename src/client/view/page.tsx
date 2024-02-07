import { Box } from '@mui/material';
import { Book } from '@shared/book';
import React, { useCallback, useState } from 'react';

import BooksPane from '../components/books';
import CartPane from '../components/cart';
import CategoryPane from '../components/category';

import styles from './layout';

const PageView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [cartBooks, setCartBooks] = useState<{ book: Book; quantity: number }[]>([]);

  // select a category
  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
  };

  // update book quantity
  const handleUpdateQuantity = useCallback(
    (bookId: string, newQuantity: number) => {
      setCartBooks((currentBooks) =>
        currentBooks.map((item) => (item.book._id === bookId ? { ...item, quantity: newQuantity } : item)),
      );
    },
    [setCartBooks],
  );

  // add book to cart
  const handleAddBook = (selectedBook: Book) => {
    setCartBooks((currentBooks) => {
      // if same book is already in cart, increase its quantity
      if (currentBooks.find((item) => item.book._id === selectedBook._id)) {
        return currentBooks.map((item) =>
          item.book._id === selectedBook._id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      } else {
        // otherwise, create this book in cart
        return [...currentBooks, { book: selectedBook, quantity: 1 }];
      }
    });
  };

  // remove book from cart
  const handleRemoveBook = (bookId: string) => {
    setCartBooks((currentItems) => currentItems.filter((item) => item.book._id !== bookId));
  };

  // empty cart
  const handleEmptyCart = () => {
    setCartBooks([]);
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.paneContainer}>
        <CategoryPane onCategorySelect={handleSelectCategory} />
      </div>
      <div style={styles.paneContainer}>
        <BooksPane category={selectedCategory} onBookSelect={handleAddBook} />
      </div>
      <div style={styles.paneContainer}>
        <CartPane
          cartItems={cartBooks}
          onRemoveFromCart={handleRemoveBook}
          onUpdateQuantity={handleUpdateQuantity}
          onClearCart={handleEmptyCart}
        />
      </div>
    </div>
  );
};

export default PageView;
