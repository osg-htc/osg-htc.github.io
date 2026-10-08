import { Box, Link, Typography } from '@mui/material';
import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

const MarkdownContainer = ({ content }: { content: string }) => {
  return (
    <Markdown
      rehypePlugins={[rehypeRaw]}
      components={{
        h1: ({ children }) => (
          <Typography variant='h4' component={'h2'} gutterBottom>
            {children}
          </Typography>
        ),
        h2: ({ children }) => (
          <Typography variant='h5' component={'h3'} gutterBottom>
            {children}
          </Typography>
        ),
        h3: ({ children }) => (
          <Typography variant='h6' component={'h4'} gutterBottom>
            {children}
          </Typography>
        ),
        h4: ({ children }) => (
          <Typography variant='subtitle1' pb={2} gutterBottom>
            {children}
          </Typography>
        ),
        h5: ({ children }) => (
          <Typography variant='subtitle2' pb={2} gutterBottom>
            {children}
          </Typography>
        ),
        h6: ({ children }) => (
          <Typography variant='caption'>{children}</Typography>
        ),
        p: ({ children }) => (
          <Typography variant='body1' paragraph sx={{ lineHeight: 1.7 }}>
            {children}
          </Typography>
        ),
        li: ({ children }) => <li>{children}</li>,
        ul: ({ children }) => (
          <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
            {children}
          </ul>
        ),
        a: ({ children, href }) => (
          <Link
            href={href ?? '#'}
            sx={{
              color: '#b45309',
              fontWeight: 600,
              textUnderlineOffset: '0.15em',
              '&:hover': { color: 'primary.main', textDecoration: 'underline' },
            }}
          >
            {children}
          </Link>
        ),
        img: ({ src, alt }) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={typeof src === 'string' ? src : ''}
            alt={alt ?? ''}
            style={{ maxWidth: '100%', height: 'auto', borderRadius: 12, margin: '1rem 0' }}
          />
        ),
        strong: ({ children }) => (
          <Box component='span' display='inline' fontWeight='bold'>
            {children}
          </Box>
        ),
        div: ({ children }) => <Box>{children}</Box>,
      }}
    >
      {content}
    </Markdown>
  );
};

export default MarkdownContainer;
