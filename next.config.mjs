/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    outputFileTracingExcludes: {
      '*': [
        'public/**/*',
        'node_modules/ffmpeg-static/**/*',
        'node_modules/jimp/**/*',
      ],
    },
    // ffmpeg-static resolves its bundled binary's path via __dirname at require time —
    // if webpack bundles the package into a vendor chunk, __dirname points at the
    // chunk's location instead of the real node_modules/ffmpeg-static folder, and the
    // binary path breaks (ENOENT). Keeping it external makes it load normally from
    // node_modules at runtime instead.
    serverComponentsExternalPackages: ["ffmpeg-static"],
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;

