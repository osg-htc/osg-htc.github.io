import { Box, Link, Typography } from '@mui/material';
import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { MarkdownImage } from '@/components/MarkdownImage';

/** The body column is two thirds of a default `md` container at most. */
const BODY_IMAGE_SIZES = '(max-width: 900px) 100vw, 600px';

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
            sx={{ fontWeight: 600, textUnderlineOffset: '0.15em' }}
          >
            {children}
          </Link>
        ),
        img: ({ src, alt, width, height }) => (
          <MarkdownImage
            src={src}
            alt={alt}
            width={width}
            height={height}
            sizes={BODY_IMAGE_SIZES}
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
