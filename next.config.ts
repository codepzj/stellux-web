import type { NextConfig } from 'next'
import path from 'path'

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      '@': path.resolve(__dirname, 'src'),
    },
    resolveExtensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
  },
  /* config options here */
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        hostname: '**',
      },
    ],
  },
  experimental: {
    turbopackFileSystemCacheForDev: true, // 开发环境文件系统缓存，提高开发效率
  },
  reactCompiler: true, // 启用 React 编译器，提高开发效率
}

export default withBundleAnalyzer(nextConfig)
