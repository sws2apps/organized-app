module.exports = {
  globDirectory: 'dist/',
  globPatterns: ['**/*.{ico,json,png,html,js,css,webmanifest,pdf,svg,woff,woff2}'],
  ignoreURLParametersMatching: [/^utm_/, /^fbclid$/],
  swDest: 'dist/service-worker.js',
  maximumFileSizeToCacheInBytes: 10000000,
  sourcemap: false,
};
