/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Add any webpack customizations here
    config.watchOptions = {
      ...config.watchOptions,
      ignored: [
        '**/node_modules',
        '**/.next',
        'C:\\Users\\shiva\\Application Data'
      ]
    }
    return config
  }
}

module.exports = nextConfig 