import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["oevpckkyucazqpanntoq.supabase.co"],
    // remotePatterns: [
    //   {
    //     // This pattern will match any image URL that is hosted on supabase
    //     protocol: "https",
    //     hostname: "oevpckkyucazqpanntoq.supabase.co",
    //     port: "",
    //     pathname: "/**",
    //     search: "",
    //   },
    // ],
  },
  output: "standalone",
};

export default nextConfig;
