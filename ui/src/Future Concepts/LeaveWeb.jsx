import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';

export const LeaveWeb = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography
        variant='h3'
        ml={10}
        pb={4}
        sx={{ fontWeight: 'bold', width: 500 }}
      >
        LeaveWeb
      </Typography>
      <Card>
        <CardContent>
          <p>Coming soon! Pay us...</p>
          <iframe
            src='https://giphy.com/embed/EIiJp9cQ3GeEU'
            width='480'
            height='480'
            frameBorder='0'
            allowFullScreen
          ></iframe>
        </CardContent>
      </Card>
    </Box>
  );
};