import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import App from './App';
import './inter.css';
import './global.css';
import './index.css';

const cache = createCache({
	key: 'css',
	prepend: true,
});

const theme = createTheme({
	typography: {
		allVariants: {
			fontFamily: 'Inter',
		},
	},
});

const RootWrap = () => {
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<CacheProvider value={cache}>
				<App />
			</CacheProvider>
		</ThemeProvider>
	);
};

export default RootWrap;
