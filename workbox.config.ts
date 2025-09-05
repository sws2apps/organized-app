import { generateSW } from 'workbox-build';

export default generateSW({
  swDest: 'dist/service-worker.js',
  globDirectory: 'dist/',
  globPatterns: [
    '**/*.{ico,json,png,html,js,css,webmanifest,pdf,svg,woff,woff2,ttf}',
  ],
  ignoreURLParametersMatching: [/^utm_/, /^fbclid$/, /^v$/],
  maximumFileSizeToCacheInBytes: 12582912,
  sourcemap: false,
}).then(({ count, size, warnings, filePaths }) => {
  if (warnings.length > 0) {
    console.warn(
      'Warnings encountered while generating a service worker:',
      warnings.join('\n')
    );
  }

  const appSize = (size / (1024 * 1024)).toFixed(2);

  console.log(
    `The service worker files were written to:\n  • ${filePaths.join('\n  • ')}`
  );

  console.log(
    `The service worker will precache ${count} URLs, totaling ${appSize} MB.`
  );
});
