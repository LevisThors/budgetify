/** @type {import('next').NextConfig} */
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
                hostname: "d15b-95-137-233-69.ngrok-free.app",
            },
        ],
    },
};

export default nextConfig;
