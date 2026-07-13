import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  allowedDevOrigins: [
    ".space-z.ai",
    "space-z.ai",
    "localhost",
    "127.0.0.1",
    "0.0.0.0",
    "21.0.6.142",
    "preview-chat-71089310-93f3-489a-b93d-cf68866c77b6.space-z.ai",
  ],
  experimental: {
    optimizePackageImports: [
      "lucide-react",
    ],
  },
};

export default nextConfig;
