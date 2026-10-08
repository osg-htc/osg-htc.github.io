'use client';

import NextLink from 'next/link';
import { createTheme, type Theme } from '@mui/material/styles';
import { osgTheme as baseTheme } from '@chtc/web-components/themes';

/**
 * Modern presentation layer built on top of the OSG brand theme
 * (`@chtc/web-components/themes`). We keep the brand palette — amber
 * primary (#f6a32a) and near-black secondary — and layer on a contemporary
 * type scale, softer surfaces, rounded shapes, and refreshed component
 * defaults so the modernization propagates to every MUI component site-wide.
 */
const theme = createTheme(baseTheme, {
  shape: { borderRadius: 12 },
  palette: {
    // Explicit contrast text so contained buttons stay legible: white on the
    // dark secondary, dark on the light amber primary (MUI's auto-computed
    // value rendered dark-on-dark for the space-separated secondary color).
    primary: { contrastText: '#1f2733' },
    secondary: { contrastText: '#ffffff' },
    background: {
      default: '#f7f8fa',
      paper: '#ffffff',
    },
    divider: 'rgba(17, 24, 39, 0.10)',
  },
  typography: {
    h1: { fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1.08 },
    h2: { fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.12 },
    h3: { fontWeight: 700, letterSpacing: '-0.015em', lineHeight: 1.18 },
    h4: { fontWeight: 700, letterSpacing: '-0.01em' },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700, letterSpacing: '0.01em' },
    button: { textTransform: 'none', fontWeight: 600, letterSpacing: 0 },
  },
  components: {
    MuiLink: {
      // Underline only on hover (not persistently) so links read cleanly.
      defaultProps: { underline: 'hover' },
    },
    MuiButtonBase: {
      // Route any `<Button href>` / `<IconButton href>` / clickable
      // ButtonBase through next/link so internal links navigate client-side.
      // Set via the theme (not a per-call `component` prop) so it also works
      // from Server Components without passing a function across the RSC
      // boundary. External/mailto hrefs fall back to a normal anchor.
      defaultProps: { LinkComponent: NextLink },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 10, paddingInline: '1.15rem' },
        sizeLarge: { paddingInline: '1.6rem', paddingBlock: '0.7rem' },
        containedPrimary: ({ theme }: { theme: Theme }) => ({
          '&:hover': {
            backgroundColor: theme.palette.primary.dark,
          },
        }),
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: ({ theme }: { theme: Theme }) => ({
          borderRadius: 16,
          border: `1px solid ${theme.palette.divider}`,
          transition: 'box-shadow 0.2s ease, transform 0.2s ease, border-color 0.2s ease',
          '&:hover': {
            transform: 'translateY(-3px)',
            boxShadow: '0 12px 32px rgba(17, 24, 39, 0.10)',
            borderColor: 'transparent',
          },
        }),
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: { borderRadius: 16 },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 8, fontWeight: 600 },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: { fontWeight: 700 },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: { fontSize: '0.8rem', borderRadius: 8, paddingInline: '0.6rem' },
      },
    },
  },
});

export default theme;
