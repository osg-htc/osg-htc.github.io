'use client'

import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import NextLink from "next/link";
import ExportedImage from "next-image-export-optimizer";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import PhoneIcon from "@mui/icons-material/Phone";

import Title from "@/components/Header/Title";
import { NavigationItem } from "@/components/Header";

// Render dropdowns above the sticky AppBar (zIndex.appBar === 1100).
const MENU_ZINDEX = 1300;

type MenuLevelState = {
	/** Key of the open menu at this level, if any. */
	active: string | null;
	/** Open this menu, or with `null` close whichever is open, immediately. */
	enter: (key: string | null) => void;
	/** Close whichever menu is open, after a short delay. */
	leave: () => void;
};

const MenuLevelContext = createContext<MenuLevelState | null>(null);

/**
 * The menus at one level — the bar, or the items of one dropdown — share
 * which of them is open, so pointing at one closes its siblings at once.
 * Leaving only closes after a delay, so the pointer can cross the sub-pixel
 * gap between a trigger and its menu without flicker; entering anything at
 * the same level cancels that delay.
 */
const MenuLevel = ({ children }: { children: React.ReactNode }) => {
	const [active, setActive] = useState<string | null>(null);
	const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => () => {
		if (timer.current) clearTimeout(timer.current);
	}, []);

	const value = useMemo<MenuLevelState>(() => ({
		active,
		enter: (key) => {
			if (timer.current) clearTimeout(timer.current);
			setActive(key);
		},
		leave: () => {
			if (timer.current) clearTimeout(timer.current);
			timer.current = setTimeout(() => setActive(null), 120);
		},
	}), [active]);

	return <MenuLevelContext.Provider value={value}>{children}</MenuLevelContext.Provider>;
};

/** Identifies a navigation node among its siblings. */
const navKey = (item: NavigationItem) => item.label + (item.path ?? '');

/**
 * A navigation node that may contain children. At the top level it renders as a
 * bar button with a downward caret; nested inside a dropdown it renders as a
 * menu item with a rightward caret that opens a flyout submenu. Leaf nodes are
 * plain anchor links. Recurses to arbitrary depth.
 */
const NavNode = ({ item, top = false }: { item: NavigationItem; top?: boolean }) => {
	const hasChildren = !!item.children?.length;
	const anchorRef = useRef<HTMLElement | null>(null);
	const level = useContext(MenuLevelContext)!;
	const key = navKey(item);
	const open = level.active === key;

	if (!hasChildren) {
		// A plain link has no menu of its own, but pointing at it should still
		// close a sibling's.
		return top ? (
			<Button
				component={NextLink}
				href={item.path ?? '#'}
				onMouseEnter={() => level.enter(null)}
				sx={{ my: 2, color: 'common.white' }}
			>
				{item.label}
			</Button>
		) : (
			<MenuItem component={NextLink} href={item.path ?? '#'} onMouseEnter={() => level.enter(null)}>
				<ListItemText>{item.label}</ListItemText>
			</MenuItem>
		);
	}

	const trigger = top ? (
		<Button
			ref={anchorRef as React.RefObject<HTMLButtonElement>}
			endIcon={<KeyboardArrowDownIcon />}
			sx={{ my: 2, color: 'common.white' }}
		>
			{item.label}
		</Button>
	) : (
		<MenuItem ref={anchorRef as React.RefObject<HTMLLIElement>} sx={{ pr: 1 }}>
			<ListItemText>{item.label}</ListItemText>
			<KeyboardArrowRightIcon fontSize="small" sx={{ ml: 2 }} />
		</MenuItem>
	);

	return (
		<Box onMouseEnter={() => level.enter(key)} onMouseLeave={level.leave} sx={{ display: top ? 'inline-flex' : 'block' }}>
			{trigger}
			<Popper
				open={open}
				anchorEl={anchorRef.current}
				placement={top ? 'bottom-start' : 'right-start'}
				disablePortal
				sx={{ zIndex: MENU_ZINDEX }}
			>
				<Paper elevation={3} sx={{ minWidth: 220 }}>
					<MenuLevel>
						<MenuList dense>
							{item.children!.map((child) => (
								<NavNode key={navKey(child)} item={child} />
							))}
						</MenuList>
					</MenuLevel>
				</Paper>
			</Popper>
		</Box>
	);
};

// Partner logos shown at the top-right of the header.
const partners = [
	{ href: 'https://path-cc.io', src: '/images/logos/Logo_Round_Med.png', alt: 'PATh' },
	{ href: 'https://pelicanplatform.org', src: '/images/logos/PelicanPlatformLogo_Icon.png', alt: 'Pelican Platform' },
	{ href: 'https://iris-hep.org/', src: '/images/logos/IRIS_HEP.png', alt: 'IRIS-HEP' },
];

const DesktopHeader = ({ pages }: { pages: NavigationItem[] }) => {
	return (
		<Toolbar disableGutters>
			<Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 2 }}>
				<Box sx={{ flex: '0 0 auto' }}>
					<Title />
				</Box>
				<Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
					<MenuLevel>
						{pages.map((page) => (
							<NavNode key={navKey(page)} item={page} top />
						))}
					</MenuLevel>
				</Box>
				<Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 0.5, flex: '0 0 auto' }}>
					<Tooltip title="Apply for Account">
						<IconButton component="a" href="https://portal.osg-htc.org/application" sx={{ color: 'common.white' }}>
							<PersonAddAlt1Icon />
						</IconButton>
					</Tooltip>
					<Tooltip title="Contact Us">
						<IconButton component={NextLink} href="/contact" sx={{ color: 'common.white' }}>
							<PhoneIcon />
						</IconButton>
					</Tooltip>
					{partners.map((p) => (
						<Box key={p.href} component="a" href={p.href} target="_blank" rel="noopener" sx={{ display: 'inline-flex', ml: 0.5 }}>
							<ExportedImage
								src={p.src}
								alt={p.alt}
								width={40}
								height={40}
								style={{ width: 40, height: 40, objectFit: 'contain' }}
							/>
						</Box>
					))}
				</Box>
			</Box>
		</Toolbar>
	);
};

export default DesktopHeader;
