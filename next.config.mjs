import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // added for compatibility with Next.js app directory when using ESM config
  reactStrictMode: true,
};

export default nextConfig;
