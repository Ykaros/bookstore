import AddIcon from '@mui/icons-material/Add';
import { Box, Button, List, ListItem } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

import { buttonStyles } from './styles';

const CategoryPane: React.FC<{ onCategorySelect: (category: string) => void }> = ({ onCategorySelect }) => {
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const categoriesUrl = '/api/books/categories';
    axios
      .get(categoriesUrl)
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error('Failed to load categories:', error.response?.data || error.message);
      });
  }, []);

  return (
    <div className='category-pane' style={{ textAlign: 'left' }}>
      <h2>Categories</h2>
      <Box
        // parameters to fit in browser
        sx={{
          width: '100%',
          maxHeight: '72vh',
          overflowY: 'auto',
        }}
      >
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
          {categories.map((category, index) => (
            <ListItem key={index} sx={{ justifyContent: 'flex-start', padding: 0 }}>
              <Button
                size='small'
                variant='contained'
                onClick={() => onCategorySelect(category)}
                sx={buttonStyles.sx}
                startIcon={<AddIcon />}
              >
                {category}
              </Button>
            </ListItem>
          ))}
        </List>
      </Box>
    </div>
  );
};

export default CategoryPane;
