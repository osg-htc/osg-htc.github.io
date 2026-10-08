import ExportedImage from 'next-image-export-optimizer';
import { Box, Grid, Typography, Paper } from '@mui/material';
import React from 'react';
import { type Staff } from '@chtc/web-components/content';

export function LeaderCard({ name, title, image, institution }: Staff) {
  return (
    <Grid container spacing={2} justifyContent={'center'} mb={2}>
      <Grid
        size={{
          xs: 7,
          sm: 6,
          md: 5,
        }}
      >
        <Paper
          sx={{
            padding: 2,
            borderRadius: '50%',
            bgcolor: 'primary.light',
          }}
        >
          <Box sx={{ position: 'relative', aspectRatio: 1 }}>
            <ExportedImage
              src={image}
              alt={name}
              fill={true}
              sizes='(max-width: 600px) 60vw, (max-width: 1200px) 50vw, 600px'
              style={{
                borderRadius: '1rem',
                objectFit: 'cover',
              }}
            />
          </Box>
        </Paper>
      </Grid>
      <Grid sx={{ pl: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ m: 'auto' }}>
          <Typography variant={'h5'} color={'primary.dark'}>
            {name}
          </Typography>
          <Typography variant={'body1'}>{title}</Typography>
          <Typography variant={'body1'}>{institution}</Typography>
        </Box>
      </Grid>
    </Grid>
  );
}

export function StaffCard({ name, title, image, institution }: Staff) {
  return (
    <Box
      sx={{
        borderRadius: '1rem',
        padding: '1rem',
        backgroundColor: 'white',
        height: '100%',
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      <Paper
        sx={{
          padding: 1,
          borderRadius: '1rem',
          bgcolor: 'primary.light',
        }}
      >
        <ExportedImage
          src={image}
          alt={name}
          height={150}
          width={150}
          style={{
            borderRadius: '1rem',
            objectFit: 'cover',
          }}
        />
      </Paper>

      <Box sx={{ pl: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ m: 'auto' }}>
          <Typography variant={'h5'} color={'primary.dark'}>
            {name}
          </Typography>
          <Typography variant={'subtitle1'}>{title}</Typography>
          <Typography variant={'subtitle1'} lineHeight={1.4}>
            {institution}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
