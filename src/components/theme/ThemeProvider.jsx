import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({
	isDark: false,
	toggle: () => {},
	setTheme: (theme) => {},
});

export function ThemeProvider({ children }) {
	const [isDark, setIsDark] = useState(false);

	useEffect(() => {
		try {
			const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
			const saved = localStorage.getItem('iakwe-hr-theme');
			const initial = saved ? saved === 'dark' : prefersDark;
			setIsDark(initial);
			document.documentElement.classList.toggle('dark', initial);
		} catch (e) {
			// ignore (SSR / test environments)
		}
	}, []);

	const toggle = () => {
		setIsDark((prev) => {
			const next = !prev;
			try {
				localStorage.setItem('iakwe-hr-theme', next ? 'dark' : 'light');
				document.documentElement.classList.toggle('dark', next);
			} catch (e) {}
			return next;
		});
	};

	const setTheme = (theme) => {
		const dark = theme === 'dark';
		setIsDark(dark);
		try {
			localStorage.setItem('iakwe-hr-theme', theme);
			document.documentElement.classList.toggle('dark', dark);
		} catch (e) {}
	};

	return (
		<ThemeContext.Provider value={{ isDark, toggle, setTheme }}>
			{children}
		</ThemeContext.Provider>
	);
}

export const useTheme = () => {
	const ctx = useContext(ThemeContext);
	if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
	return ctx;
};

