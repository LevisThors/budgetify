/** @type {import('next').NextConfig} */
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
    rewrites: () => {
        return [
            {
                source: "/backend/:path*",
                destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/:path*`,
            },
        ];
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "e296-95-137-233-69.ngrok-free.app",
            },
        ],
    },
};

export default withNextIntl(nextConfig);
