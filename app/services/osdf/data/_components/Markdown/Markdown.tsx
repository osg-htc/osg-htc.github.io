'use client';

import ReactMarkdown, { type Components } from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { Box, Link, Typography } from '@mui/material';

export interface MarkdownProps {
  children: string;
}

const components: Components = {
  h1: ({ children }) => (
    <Typography variant='h4' component='h2' gutterBottom sx={{ mt: 3 }}>
      {children}
    </Typography>
  ),
  h2: ({ children }) => (
    <Typography variant='h5' component='h3' gutterBottom sx={{ mt: 3 }}>
      {children}
    </Typography>
  ),
  h3: ({ children }) => (
    <Typography variant='h6' component='h4' gutterBottom sx={{ mt: 2 }}>
      {children}
    </Typography>
  ),
  p: ({ children }) => (
    <Typography variant='body1' paragraph>
      {children}
    </Typography>
  ),
  // The descriptions come from fabaid.io, not this repository, and some write
  // links as `www.example.org`, which a browser resolves as a relative path.
  a: ({ children, href }) => (
    <Link
      href={href?.startsWith('www.') ? `https://${href}` : href}
      target='_blank'
      rel='noopener noreferrer'
    >
      {children}
    </Link>
  ),
  ul: ({ children }) => (
    <Box component='ul' sx={{ pl: 3, mb: 2 }}>
      {children}
    </Box>
  ),
  ol: ({ children }) => (
    <Box component='ol' sx={{ pl: 3, mb: 2 }}>
      {children}
    </Box>
  ),
  li: ({ children }) => (
    <Typography component='li' variant='body1' sx={{ mb: 0.5 }}>
      {children}
    </Typography>
  ),
  code: ({ children }) => (
    <Box
      component='code'
      sx={{
        bgcolor: 'grey.100',
        px: 0.5,
        borderRadius: 0.5,
        fontFamily: 'monospace',
        fontSize: '0.9em',
        wordBreak: 'break-word',
      }}
    >
      {children}
    </Box>
  ),
};

export default function Markdown({ children }: MarkdownProps) {
  /*
   * `rehypeRaw` because these descriptions are markdown that also contains raw
   * HTML — the NCAR repository embeds `<img>` tags and a `<br>`. Without it
   * react-markdown escapes the tags and prints them, which is what this page
   * did. The content comes from fabaid.io, the same trust level as the rest of
   * the federated content this site renders.
   */
  return (
    <ReactMarkdown rehypePlugins={[rehypeRaw]} components={components}>
      {children}
    </ReactMarkdown>
  );
}

