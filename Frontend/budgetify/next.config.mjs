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
};

export default nextConfig;
