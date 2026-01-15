/** @type {import('next').NextConfig} */
const nextConfig = {
  // Otimizações de performance
  reactStrictMode: true,
  
  // Otimizações do compilador SWC
  compiler: {
    // Remove console.log em produção
    removeConsole: process.env.NODE_ENV === "production" ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  
  // Configuração de imagens otimizada
  images: {
    // Domínios permitidos para imagens externas (Last.fm)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lastfm.freetls.fastly.net',
      },
      {
        protocol: 'https',
        hostname: '**.lastfm.freetls.fastly.net',
      },
    ],
    // Formatos de imagem otimizados
    formats: ['image/avif', 'image/webp'],
    // Tamanhos de dispositivo para responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
  
  // Otimização de pacotes
  experimental: {
    // Otimiza imports de pacotes grandes
    optimizePackageImports: [
      '@mui/icons-material',
      'lucide-react',
      '@iconify/react',
      '@headlessui/react',
    ],
  },
};

export default nextConfig;
