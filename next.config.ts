import type { NextConfig } from "next";
import { productionSecurityHeaders } from "./src/lib/security-headers";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: productionSecurityHeaders(),
      },
    ];
  },
};

export default nextConfig;
