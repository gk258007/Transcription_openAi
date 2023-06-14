/** @type {import('next').NextConfig} */

const nextConfig = {
  experimental: {
    appDir: true,
  },
}

  module.exports = {
    webpack5: true,
    webpack: (config) => {
      config.resolve.fallback = { fs: false };
      new this.webpack.DefinePlugin({
        'process.env.FLUENTFFMPEG_COV': false
      })
      return config;
    },
    
  };



module.exports = nextConfig 
