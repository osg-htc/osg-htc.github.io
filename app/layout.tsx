import type { Metadata } from "next";

import {Box} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import CssBaseline from '@mui/material/CssBaseline';

import { osgFonts } from "@chtc/web-components/themes"

import theme from "./theme"
import "./globals.css"
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Analytics from "@/components/Analytics";

export const metadata: Metadata = {
  title: "OSG Consortium",
  description: "The OSG fabric of services delivers distributed high throughput computing to researchers",
	metadataBase: new URL(`https://${process.env.HOSTNAME}`),
};

const pages = [
	{
		label: 'Services',
		children: [
			{
				label: 'OSPool',
				children: [
					{ label: 'Overview', path: '/services/ospool' },
					{ label: 'Institutions', path: '/services/ospool/institutions' },
					{ label: 'Projects', path: '/services/ospool/projects' },
				],
			},
			{
				label: 'OSDF',
				children: [
					{ label: 'Overview', path: '/services/osdf' },
					{ label: 'Projects', path: '/services/osdf/projects' },
					{ label: 'Data', path: '/services/osdf/data' },
					{ label: 'AlphaFold3 Alignment Cache', path: '/services/osdf/alphafold' },
				],
			},
			{
				label: 'Research Computing Facilitation',
				children: [
					{ label: 'Connect With the Team', path: '/services/facilitation' },
					{ label: 'Monthly Training', path: '/services/facilitation/monthly-training' },
				],
			},
			{ label: 'OSG-Operated Access Points', path: '/services/access-point' },
		],
	},
	{
		label: 'Campuses',
		children: [
			{ label: 'Support', path: '/campus/support' },
			{ label: 'CC* Proposals', path: '/campus-cyberinfrastructure' },
			{ label: 'Contributor Documentation', path: 'https://osg-htc.org/campus-docs/' },
		],
	},
	{
		label: 'Community',
		children: [
			{ label: 'Spotlight', path: '/spotlights' },
			{ label: 'News', path: '/news' },
			{ label: 'Events', path: '/events' },
			{ label: 'Presentations', path: '/presentations' },
			{ label: 'Training', path: '/community/training' },
			{ label: 'OSG School', path: '/community/school' },
		],
	},
	{ label: 'Contact', path: '/contact' },
	{
		label: 'About',
		children: [
			{ label: 'Introduction', path: '/about/introduction' },
			{ label: 'Consortium Members', path: '/about/organization' },
			{ label: 'The OSG Team', path: '/team' },
			{ label: 'Publications', path: '/about/publications' },
			{ label: 'Employment Opportunities', path: '/about/employment-opportunities' },
			{ label: 'Acknowledging OSG', path: '/about/acknowledging' },
		],
	},
	{
		label: 'Docs',
		children: [
			{ label: 'For Users', path: 'https://portal.osg-htc.org/documentation/' },
			{ label: 'For Sysadmins', path: 'https://osg-htc.org/docs/' },
			{ label: 'Security', path: 'https://osg-htc.org/security/' },
		],
	},
]

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={osgFonts.map((font) => font.className).join(' ')}>
			{ process.env.NEXT_PUBLIC_MATOMO_URL && process.env.NEXT_PUBLIC_MATOMO_SITE_ID &&
				<Analytics url={process.env.NEXT_PUBLIC_MATOMO_URL} siteId={process.env.NEXT_PUBLIC_MATOMO_SITE_ID} />
			}
      <AppRouterCacheProvider>
        <CssBaseline />
        <Box component={"body"} sx={{ margin: 0, padding: 0, bgcolor: 'background.default', color: 'text.primary', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <ThemeProvider theme={theme}>
						<Header pages={pages} />
						{children}
            <Footer />
          </ThemeProvider>
        </Box>
      </AppRouterCacheProvider>
    </html>
  );
}
