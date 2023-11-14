import { defineConfig, splitVendorChunkPlugin } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';
import { loadVersion } from '@sws2apps/vite-plugin-package-version';
import { comlink } from 'vite-plugin-comlink';
import { resolve } from 'path';

export default defineConfig({
	baseUrl: './',
	plugins: [react(), splitVendorChunkPlugin(), comlink(), eslint(), loadVersion()],
	resolve: {
		alias: [
			{ find: '@assets', replacement: resolve(__dirname, 'src/v3/assets') },
			{ find: '@components', replacement: resolve(__dirname, 'src/v3/components/index.js') },
			{ find: '@icons', replacement: resolve(__dirname, 'src/v3/components/icons/index.js') },
		],
	},
	worker: { plugins: [comlink()] },
	server: {
		port: 4050,
		host: true,
	},
	preview: {
		port: 4050,
	},
	minifyInternalExports: true,
	build: {
		chunkSizeWarningLimit: 2500,
		target: 'esnext',
	},
});
