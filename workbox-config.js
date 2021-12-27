module.exports = {
	globDirectory: 'build/',
	globPatterns: [
		'**/*.{ico,json,png,html,js,css,pdf,svg,woff,woff2}'
	],
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	],
	swDest: 'build/service-worker.js',
	maximumFileSizeToCacheInBytes: 10000000,
	sourcemap: false,
};