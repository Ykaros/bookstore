import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { Box, TextField } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Pagination from '@mui/material/Pagination';
import { Book } from '@shared/book';
import axios from 'axios';
import React, { ChangeEvent, useEffect, useState } from 'react';

import { fontStyles } from './styles';

const BooksPane: React.FC<{ category: string; onBookSelect: (book: Book) => void }> = ({ category, onBookSelect }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchBooks = async () => {
      const booksUrl = `/api/books/${category}?page=${currentPage}&searchQuery=${encodeURIComponent(searchQuery)}`;
      try {
        const response = await axios.get(booksUrl);
        const data = response.data;
        setBooks(Array.isArray(data.books) ? data.books : []);
        setTotalPages(Math.ceil(data.totalCount.value / 10));
      } catch (error) {
        const status = error.response ? error.response.status : 'Network failure';
        throw new Error(`HTTP status: ${status}`);
      }
    };
    if (category) {
      fetchBooks().catch(console.error);
    }
  }, [category, currentPage, searchQuery]);

  // input sanitization
  const handleSearchBook = (event: ChangeEvent<HTMLInputElement>) => {
    let inputValue = event.target.value;
    inputValue = inputValue.replace(/<|>|&|'|"|\\/g, '');

    setSearchQuery(inputValue);
    setCurrentPage(1);
  };

  return (
    <div className='pane'>
      <h2>Books</h2>
      <TextField size='small' label='Search Books' value={searchQuery} onChange={handleSearchBook} />
      <Box
        sx={{
          width: '100%',
          maxHeight: '50vh',
          overflowY: 'auto',
        }}
      >
        <List dense>
          {books.map((book) => (
            <ListItem
              key={book._id}
              secondaryAction={
                <IconButton size='small' edge='end' aria-label='carted' onClick={() => onBookSelect(book)}>
                  <AddShoppingCartIcon />
                </IconButton>
              }
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  marginRight: '16px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <img
                  src={`/covers/${book.img_paths}`}
                  alt={book.name}
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                />
              </div>

              <ListItemText primary={book.name} secondary={`${book.author}, $${book.price}`} sx={fontStyles.sx} />
            </ListItem>
          ))}
        </List>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '16px',
          paddingBottom: '16px',
        }}
      >
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(event, page) => setCurrentPage(page)}
          color='primary'
        />
      </Box>
    </div>
  );
};

export default BooksPane;
