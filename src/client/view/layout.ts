const styles = {
  pageContainer: {
    display: 'flex',
    justifyContent: 'space-between' as const,
    padding: '20px',
    gap: '16px',
    flexWrap: 'wrap' as const,
  },
  paneContainer: {
    flex: 1,
    border: '1px solid black',
    borderRadius: '5px',
    padding: '20px',
    boxSizing: 'border-box' as const,
    minWidth: '250px',
    margin: '8px',
  },
};

export default styles;
