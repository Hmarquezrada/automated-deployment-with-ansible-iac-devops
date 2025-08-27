/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración para Vercel
  output: 'standalone',
  
  // Configuraciones adicionales para compatibilidad
  experimental: {
    esmExternals: true,
  },
  
  // Configuración de webpack para mejor compatibilidad
  webpack: (config, { isServer }) => {
    // Configuración adicional si es necesario
    return config;
  },
};

module.exports = nextConfig;
