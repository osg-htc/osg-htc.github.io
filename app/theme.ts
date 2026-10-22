'use client';

import NextLink from 'next/link';
import { alpha, createTheme, type Theme } from '@mui/material/styles';
import { osgTheme as baseTheme } from '@chtc/web-components/themes';

/**
 * The two brand colors the legacy site carried as Bootstrap `$secondary` and
 * `$dark`. They are not derivable from the MUI primary/secondary pair, so they
 * get first-class palette entries here rather than being re-typed as hex
 * literals at each call site (hero callout, service sub-navigation).
 */
export const BRAND_ORANGE = '#f4b627';
export const BRAND_NAVY = '#0b1725';

declare module '@mui/material/styles' {
  interface Palette {
    orange: Palette['primary'];
    navy: Palette['primary'];
  }
  interface PaletteOptions {
    orange?: PaletteOptions['primary'];
    navy?: PaletteOptions['primary'];
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    orange: true;
    navy: true;
  }
}

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
    // Explicit contrast text so contained buttons stay legible: dark on the
    // light amber primary, white on the near-black secondary below.
    primary: { contrastText: '#1f2733' },
    // The brand theme states secondary as `rgb(17 24 39)`. MUI's `decomposeColor`
    // splits channels on commas, so the CSS Color 4 space-separated form parses
    // as a single channel and `lighten`/`darken`/`alpha` return invalid colors
    // (`rgb(11, NaN, NaN)`, `rgba(17, , , 0.04)`). A Button sets its background
    // through `--variant-containedBg`, so an invalid value there is invalid at
    // computed-value time and the background falls back to transparent — i.e. it
    // vanishes on hover. Restating main in hex (the same color) and spelling out
    // light/dark keeps every derived value parseable. light/dark have to be
    // explicit because createTheme deep-merges the base palette, which already
    // carries the broken pair, and augmentColor leaves provided channels alone.
    secondary: {
      main: '#111827',
      light: 'rgb(64, 70, 82)',
      dark: 'rgb(13, 19, 31)',
      contrastText: '#ffffff',
    },
    // createTheme only auto-derives light/dark/contrastText for the standard
    // palette keys, so custom ones have to spell every channel out or MUI
    // renders `undefined` backgrounds on hover.
    orange: {
      main: BRAND_ORANGE,
      light: '#f7c95c',
      dark: '#cf9612',
      contrastText: BRAND_NAVY,
    },
    navy: {
      main: BRAND_NAVY,
      light: '#1d3047',
      dark: '#050c14',
      contrastText: BRAND_ORANGE,
    },
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
      // Navy, always-underlined links that lighten once visited. Links that need
      // another color (light-on-dark, navigation) pass a `color` prop rather
      // than `sx`, so this `:visited` rule no longer matches them.
      defaultProps: { color: 'secondary', underline: 'always' },
      variants: [
        {
          props: { color: 'secondary' },
          style: ({ theme }: { theme: Theme }) => ({
            '&:visited': {
              color: theme.palette.secondary.light,
              textDecorationColor: alpha(theme.palette.secondary.light, 0.4),
            },
          }),
        },
      ],
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
