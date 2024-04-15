// eslint-disable-next-line no-undef
module.exports = {
  globDirectory: 'dist/',
  globPatterns: ['**/*.{ico,json,png,html,js,css,webmanifest,pdf,svg,woff,woff2,ttf}'],
  ignoreURLParametersMatching: [/^utm_/, /^fbclid$/, /^v$/],
  swDest: 'dist/service-worker.js',
  maximumFileSizeToCacheInBytes: 10000000,
  sourcemap: false,
};
