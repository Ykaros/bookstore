import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveIcon from '@mui/icons-material/Remove';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import { Box, IconButton, ListItem, ListItemText, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Book } from '@shared/book';
import axios from 'axios';
import React from 'react';

import { fontStyles, buttonStyles } from './styles';

const CartPane: React.FC<{
  cartItems: { book: Book; quantity: number }[];
  onRemoveFromCart: (bookId: string) => void;
  onUpdateQuantity: (bookId: string, newQuantity: number) => void;
  onClearCart: () => void;
}> = ({ cartItems, onRemoveFromCart, onUpdateQuantity, onClearCart }) => {
  // NYC time zone
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  // total price for all books in cart
  const totalPrice = cartItems.reduce((total, item) => total + item.book.price * item.quantity, 0);

  const checkout = async () => {
    try {
      const response = await axios.post(
        '/api/orders',
        {
          items: cartItems,
          totalPrice: totalPrice.toFixed(2),
          timestamp: formatter.format(new Date()),
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      console.log(response.data.message);
      onClearCart();
    } catch (error) {
      console.error('Checkout error:', error.response?.data || error.message);
    }
  };

  return (
    <div className='pane'>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Cart</h2>
        <span>Total: ${totalPrice.toFixed(2)}</span>
      </Box>
      <Box display='flex' gap={4}>
        <Button size='small' startIcon={<RemoveShoppingCartIcon />} sx={buttonStyles.sx} onClick={onClearCart}>
          Empty Cart
        </Button>
        <Button size='small' startIcon={<ShoppingCartCheckoutIcon />} sx={buttonStyles.sx} onClick={checkout}>
          Checkout
        </Button>
      </Box>
      <Box
        sx={{
          width: '100%',
          maxHeight: '66vh',
          overflowY: 'auto',
        }}
      >
        {cartItems.map((item) => (
          <ListItem
            key={item.book._id}
            secondaryAction={
              <IconButton
                size='small'
                edge='end'
                aria-label='delete'
                onClick={() => onRemoveFromCart(item.book._id)}
                sx={{ padding: 0 }}
              >
                <DeleteIcon />
              </IconButton>
            }
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <img
                src={`/covers/${item.book.img_paths}`}
                alt={item.book.name}
                style={{ maxWidth: '56px', maxHeight: '56px', marginRight: '16px', objectFit: 'contain' }}
              />
              <ListItemText
                primary={item.book.name}
                secondary={`$${(item.book.price * item.quantity).toFixed(2)}`}
                sx={fontStyles.sx}
              />
            </Box>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              <IconButton
                onClick={() => {
                  const newQuantity = Math.max(1, item.quantity - 1);
                  onUpdateQuantity(item.book._id, newQuantity);
                }}
                disabled={item.quantity <= 1}
                size='small'
                sx={{
                  padding: 0,
                  '& .MuiSvgIcon-root': { fontSize: '1rem' },
                }}
              >
                <RemoveIcon />
              </IconButton>
              <Typography
                variant='body2'
                sx={{
                  mx: 0,
                  width: '20px',
                  textAlign: 'center',
                }}
              >
                {item.quantity}
              </Typography>
              <IconButton
                onClick={() => {
                  const newQuantity = Math.min(20, item.quantity + 1);
                  onUpdateQuantity(item.book._id, newQuantity);
                }}
                disabled={item.quantity >= 20}
                size='small'
                sx={{
                  padding: 0,
                  '& .MuiSvgIcon-root': { fontSize: '1rem' },
                }}
              >
                <AddIcon />
              </IconButton>
            </Box>
          </ListItem>
        ))}
      </Box>
    </div>
  );
};

export default CartPane;
