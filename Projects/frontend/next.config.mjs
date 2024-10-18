/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        ignoreBuildErrors: true,
    },
    experimental: {
        missingSuspenseWithCSRBailout: false,
    },
    images: {
        domains: ['gradelab.io'], // Add the domains you want to allow for image loading
    },
};

export default nextConfig;
