/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  
}

module.exports = nextConfig

module.exports = {
  async rewrites() {
      return [
        {
          source: `/Api/v2/produtos/json&estoque=S&apikey=${process.env.NEXT_PUBLIC_BLING_KEY}`,
          destination: `https://bling.com.br/Api/v2/produtos/json&estoque=S&apikey=${process.env.NEXT_PUBLIC_BLING_KEY}`,
        },
      ]
    },
};

module.exports = {
  async headers() {
    return [
      {
        // matching all API routes
        source: `/Api/v2/produtos/json&estoque=S&apikey=${process.env.NEXT_PUBLIC_BLING_KEY}`,
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
        ]
      }
    ]
  }
};