/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  productionBrowserSourceMaps: true,
  images: {
    formats: ['image/webp'],
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }) => {
    // source-map-loader лише для нашого коду; node_modules часто без валідних .map
    config.module.rules.push({
      test: /\.mjs$/,
      enforce: 'pre',
      use: ['source-map-loader'],
      exclude: /node_modules/,
    });
    // Приховати попередження про відсутні source map у залежностях
    if (!config.ignoreWarnings) config.ignoreWarnings = [];
    config.ignoreWarnings.push({ module: /node_modules\/@mediapipe/ });
    config.ignoreWarnings.push({ message: /Failed to parse source map/ });

    return config;
  },
  headers: async () => {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'credentialless',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
