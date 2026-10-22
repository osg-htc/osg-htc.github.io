import type { MDXComponents } from 'mdx/types';
import { Box, Container, Link, Typography } from '@mui/material';
import { MarkdownImage } from '@/components/MarkdownImage';

/**
 * Styles MDX content pages with MUI components and wraps each page in a
 * readable-width container. Applied automatically to every `page.mdx`.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    wrapper: ({ children }) => (
      <Container maxWidth='md' sx={{ py: { xs: 5, md: 8 }, '& > :first-of-type': { mt: 0 } }}>
        {children}
      </Container>
    ),
    h1: ({ children }) => (
      <Typography variant='h2' component='h1' gutterBottom sx={{ mb: 3 }}>
        {children}
      </Typography>
    ),
    h2: ({ children }) => (
      <Typography variant='h4' component='h2' gutterBottom sx={{ mt: 6, mb: 2 }}>
        {children}
      </Typography>
    ),
    h3: ({ children }) => (
      <Typography variant='h5' component='h3' gutterBottom sx={{ mt: 4, mb: 1.5 }}>
        {children}
      </Typography>
    ),
    h4: ({ children }) => (
      <Typography variant='h6' component='h4' gutterBottom sx={{ mt: 3 }}>
        {children}
      </Typography>
    ),
    p: ({ children }) => (
      <Typography paragraph sx={{ lineHeight: 1.7, color: 'text.primary' }}>
        {children}
      </Typography>
    ),
    a: ({ href, children }) => (
      <Link
        href={href ?? '#'}
        sx={{ fontWeight: 600, textUnderlineOffset: '0.15em' }}
      >
        {children}
      </Link>
    ),
    ul: ({ children }) => (
      <Box component='ul' sx={{ pl: 3, mb: 2, '& li': { mb: 0.75 }, lineHeight: 1.7 }}>
        {children}
      </Box>
    ),
    ol: ({ children }) => (
      <Box component='ol' sx={{ pl: 3, mb: 2, '& li': { mb: 0.75 }, lineHeight: 1.7 }}>
        {children}
      </Box>
    ),
    li: ({ children }) => (
      <Typography component='li' sx={{ mb: 0.5 }}>
        {children}
      </Typography>
    ),
    // Styling lives in globals.css so articles rendered by
    // @chtc/web-components get the same pull-quote treatment.
    blockquote: ({ children }) => <Box component='blockquote'>{children}</Box>,
    img: ({ src, alt, width, height }) => (
      <MarkdownImage
        src={src}
        alt={alt}
        width={width}
        height={height}
        style={{
          display: 'block',
          margin: '1.5rem auto',
          border: '1px solid rgba(17,24,39,0.10)',
        }}
      />
    ),
    code: ({ children }) => (
      <Box
        component='code'
        sx={{
          bgcolor: 'grey.100',
          px: 0.75,
          py: 0.25,
          borderRadius: 1,
          fontSize: '0.875em',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
        }}
      >
        {children}
      </Box>
    ),
    pre: ({ children }) => (
      <Box
        component='pre'
        sx={{
          bgcolor: 'secondary.main',
          color: 'common.white',
          p: 2.5,
          my: 3,
          borderRadius: 2,
          overflowX: 'auto',
          fontSize: '0.875rem',
          lineHeight: 1.6,
          '& code': { bgcolor: 'transparent', p: 0, color: 'inherit' },
        }}
      >
        {children}
      </Box>
    ),
    hr: () => <Box component='hr' sx={{ my: 5, border: 0, borderTop: 1, borderColor: 'divider' }} />,
    table: ({ children }) => (
      <Box sx={{ overflowX: 'auto', my: 3 }}>
        <Box
          component='table'
          sx={{
            width: '100%',
            borderCollapse: 'collapse',
            '& th, & td': { border: 1, borderColor: 'divider', p: 1.25, textAlign: 'left' },
            '& thead th': { bgcolor: 'grey.100', fontWeight: 700 },
            '& tbody tr:nth-of-type(even)': { bgcolor: 'grey.50' },
          }}
        >
          {children}
        </Box>
      </Box>
    ),
    ...components,
  };
}
