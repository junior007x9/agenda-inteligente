// next.config.js

const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  disable: false, // Ativado para testarmos o Service Worker localmente
  register: true,
  skipWaiting: true,
  customWorkerDir: "worker", // Compila o nosso arquivo worker/index.js junto com o PWA
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {},
};

module.exports = withPWA(nextConfig);