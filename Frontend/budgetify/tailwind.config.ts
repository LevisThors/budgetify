import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                authBlack: "#474747",
                buttonTeal: "#B9E2E6",
                toastGreen: "#1AA103",
            },
            backgroundImage: {
                "gradient-linear":
                    "linear-gradient(to bottom right, #FEC9C7, #FAAEB7, #E487DE, #A498E4, #5DB2ED);",
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
            },
        },
    },
    plugins: [
        require("tailwindcss-animate"),
        function ({ addUtilities }: any) {
            const newUtilities = {
                ".text-cutout": {
                    "background-clip": "text",
                    "-webkit-background-clip": "text",
                    color: "transparent",
                },
            };
            addUtilities(newUtilities);
        },
    ],
};
export default config;
