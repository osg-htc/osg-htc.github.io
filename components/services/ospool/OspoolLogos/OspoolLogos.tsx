import ExportedImage from 'next-image-export-optimizer';
import Link from '@mui/material/Link';
import { Box, Container, Typography } from '@mui/material';

/** "Powered By HTCondor / Operated by PATh" + OSPool logo footer. */
export function OspoolLogos() {
  return (
    <Container maxWidth='lg' sx={{ pb: 5 }}>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 4,
          mt: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Link href='https://htcondor.org/'>
            <ExportedImage
              src='/images/logos/HTCondor_Logo.png'
              alt='HTCondor Logo'
              width={5351}
              height={1684}
              style={{ width: 80, height: 'auto' }}
            />
          </Link>
          <Typography variant='h5' component='p'>
            Powered By <Link href='https://htcondor.org/'>HTCondor</Link>
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Link href='https://path-cc.io'>
            <ExportedImage
              src='/images/logos/Logo_Round_Med.png'
              alt='PATh Logo'
              width={300}
              height={300}
              style={{ width: 80, height: 'auto' }}
            />
          </Link>
          <Typography variant='h5' component='p'>
            Operated by <Link href='https://path-cc.io'>PATh</Link>
          </Typography>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Link href='/services/ospool'>
          <ExportedImage
            src='/images/logos/OSPool_Logo.png'
            alt='OSPool Logo'
            width={3544}
            height={3530}
            style={{ width: 320, height: 'auto' }}
          />
        </Link>
      </Box>
    </Container>
  );
}
