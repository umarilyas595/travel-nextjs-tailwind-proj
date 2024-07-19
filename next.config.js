/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        domains: ['media-cdn.tripadvisor.com', 'lh3.googleusercontent.com']
    }
}

module.exports = nextConfig
